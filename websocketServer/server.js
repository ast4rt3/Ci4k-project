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

wss.on('connection', (ws) => {
  let clientId = null;
  let connectionStartTime = Date.now();

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    if (data.type === 'clientConnect') {
      clientId = data.clientId;
      connectionStartTime = Date.now();

      // Store client data in the database
      db.run(
        `INSERT OR REPLACE INTO clients (clientId, connectionTime, lastDisconnectTime)
         VALUES (?, ?, ?)`,
        [clientId, connectionStartTime, null],
        (err) => {
          if (err) {
            console.error('Error inserting client data into database:', err);
          }
        }
      );

      // Notify admin about the new connection
      broadcast({
        type: 'newUser',
        clientId: clientId,
        timestamp: connectionStartTime,
      });

      // Store the connection time temporarily in memory
      connectedClients[clientId] = connectionStartTime;
    }
  });

  ws.on('close', () => {
    if (clientId) {
      const connectionDuration = (Date.now() - connectedClients[clientId]) / 1000;  // in seconds
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

      // Notify admin about the disconnection
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

ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);
  
    if (data.type === 'logout') {
      const clientIdToLogout = data.clientId;
  
      // Find the client WebSocket
      const client = connectedClients[clientIdToLogout];
      if (client) {
        const { ws: clientWs, connectionStartTime } = client;
        const connectionDuration = (Date.now() - connectionStartTime) / 1000; // in seconds
  
        // Close the WebSocket connection
        clientWs.close();
        console.log(`Client ${clientIdToLogout} forcefully disconnected`);
  
        // Update the database with disconnection time
        db.run(
          `UPDATE clients
           SET lastDisconnectTime = ?
           WHERE clientId = ?`,
          [Date.now(), clientIdToLogout],
          (err) => {
            if (err) {
              console.error('Error updating client disconnect time:', err);
            }
          }
        );
  
        // Notify all admin dashboards about the disconnection
        broadcast({
          type: 'userDisconnected',
          clientId: clientIdToLogout,
          duration: connectionDuration,
        });
  
        // Remove the client from the connected clients list
        delete connectedClients[clientIdToLogout];
      } else {
        console.log(`No active connection found for client: ${clientIdToLogout}`);
      }
    }
  });
  