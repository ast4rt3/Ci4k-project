let socket;
const statusDiv = document.getElementById('status');
const messageLogDiv = document.getElementById('messageLog');
const reconnectBtn = document.getElementById('reconnectBtn');
const notifyAdminBtn = document.getElementById('notifyAdminBtn');

// Function to establish a WebSocket connection
function connectToServer() {
    statusDiv.innerText = 'Connecting to signaling server...';

    socket = new WebSocket('ws://192.168.1.69:8080');

    socket.addEventListener('open', () => {
        console.log('WebSocket connection established');
        statusDiv.innerText = 'Connected to signaling server';

        // Send initial client info
        const clientInfo = {
            type: 'client-info',
            username: 'ClientUsername',
        };
        socket.send(JSON.stringify(clientInfo));
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        messageLogDiv.innerHTML += `<p>Received: ${JSON.stringify(message)}</p>`;
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

// Notify the admin when the button is clicked
function notifyAdmin() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const clickMessage = {
            type: 'client-action',
            action: 'button-click',
            message: 'Hello to Admin!',
        };
        socket.send(JSON.stringify(clickMessage));
    } else {
        console.error('Cannot send message, socket is not open');
    }
}

// Event listeners
reconnectBtn.addEventListener('click', connectToServer);
notifyAdminBtn.addEventListener('click', notifyAdmin);

// Initial connection
connectToServer();
