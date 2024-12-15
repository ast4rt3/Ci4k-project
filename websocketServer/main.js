const WebSocket = require('ws');
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8080 });  // Listen on all network interfaces

wss.on('connection', (ws) => {
  console.log('A client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    if (data.type === 'login') {
      // Example logic for validating the client login
      const isValidClient = (data.clientId === 'validClientId'); // Replace with actual logic

      // Send login response back to the client
      ws.send(JSON.stringify({
        type: 'loginResponse',
        success: isValidClient,
      }));
    }

    if (data.type === 'logout') {
      // Handle client logout logic here (e.g., session management)
      ws.send(JSON.stringify({ type: 'logout' }));
    }

    if (data.type === 'updateClients') {
      // Example update clients message
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
});
