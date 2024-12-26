const WebSocket = require('ws');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; // Express server port
const wsPort = 8080; // WebSocket server port
const wsHost = '0.0.0.0'; // WebSocket host

const wss = new WebSocket.Server({ host: wsHost, port: wsPort });

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ci4k-project',
});

// Middleware for Express server
app.use(cors());
app.use(bodyParser.json());

// Establish MySQL connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database `ci4k-project`');
  }
});

// Get lab logs
app.get('/lab_logs', (req, res) => {
  const query = 'SELECT * FROM lab_logs ORDER BY login_time DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching lab logs:', err);
      return res.status(500).json({ message: 'Failed to fetch lab logs.' });
    } else {
      res.status(200).json(results); // Send the results as JSON
    }
  });
});

// Insert client connection data into the database
function insertClientData(clientId, connectionStartTime, isAdmin) {
  const status = isAdmin ? 'Admin Connected' : 'Client Connected';
  const query = 'INSERT INTO clients (client_id, status, connect_time) VALUES (?, ?, ?)';
  db.query(query, [clientId, status, connectionStartTime], (err) => {
    if (err) {
      console.error('Error inserting client data:', err);
    }
  });
}

// Update client disconnect time and duration
function updateDisconnectTime(clientId) {
  const disconnectTime = Date.now();
  const query = `
    UPDATE clients
    SET disconnect_time = ?, duration = ? - connect_time
    WHERE client_id = ? AND disconnect_time IS NULL
  `;
  db.query(query, [disconnectTime, disconnectTime, clientId], (err) => {
    if (err) {
      console.error('Error updating disconnect time:', err);
    }
  });
}

// WebSocket server logic for handling connections
wss.on('connection', (ws) => {
  console.log("A new WebSocket connection was made");

  let clientId = uuidv4(); // Generate a unique client ID for the WebSocket connection
  let connectionStartTime = Date.now();
  let isAdmin = false;

  insertClientData(clientId, connectionStartTime, isAdmin);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);

      // Handle client connect message
      if (data.type === 'clientConnect') {
        const studentID = data.studentID;
        const computerNumber = data.computerNumber || 1;
        const loginTime = new Date();

        // Log the student login with the PC username (studentID)
        logStudentLogin(studentID, computerNumber, loginTime);
      }

      // Handle other message types (e.g., time update)
      else if (data.type === 'timeUpdate') {
        console.log(`Time spent for ${data.studentID}: ${data.timeSpent} seconds`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  // When WebSocket connection closes, log logout time and duration
  ws.on('close', () => {
    console.log('WebSocket connection closed for client:', clientId);
    updateDisconnectTime(clientId);
    // Assuming you can pass the studentID and computerNumber from the session or context
    logStudentLogout('law', 1); // Replace with dynamic studentID/computerNumber as needed
  });

  // Send the generated clientId to the client
  ws.send(JSON.stringify({ type: 'clientConnect', clientId }));
});

// Log student login function
function logStudentLogin(studentID, computerNumber, loginTime) {
  const query = 'INSERT INTO lab_logs (studentID, computer_number, login_time) VALUES (?, ?, ?)';
  db.query(query, [studentID, computerNumber, loginTime], (err) => {
    if (err) {
      console.error('Error logging student login:', err);
    } else {
      console.log('Student login logged successfully');
    }
  });
}

// Log student logout function
function logStudentLogout(studentID, computerNumber) {
  const query = `
    UPDATE lab_logs
    SET logout_time = ?, duration = TIMESTAMPDIFF(SECOND, login_time, ?)
    WHERE studentID = ? AND computer_number = ? AND logout_time IS NULL
  `;
  const logoutTime = new Date();

  db.query(query, [logoutTime, logoutTime, studentID, computerNumber], (err) => {
    if (err) {
      console.error('Error logging student logout:', err);
    } else {
      console.log('Student logout logged successfully');
    }
  });
}

// Periodically fetch and broadcast lab logs every 5 seconds
setInterval(() => {
  const query = 'SELECT * FROM lab_logs ORDER BY login_time DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching lab logs:', err);
    } else {
      broadcastLabLogs(results);
    }
  });
}, 5000);

// Broadcast lab logs to all connected WebSocket clients
function broadcastLabLogs(logs) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'labLogsUpdate', data: logs }));
    }
  });
}

// Broadcast messages to all WebSocket clients
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Express route to sign up users (students)
app.post('/signup', (req, res) => {
  const { studentID, full_name, email, department } = req.body;

  if (!studentID || !full_name || !email || !department) {
      return res.status(400).send('Missing required fields');
  }

  // Check if email already exists
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
          console.error('Error checking email:', err);
          return res.status(500).send('Error checking email');
      }

      if (results.length > 0) {
          return res.status(400).send('Email already exists');
      }

      // Insert new user into the database
      const query = 'INSERT INTO users (studentID, full_name, email, department) VALUES (?, ?, ?, ?)';
      db.query(query, [studentID, full_name, email, department], (err) => {
          if (err) {
              console.error('Error signing up user:', err);
              return res.status(500).send('Error signing up');
          }
          console.log('User signed up successfully');
          res.send('Signup successful');
      });
  });
});

// Purge lab logs
app.delete('/purge-lab-logs', (req, res) => {
  const query = 'TRUNCATE TABLE lab_logs';

  db.query(query, (err) => {
    if (err) {
      console.error('Error purging lab logs:', err);
      res.status(500).json({ message: 'Failed to purge lab logs data.' });
    } else {
      console.log('Lab logs purged successfully.');
      res.status(200).json({ message: 'Lab logs purged successfully.' });
    }
  });
});

// Purge all data (clients, lab_logs, admin_logs)
app.post('/purge', (req, res) => {
  const query = `
    TRUNCATE TABLE clients; 
    TRUNCATE TABLE lab_logs; 
    TRUNCATE TABLE admin_logs;
  `;
  db.query(query, (err) => {
    if (err) {
      console.error('Error purging data:', err);
      res.status(500).json({ message: 'Failed to purge data.' });
    } else {
      console.log('All data purged successfully.');
      res.status(200).json({ message: 'All data purged successfully.' });
    }
  });
});

// Graceful shutdown
function handleShutdown() {
  console.log('Server is shutting down...');
  db.end((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
    } else {
      console.log('Database connection closed.'); 
    }
    process.exit(0);
  });
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Start the Express server
app.listen(port, () => {
  console.log(`Admin API running on http://localhost:${port}`);
});

console.log(`WebSocket server running on ws://${wsHost}:${wsPort}`);
