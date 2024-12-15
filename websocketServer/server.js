const WebSocket = require('ws');
const wss = new WebSocket.Server({ host: '192.168.1.21', port: 8080 });  // Server IP and port

let connectedClients = {};  // Store connected clients and their connection times

wss.on('connection', (ws) => {
  let clientId = null;
  let connectionStartTime = null;

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    if (data.type === 'clientConnect') {
      clientId = data.clientId;
      connectionStartTime = Date.now();

      // Notify admin about the new connection
      broadcast({
        type: 'newUser',
        clientId: clientId,
        timestamp: connectionStartTime,
      });
      
      // Store the connection start time and client ID
      connectedClients[clientId] = connectionStartTime;
    }
  });

  ws.on('close', () => {
    if (clientId) {
      const connectionDuration = (Date.now() - connectedClients[clientId]) / 1000;  // in seconds
      console.log(`Client ${clientId} disconnected. Duration: ${connectionDuration} seconds`);

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
