const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('A client connected.');

    ws.on('message', (message) => {
        console.log('Message received on server:', message);
        const parsedMessage = JSON.parse(message);

        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(parsedMessage));
            }
        });
    });

    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});
