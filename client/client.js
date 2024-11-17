const WebSocket = require('ws');

// Create a WebSocket connection to the signaling server
const socket = new WebSocket('ws://<SIGNALING_SERVER_IP>:8080');

// When the connection is established
socket.onopen = function() {
    console.log('Connected to signaling server');
    // Send a message to the server when connected (you can replace this with actual client data)
    socket.send(JSON.stringify({
        type: 'client-hello',
        message: 'Client has connected!',
        timestamp: new Date().toISOString(),
    }));
};

// When the client receives a message from the signaling server
socket.onmessage = function(event) {
    const receivedData = JSON.parse(event.data);
    console.log('Received data from server:', receivedData);

    // Handle different types of messages (if necessary)
    if (receivedData.type === 'server-message') {
        // Update client interface with received message (could be displayed in UI)
        console.log('Server says:', receivedData.message);
    }
};

// Handle any errors with the WebSocket connection
socket.onerror = function(error) {
    console.log('WebSocket error:', error);
};

// When the client disconnects
socket.onclose = function() {
    console.log('Disconnected from signaling server');
};
