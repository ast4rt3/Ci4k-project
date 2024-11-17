const statusDiv = document.getElementById('status');
const notifyAdminBtn = document.getElementById('notifyAdminBtn');
let socket;

function connectToServer() {
    statusDiv.innerText = 'Connecting to signaling server...';

    socket = new WebSocket('ws://192.168.1.69:8080');

    socket.addEventListener('open', () => {
        console.log('Client connected to signaling server');
        statusDiv.innerText = 'Connected to signaling server';
    });

    socket.addEventListener('message', (event) => {
        console.log('Message received on client (broadcast):', event.data);
    });

    socket.addEventListener('close', () => {
        console.log('WebSocket connection closed');
        statusDiv.innerText = 'Disconnected from signaling server';
    });

    socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        statusDiv.innerText = 'Error connecting to signaling server';
    });
}

notifyAdminBtn.addEventListener('click', () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const message = {
            type: 'client-action',
            username: 'ClientUsername',
            message: 'Hello to Admin!',
        };
        socket.send(JSON.stringify(message)); // Send to signaling server
    } else {
        console.error('Cannot notify admin, WebSocket not open');
    }
});

// Connect on load
connectToServer();
