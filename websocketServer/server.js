// Import required modules
const WebSocket = require('ws');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app and WebSocket server
const app = express();
const port = 3000;  // Express server port
const wsPort = 8080;  // WebSocket server port
const wsHost = '0.0.0.0';  // WebSocket host

const wss = new WebSocket.Server({ host: wsHost, port: wsPort });

// Database connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ci4k-project',
  connectionLimit: 10,
});

// Middleware for Express server
app.use(cors());
app.use(bodyParser.json());

// Utility function to query the database
function queryDatabase(query, params = []) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Insert client connection data into the database
async function insertClientData(clientId, connectionStartTime, isAdmin) {
  const status = isAdmin ? 'Admin Connected' : 'Client Connected';
  try {
    await queryDatabase('INSERT INTO clients (client_id, status, connect_time) VALUES (?, ?, ?)', [
      clientId,
      status,
      connectionStartTime,
    ]);
  } catch (err) {
    console.error('Error inserting client data:', err);
  }
}

// Update client disconnect time and duration
async function updateDisconnectTime(clientId) {
  const disconnectTime = Date.now();
  try {
    await queryDatabase(
      `UPDATE clients SET disconnect_time = ?, duration = ? - connect_time WHERE client_id = ? AND disconnect_time IS NULL`,
      [disconnectTime, disconnectTime, clientId]
    );
  } catch (err) {
    console.error('Error updating disconnect time:', err);
  }
}

// WebSocket server logic for handling connections
wss.on('connection', (ws) => {
  console.log("A new WebSocket connection was made");

  const clientId = uuidv4(); // Generate a unique client ID for the WebSocket connection
  const connectionStartTime = Date.now();
  let isAdmin = false;

  insertClientData(clientId, connectionStartTime, isAdmin);

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);

      // Handle different message types (admin connect, client connect, etc.)
      if (data.type === 'adminConnect') {
        await logAdminLogin(clientId);
        ws.send(JSON.stringify({ type: 'adminConnected', clientId }));
      }

      else if (data.type === 'clientConnect') {
        const { studentID, computerNumber = 1 } = data;
        await logStudentLogin(studentID, computerNumber);
        ws.send(JSON.stringify({ type: 'clientConnected', clientId, computerNumber }));
      }

      else if (data.type === 'logout') {
        const { clientId, computerNumber = 1 } = data;
        await logStudentLogout(clientId, computerNumber);
        broadcast({ type: 'clientDisconnected', clientId });
      }

      else if (data.type === 'save-screenshot') {
        const { clientId, screenshotPath } = data;
        await saveScreenshotToDB(clientId, screenshotPath);
        console.log(`Screenshot saved for client ${clientId}`);
      }

      else {
        console.error('Unknown message type:', data.type);
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
      }

    } catch (err) {
      console.error('Error processing WebSocket message:', err);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  // When WebSocket connection closes, log logout time and duration
  ws.on('close', () => {
    console.log('WebSocket connection closed for client:', clientId);
    updateDisconnectTime(clientId);
    broadcast({ type: 'userDisconnected', clientId });
  });

  // Send the generated clientId to the client
  ws.send(JSON.stringify({ type: 'clientConnect', clientId }));
});

// Broadcast utility
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Log admin login
async function logAdminLogin(adminId) {
  try {
    await queryDatabase('INSERT INTO admin_logs (admin_id, login_time) VALUES (?, ?)', [adminId, new Date()]);
  } catch (err) {
    console.error('Error logging admin login:', err);
  }
}

// Log student login
async function logStudentLogin(studentID, computerNumber) {
  const loginTime = new Date();
  try {
    await queryDatabase('INSERT INTO lab_logs (studentID, computer_number, login_time) VALUES (?, ?, ?)', [
      studentID,
      computerNumber,
      loginTime,
    ]);
  } catch (err) {
    console.error('Error logging student login:', err);
  }
}

// Log student logout
async function logStudentLogout(studentID, computerNumber) {
  const logoutTime = new Date();
  try {
    await queryDatabase(
      `UPDATE lab_logs SET logout_time = ?, duration = TIMESTAMPDIFF(SECOND, login_time, ?) WHERE studentID = ? AND computer_number = ? AND logout_time IS NULL`,
      [logoutTime, logoutTime, studentID, computerNumber]
    );
  } catch (err) {
    console.error('Error logging student logout:', err);
  }
}

// Save screenshot to database
async function saveScreenshotToDB(clientId, screenshotPath) {
  try {
    await queryDatabase('INSERT INTO screenshot_logs (client_id, screenshot_path) VALUES (?, ?)', [
      clientId,
      screenshotPath,
    ]);
  } catch (err) {
    console.error('Error saving screenshot:', err);
  }
}

// Periodically fetch and broadcast lab logs every 5 seconds
setInterval(async () => {
  try {
    const logs = await queryDatabase('SELECT * FROM lab_logs ORDER BY login_time DESC');
    broadcast({ type: 'labLogsUpdate', data: logs });
  } catch (err) {
    console.error('Error fetching lab logs:', err);
  }
}, 5000);

// Express routes for signup, purge, and data management
app.post('/signup', (req, res) => {
  const { studentID, full_name, email, department } = req.body;

  if (!studentID || !full_name || !email || !department) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = `INSERT INTO users (studentID, full_name, email, department) VALUES (?, ?, ?, ?)`;
  db.query(query, [studentID, full_name, email, department], (err) => {
    if (err) {
      console.error('Error inserting into database:', err);
      return res.status(500).json({ message: 'Database error.' });
    }
    res.status(200).json({ message: 'User signed up successfully!' });
  });
});

// Purge all data
app.post('/purge', async (req, res) => {
  try {
    await queryDatabase('TRUNCATE TABLE clients');
    await queryDatabase('TRUNCATE TABLE lab_logs');
    await queryDatabase('TRUNCATE TABLE admin_logs');
    res.status(200).send('All data purged successfully');
  } catch (err) {
    console.error('Error purging data:', err);
    res.status(500).send('Failed to purge data');
  }
});

// Purge lab logs
app.delete('/purge-lab-logs', async (req, res) => {
  try {
    await queryDatabase('TRUNCATE TABLE lab_logs');
    res.status(200).json({ message: 'Lab logs purged successfully.' });
  } catch (err) {
    console.error('Error purging lab logs:', err);
    res.status(500).json({ message: 'Failed to purge lab logs.' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});

console.log(`WebSocket server running on ws://${wsHost}:${wsPort}`);
