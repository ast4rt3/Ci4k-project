const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('A client connected'); // Log when a client connects

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data); // Debug log

    if (data.type === 'login') {
      const { username, password } = data;
      
      // Example logic for validating the client login (replace with actual logic)
      const validCredentials = (username === 'validClientId' && password === 'validPassword'); // Change this to actual validation

      // Send login response back to the client
      ws.send(JSON.stringify({
        type: 'loginResponse',
        success: validCredentials,
      }));
    }

    if (data.type === 'logout') {
      ws.send(JSON.stringify({ type: 'logout' }));
    }

    if (data.type === 'updateClients') {
      const clients = [
        { id: 'client1', status: 'active' },
        { id: 'client2', status: 'inactive' },
      ];
      ws.send(JSON.stringify({
        type: 'updateClients',
        clients,
      }));
    }
  });

  // Log when the client disconnects
  ws.on('close', () => {
    console.log('A client disconnected');
  });
});
