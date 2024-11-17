const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function(socket) {
    console.log('A new client has connected!');

    // Send a message to all connected clients (broadcast)
    wss.clients.forEach(function(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send('A new client has connected!');
        }
    });

    socket.on('message', function(message) {
        console.log('Received message:', message);
        // Optionally forward the message to all clients or the admin
    });

    socket.on('close', function() {
        console.log('A client has disconnected');
    });
});

console.log('Signaling server is running on ws://localhost:8080');
