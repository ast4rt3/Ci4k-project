const WebSocket = require('ws');
const wss = new WebSocket.Server({ host: '192.168.1.21', port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Listen for messages from the client
  ws.on('message', (message) => {
    console.log('Received: %s', message);
    
    const data = JSON.parse(message);

    if (data.type === 'login') {
      // Example logic for validating the client login
      const isValidClient = (data.clientId === 'validClientId'); // Replace with actual validation logic

      // Send login response back to the client
      ws.send(JSON.stringify({
        type: 'loginResponse',
        success: isValidClient,
      }));
    }

    if (data.type === 'logout') {
      // Handle client logout logic here
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

  // Log when a client disconnects
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://192.168.1.21:8080');
