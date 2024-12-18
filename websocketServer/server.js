const WebSocket = require('ws');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');  // Import UUID
const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();
const port = 3000;

const wss = new WebSocket.Server({ host: '192.168.1.21', port: 8080 });

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',  // localhost if you're running MySQL locally
  user: 'root',  // MySQL username (default is 'root')
  password: '',  // MySQL password (if no password, leave empty; otherwise, enter your MySQL password)
  database: 'ci4k-project',  // The name of your database
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the MySQL database:', err);
  } else {
    console.log('Connected to MySQL database `ci4k-project`');
  }
});

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// WebSocket server logic
wss.on('connection', (ws) => {
  console.log("A new connection was made");

  let clientId = uuidv4();  // Generate a new unique ID for the client
  let connectionStartTime = Date.now();
  let isAdmin = false;

  // Log the initial connection (this confirms the connection is being made)
  console.log('New WebSocket connection established with client:', clientId);

  // Insert client data into the database
  insertClientData(clientId, connectionStartTime, isAdmin);

  // Handle incoming messages
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received message:', data);

    if (data.type === 'adminConnect') {
      isAdmin = true;
      console.log('Admin connected');
      // Log admin login in the database
      logAdminLogin(clientId);
      ws.send(JSON.stringify({ type: 'adminConnected', clientId }));
    } else if (data.type === 'clientConnect') {
      console.log('Client connected');
      // Log client connection in the database
      logStudentLogin(clientId, 1);  // Example: student logs into computer 1

      // Notify the admin about the new client connection
      broadcast({
        type: 'clientConnected',
        clientId,
        computerNumber: 1, // Example data
      });
    }

    if (data.type === 'logout') {
      const clientIdToLogout = data.clientId;

      // Handle client logout
      logStudentLogout(clientIdToLogout, 1);  // Example: student logs out from computer 1

      // Notify the admin about the client logout
      broadcast({
        type: 'clientDisconnected',
        clientId: clientIdToLogout,
      });
    }
  });

  // When connection is closed, log it
  ws.on('close', () => {
    console.log('WebSocket connection closed for client:', clientId);
    updateDisconnectTime(clientId, isAdmin);
    broadcast({
      type: 'userDisconnected',
      clientId: clientId,
    });

    if (!isAdmin) {
      logStudentLogout(clientId, 1);  // Example: student logs out from computer 1
    }
  });

  // WebSocket error handling
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });

  // Send the generated clientId to the client
  ws.send(JSON.stringify({ type: 'clientConnect', clientId }));
});

// Function to insert client connection data into the `clients` table
function insertClientData(clientId, connectionStartTime, isAdmin) {
  const status = isAdmin ? 'Admin Connected' : 'Client Connected';
  const insertDataQuery = `
    INSERT INTO clients (client_id, status, connect_time)
    VALUES (?, ?, ?)
  `;

  db.query(insertDataQuery, [clientId, status, connectionStartTime], (err, result) => {
    if (err) {
      console.error('Error inserting client data into the clients table:', err);
    } else {
      console.log(`Client data inserted for client: ${clientId}`);
    }
  });
}

// Function to update the disconnect time for the client in the `clients` table
function updateDisconnectTime(clientId, isAdmin) {
  const disconnectTime = Date.now();
  const updateQuery = `
    UPDATE clients
    SET disconnect_time = ?, duration = ? - connect_time
    WHERE client_id = ? AND disconnect_time IS NULL
  `;

  db.query(updateQuery, [disconnectTime, disconnectTime, clientId], (err, result) => {
    if (err) {
      console.error('Error updating disconnect time in clients table:', err);
    } else {
      console.log(`Disconnect time updated for ${isAdmin ? 'admin' : 'client'}: ${clientId}`);
    }
  });
}

// Broadcast messages to all clients (including admin)
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Function to log admin login in the `admin_logs` table
function logAdminLogin(adminId) {
  const insertQuery = `
    INSERT INTO admin_logs (admin_id, login_time)
    VALUES (?, ?)
  `;

  const loginTime = new Date();

  db.query(insertQuery, [adminId, loginTime], (err, result) => {
    if (err) {
      console.error('Error logging admin login:', err);
    } else {
      console.log(`Admin ${adminId} logged in`);
    }
  });
}

// Function to log student login in the `lab_logs` table
function logStudentLogin(studentID, computerNumber) {
  const insertQuery = `
    INSERT INTO lab_logs (studentID, computer_number, login_time)
    VALUES (?, ?, ?)
  `;

  const loginTime = new Date();

  db.query(insertQuery, [studentID, computerNumber, loginTime], (err, result) => {
    if (err) {
      console.error('Error logging student login:', err);
    } else {
      console.log(`Student ${studentID} logged into computer ${computerNumber}`);
    }
  });
}

// Function to log student logout and update the logout time in the `lab_logs` table
function logStudentLogout(studentID, computerNumber) {
  const updateQuery = `
    UPDATE lab_logs
    SET logout_time = ?, duration = TIMESTAMPDIFF(SECOND, login_time, ?)
    WHERE studentID = ? AND computer_number = ? AND logout_time IS NULL
  `;

  const logoutTime = new Date();

  db.query(updateQuery, [logoutTime, logoutTime, studentID, computerNumber], (err, result) => {
    if (err) {
      console.error('Error logging student logout:', err);
    } else {
      console.log(`Student ${studentID} logged out from computer ${computerNumber}`);
    }
  });
}

// Endpoint to delete all records in the `clients` table
app.get('/deleteAllTables', (req, res) => {
  deleteAllTables(); // Call the function to delete all tables
  res.send('All tables have been deleted');
});

app.listen(port, () => {
  console.log(`Admin API running on http://localhost:${port}`);
});

// Function to delete all records in the `clients` table
function deleteAllTables() {
  const deleteQuery = `TRUNCATE TABLE clients`;

  db.query(deleteQuery, (err, result) => {
    if (err) {
      console.error('Error deleting all tables:', err);
    } else {
      console.log('All tables successfully reset.');
    }
  });
}

// Handle server shutdown to reset the database
function handleShutdown() {
  console.log('Server is shutting down... Resetting the database.');

  deleteAllTables();

  db.end((err) => {
    if (err) {
      console.error('Error closing the database connection:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
}

// Signup route
app.post('/signup', (req, res) => {
  const { studentID, full_name, email, department } = req.body;

  if (!studentID || !full_name || !email || !department) {
    return res.status(400).send('Missing required fields');
  }

  const insertQuery = `
    INSERT INTO users (studentID, full_name, email, department)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertQuery, [studentID, full_name, email, department], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Error signing up');
    } else {
      console.log('User signed up successfully');
      res.send('Signup successful');
    }
  });
});

// Listen for process termination signals
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

console.log('WebSocket server running on ws://192.168.1.21:8080');