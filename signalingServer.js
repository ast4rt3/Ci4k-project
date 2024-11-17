const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

wss.on('connection', (ws) => {
  // Add the new client connection
  clients.push(ws);

  // When a message is received, forward it to the other client
  ws.on('message', (message) => {
    clients.forEach((client) => {
      if (client !== ws) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    // Remove disconnected client
    clients = clients.filter((client) => client !== ws);
  });
});

console.log('Signaling server is running on ws://localhost:8080');
