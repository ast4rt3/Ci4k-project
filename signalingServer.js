const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('A new client has connected!');

    // Listen for messages from the client
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        console.log('Received:', parsedMessage);

        // If the message contains the username, broadcast it to all connected clients (admin, etc.)
        if (parsedMessage.type === 'client-info') {
            // Broadcast the username to all clients (or just the admin)
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'client-info',
                        username: parsedMessage.username
                    }));
                }
            });
        }
    });

    // Send a welcome message to the new client
    ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to the server!' }));
});
