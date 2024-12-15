const WebSocket = require('ws');
const wss = new WebSocket.Server({ host: '192.168.1.21', port: 8080 }); // Listening on LAN IP

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    console.log('Received:', message);
    const data = JSON.parse(message);

    if (data.type === 'login') {
      // Simple login check
      const isValidClient = (data.clientId === 'validClientId'); // Replace with actual validation logic
      ws.send(JSON.stringify({
        type: 'loginResponse',
        success: isValidClient,
      }));
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://192.168.1.21:8080');
