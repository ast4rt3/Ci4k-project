let socket;
const statusDiv = document.getElementById('status');
const messageLogDiv = document.getElementById('messageLog');
const reconnectBtn = document.getElementById('reconnectBtn');

// Function to establish a WebSocket connection
function connectToServer() {
    // Update status message
    statusDiv.innerText = 'Connecting to signaling server...';

    socket = new WebSocket('ws://localhost:8080'); // Assuming the signaling server is running on localhost:8080

    socket.addEventListener('open', () => {
        console.log('WebSocket connection established');
        statusDiv.innerText = 'Connected to signaling server';
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        // Display the received message in the message log
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

// Function to reconnect to the WebSocket server
function reconnect() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('Already connected, no need to reconnect');
        statusDiv.innerText = 'Already connected to server';
        return;
    }

    // Close the existing socket if it's open
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }

    // Reconnect to the server
    connectToServer();
}

// Event listener for reconnect button
reconnectBtn.addEventListener('click', reconnect);

// Initial connection
connectToServer();
