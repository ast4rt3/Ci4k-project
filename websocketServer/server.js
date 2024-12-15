const WebSocket = require('ws');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');  // Import UUID
const wss = new WebSocket.Server({ host: '192.168.1.21', port: 8080 });
const express = require('express');
const app = express();
const port = 3000;

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

  // Dynamically create a table for the client based on their unique clientId
  createClientTable(clientId, connectionStartTime);

  // Store client data in the dynamic table
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
      logoutClient(clientIdToLogout);
    }
  });

  ws.on('close', () => {
    // Update the last disconnect time in the client's table
    updateDisconnectTime(clientId);

    // Notify admin about the disconnection
    broadcast({
      type: 'userDisconnected',
      clientId: clientId,
    });
  });
});

// Function to create a dynamic table for each client
function createClientTable(clientId, connectionStartTime) {
  const tableName = `client_${clientId.replace(/-/g, '_')}`;  // Replace dashes with underscores for valid table name

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS \`${tableName}\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      connection_time BIGINT NOT NULL,
      disconnect_time BIGINT DEFAULT NULL
    );
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table for client:', err);
    } else {
      console.log(`Table created for client: ${clientId}`);
    }
  });
}

// Function to insert client connection data into the dynamically created table
function insertClientData(clientId, connectionStartTime) {
  const tableName = `client_${clientId.replace(/-/g, '_')}`;

  const insertDataQuery = `
    INSERT INTO \`${tableName}\` (connection_time)
    VALUES (?)`;
  
  db.query(insertDataQuery, [connectionStartTime], (err, result) => {
    if (err) {
      console.error('Error inserting client data into table:', err);
    } else {
      console.log(`Client data inserted into table for client: ${clientId}`);
    }
  });
}

// Function to update the disconnect time in the dynamically created table
function updateDisconnectTime(clientId) {
  const tableName = `client_${clientId.replace(/-/g, '_')}`;
  const disconnectTime = Date.now();

  const updateQuery = `
    UPDATE \`${tableName}\`
    SET disconnect_time = ?
    WHERE connection_time IS NOT NULL
    ORDER BY connection_time DESC LIMIT 1;`;

  db.query(updateQuery, [disconnectTime], (err, result) => {
    if (err) {
      console.error('Error updating disconnect time in table:', err);
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

// Admin API to delete all client tables
app.get('/deleteAllTables', (req, res) => {
  deleteAllClientTables(); // Call the function to delete all client tables
  res.send('All client tables have been deleted');
});

app.listen(port, () => {
  console.log(`Admin API running on http://localhost:${port}`);
});

// Function to delete all tables starting with 'client_'
function deleteAllClientTables() {
  const fetchTablesQuery = 'SHOW TABLES';
  
  db.query(fetchTablesQuery, (err, tables) => {
    if (err) {
      console.error('Error fetching table names:', err);
      return;
    }

    // Filter tables to only include those that start with 'client_'
    const clientTables = tables.filter(table => table[`Tables_in_ci4k-project`].startsWith('client_'));

    // Loop through and drop each client table
    clientTables.forEach(table => {
      const tableName = table[`Tables_in_ci4k-project`];
      const dropTableQuery = `DROP TABLE IF EXISTS \`${tableName}\``;

      db.query(dropTableQuery, (err, result) => {
        if (err) {
          console.error('Error deleting table:', err);
        } else {
          console.log(`Table deleted: ${tableName}`);
        }
      });
    });
  });
}

