const WebSocket = require('ws');
<<<<<<< HEAD

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('A new client has connected!');

    // Send the client info (example) to all connected clients
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'client-info') {
            console.log(`Received: ${JSON.stringify(data)}`);
            // Broadcast the username to all connected clients
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'update-client-info',
                        username: data.username
                    }));
                }
            });
        }
    });
});

console.log('Signaling server running on ws://localhost:8080');
=======
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
>>>>>>> parent of 8800231 (client/admin added)
