const WebSocket = require('ws');
const wss = new WebSocket.Server({ host: '192.168.1.21', port: 8080 }); // Server IP

// Store connections and times
let connectedUsers = {};

wss.on('connection', (ws) => {
  console.log('New client connected');
  const userId = `user-${Date.now()}`;  // Create a unique user ID (for example purposes)

  // Notify the admin about the new connection
  const newUserMessage = {
    type: 'newUser',
    userId,
    timestamp: Date.now(),
  };
  broadcast(JSON.stringify(newUserMessage));  // Broadcast the new connection message to all clients (admin side)

  // Record connection start time
  connectedUsers[userId] = { ws, startTime: Date.now() };

  ws.on('message', (message) => {
    console.log('Received:', message);
    const data = JSON.parse(message);
    
    // Handle login
    if (data.type === 'login') {
      ws.send(JSON.stringify({
        type: 'loginResponse',
        success: true,
        userId: userId,
      }));
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log(`User ${userId} disconnected`);
    const connectionDuration = (Date.now() - connectedUsers[userId].startTime) / 1000;  // Time in seconds

    // Notify the admin about disconnection
    const disconnectionMessage = {
      type: 'userDisconnected',
      userId,
      duration: connectionDuration,
    };
    broadcast(JSON.stringify(disconnectionMessage));  // Broadcast the disconnection message to all clients (admin side)

    // Clean up the user data
    delete connectedUsers[userId];
  });
});

// Broadcast messages to all clients (for admin)
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

console.log('WebSocket server running on ws://192.168.1.21:8080');


