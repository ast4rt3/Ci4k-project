// websocketServer/server.js
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./clients.db');  // Create or open a database file
const wss = new WebSocket.Server({ host: '192.168.1.21', port: 8080 });

let connectedClients = {};  // Store connected clients temporarily

// Create the table if it doesn't exist already
db.run(`
  CREATE TABLE IF NOT EXISTS clients (
    clientId TEXT PRIMARY KEY,
    connectionTime INTEGER,
    lastDisconnectTime INTEGER
  );
`);

// Function to generate a unique clientId
function generateClientId() {
  return 'client-' + Math.random().toString(36).substring(2, 15);  // Generates a random alphanumeric string
}

wss.on('connection', (ws) => {
  let clientId = null;
  let connectionStartTime = Date.now();

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    if (data.type === 'clientConnect') {
      clientId = data.clientId || generateClientId();  // If no clientId is provided, generate one
      connectionStartTime = Date.now();

      // Check if the client already exists in the database
      db.get('SELECT * FROM clients WHERE clientId = ?', [clientId], (err, row) => {
        if (err) {
          console.error('Error fetching client data from database:', err);
          return;
        }

        if (row) {
          // Client exists, so it's a reconnection
          const previousConnectionTime = row.connectionTime;
          const lastDisconnectTime = row.lastDisconnectTime;

          // Notify the client with their previous data
          ws.send(JSON.stringify({
            type: 'reconnect',
            clientId: clientId,
            previousConnectionTime: previousConnectionTime,
            lastDisconnectTime: lastDisconnectTime,
          }));

          console.log(`Client ${clientId} reconnected. Last disconnect was at ${lastDisconnectTime}`);
        } else {
          // New client, insert them into the database
          db.run(
            `INSERT INTO clients (clientId, connectionTime, lastDisconnectTime)
             VALUES (?, ?, ?)`,
            [clientId, connectionStartTime, null],
            (err) => {
              if (err) {
                console.error('Error inserting new client into database:', err);
              }
            }
          );

          console.log(`New client connected: ${clientId}`);
        }
      });

      // Store the connection time temporarily in memory
      connectedClients[clientId] = { ws, connectionStartTime };

      // Broadcast new user connection to all clients
      broadcast({
        type: 'newUser',
        clientId: clientId,
        timestamp: connectionStartTime,
      });
    }
  });

  ws.on('close', () => {
    if (clientId) {
      const connectionDuration = (Date.now() - connectedClients[clientId].connectionStartTime) / 1000;  // in seconds
      console.log(`Client ${clientId} disconnected. Duration: ${connectionDuration} seconds`);

      // Update the last disconnect time in the database
      db.run(
        `UPDATE clients
         SET lastDisconnectTime = ?
         WHERE clientId = ?`,
        [Date.now(), clientId],
        (err) => {
          if (err) {
            console.error('Error updating client disconnect time:', err);
          }
        }
      );

      // Broadcast user disconnection to all clients
      broadcast({
        type: 'userDisconnected',
        clientId: clientId,
        duration: connectionDuration,
      });

      // Remove the client from the connected clients list
      delete connectedClients[clientId];
    }
  });
});

// Broadcast messages to all clients (including admin)
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

console.log('WebSocket server running on ws://192.168.1.21:8080');

// Add to your server.js file (optional API)
const express = require('express');
const app = express();
const port = 3000;

// API endpoint for viewing all connected clients
app.get('/clients', (req, res) => {
  db.all('SELECT * FROM clients', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);  // Send client data as JSON
  });
});

app.listen(port, () => {
  console.log(`Admin API running on http://localhost:${port}`);
});
