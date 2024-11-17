const WebSocket = require('ws');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('A new client has connected!');

    // Send the client info (example) to all connected clients
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'client-info') {
            console.log(`Received: ${JSON.stringify(data)}`);
            // Broadcast the username to all connected clients
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'update-client-info',
                        username: data.username
                    }));
                }
            });
        }
    });
});

console.log('Signaling server running on ws://localhost:8080');
