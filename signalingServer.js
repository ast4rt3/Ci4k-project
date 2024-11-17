const WebSocket = require('ws');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('A client connected.');

    // Handle incoming messages from any client
    ws.on('message', (message) => {
        console.log('Message received on server:', message);
        const parsedMessage = JSON.parse(message);

        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(parsedMessage));
            }
        });
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});
