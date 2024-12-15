const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('A client connected'); // Log when a client connects

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    if (data.type === 'login') {
      const isValidClient = (data.clientId === 'validClientId'); // Example logic for validating the client login

      // Send login response back to the client
      ws.send(JSON.stringify({
        type: 'loginResponse',
        success: isValidClient,
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
