const WebSocket = require('ws');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');  // Import UUID
const wss = new WebSocket.Server({ host: '192.168.1.21', port: 8080 });

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',  // localhost if you're running MySQL locally
  user: 'root',  // MySQL username (default is 'root')
  password: '',  // MySQL password (if no password, leave empty; otherwise, enter your MySQL password)
  database: 'ci4k-project'  // The name of your database
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the MySQL database:', err);
  } else {
    console.log('Connected to MySQL database `ci4k-project`');
  }
});

// WebSocket server logic
wss.on('connection', (ws) => {
  let clientId = uuidv4();  // Generate a new unique ID for the client
  let connectionStartTime = Date.now();

  // Send the generated clientId to the client
  ws.send(JSON.stringify({ type: 'clientConnect', clientId }));

  // Insert client connection data into the existing `clients` table
  insertClientData(clientId, connectionStartTime);

  // Notify admin about the new connection
  broadcast({
    type: 'newUser',
    clientId: clientId,
    connectTime: connectionStartTime,
  });

  // Handle WebSocket messages
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    if (data.type === 'logout') {
      const clientIdToLogout = data.clientId;

      // Handle client logout
      logoutClient(clientIdToLogout);
    }
  });

  ws.on('close', () => {
    // Update the last disconnect time in the `clients` table
    updateDisconnectTime(clientId);

    // Notify admin about the disconnection
    broadcast({
      type: 'userDisconnected',
      clientId: clientId,
    });
  });
});

// Function to insert client connection data into the `clients` table
function insertClientData(clientId, connectionStartTime) {
  const insertDataQuery = `
    INSERT INTO clients (client_id, status, connect_time)
    VALUES (?, 'Connected', ?)
  `;

  db.query(insertDataQuery, [clientId, connectionStartTime], (err, result) => {
    if (err) {
      console.error('Error inserting client data into the clients table:', err);
    } else {
      console.log(`Client data inserted for client: ${clientId}`);
    }
  });
}

// Function to update the disconnect time for the client in the `clients` table
function updateDisconnectTime(clientId) {
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
      console.log(`Disconnect time updated for client: ${clientId}`);
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

console.log('WebSocket server running on ws://192.168.1.21:8080');

// Admin API to delete all tables (if needed)
const express = require('express');
const app = express();
const port = 3000;

// Endpoint to delete all tables in the database
app.get('/deleteAllTables', (req, res) => {
  deleteAllTables(); // Call the function to delete all tables
  res.send('All tables have been deleted');
});

app.listen(port, () => {
  console.log(`Admin API running on http://localhost:${port}`);
});
