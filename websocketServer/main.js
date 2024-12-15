const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let clients = {}; // Store connected clients

wss.on('connection', (ws) => {
  console.log('A client connected'); // Log when a client connects

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data); // Debug log

    if (data.type === 'login') {
      const { username, password } = data;
      const validCredentials = (username === 'validClientId' && password === 'validPassword');

      // Send login response back to the client
      ws.send(JSON.stringify({
        type: 'loginResponse',
        success: validCredentials,
      }));
    }

    if (data.type === 'clientConnected') {
      const { clientId } = data;
      console.log(`${clientId} connected`);

      // Store the connected client and broadcast to admin
      clients[clientId] = { id: clientId, status: 'active' };

      // Notify admin about the new connected client
      broadcastToAdmin({ type: 'updateClients', clients: Object.values(clients) });
    }

    if (data.type === 'logout') {
      ws.send(JSON.stringify({ type: 'logout' }));
    }
  });

  // Log when the client disconnects
  ws.on('close', () => {
    console.log('A client disconnected');
  });
});

// Helper function to broadcast messages to the admin side
function broadcastToAdmin(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
