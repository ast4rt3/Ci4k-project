const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('A client connected.');

    ws.on('message', (message) => {
        console.log('Received:', message);
        const parsedMessage = JSON.parse(message);

        // Broadcast messages to admin or other clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});
