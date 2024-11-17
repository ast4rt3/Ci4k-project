const WebSocket = require('ws');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

let connectedClients = [];

wss.on('connection', (ws) => {
    // When a new client connects, we push their connection into the array
    console.log('A client connected.');

    // Adding client to the list
    const clientId = Math.random().toString(36).substr(2, 9); // Create a unique client ID
    connectedClients.push({ clientId, ws });

    // Notify admin about the new client connection
    broadcastToAdmin({ type: 'client-connected', clientId });

    // Handle messages from clients
    ws.on('message', (message) => {
        console.log('Message received:', message);
        // Broadcast to other clients (including admin)
        broadcastToAllClients(message);
    });

    // When the client disconnects
    ws.on('close', () => {
        console.log('A client disconnected.');
        // Remove the client from the list
        connectedClients = connectedClients.filter(client => client.ws !== ws);

        // Notify admin about the client disconnection
        broadcastToAdmin({ type: 'client-disconnected', clientId });
    });

    // When the client sends an error
    ws.on('error', (error) => {
        console.error('Client WebSocket error:', error);
    });
});

// Function to broadcast to all clients (including admin)
function broadcastToAllClients(message) {
    connectedClients.forEach((client) => {
        if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(message);
        }
    });
}

// Function to broadcast a message to the admin
function broadcastToAdmin(message) {
    // Assuming the admin WebSocket connection is first client
    const adminClient = connectedClients[0];  // If the first client is always the admin
    if (adminClient && adminClient.ws.readyState === WebSocket.OPEN) {
        adminClient.ws.send(JSON.stringify(message));
    }
}

console.log("Signaling server started on ws://localhost:8080");
