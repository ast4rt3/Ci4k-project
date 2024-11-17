let socket;
const statusDiv = document.getElementById('status');
const messageLogDiv = document.getElementById('messageLog');
const reconnectBtn = document.getElementById('reconnectBtn');

// Function to establish a WebSocket connection
function connectToServer() {
    console.log('Attempting to connect to WebSocket server...');
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
        console.log('Received message:', message);
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

// Reconnect to the WebSocket server
function reconnect() {
    console.log('Reconnect button clicked');
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('Already connected, no need to reconnect');
        return;
    }

    if (socket) {
        socket.close();
    }
    connectToServer();
}

// Notify the admin when a button is clicked
function notifyAdmin() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const clickMessage = {
            type: 'client-action',
            action: 'button-click',
            message: 'Hello from Client!',
        };
        socket.send(JSON.stringify(clickMessage));
    }
}

reconnectBtn.addEventListener('click', reconnect);
connectToServer();
