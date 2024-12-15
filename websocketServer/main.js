// Import the WebSocket library
const WebSocket = require('ws');

// Define the IP address and port for the WebSocket server
const serverAddress = 'ws://192.168.1.69:8080';

// Create a WebSocket server and listen on the specific IP address and port
const wss = new WebSocket.Server({ host: '192.168.1.69', port: 8080 });

// Handle client connections
wss.on('connection', (ws) => {
  console.log('A client connected');

  // Listen for messages from clients
  ws.on('message', (message) => {
    console.log('Received message:', message);

    // Respond back to the client
    ws.send(JSON.stringify({ type: 'pong' }));
  });

  // Handle client disconnecting
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server started on ${serverAddress}`);
