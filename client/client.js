let socket;
const statusDiv = document.getElementById('status');
const messageLogDiv = document.getElementById('messageLog');
const reconnectBtn = document.getElementById('reconnectBtn');

document.getElementById('clickButton').addEventListener('click', () => {
    // Send a message to the main process when the button is clicked
    window.electronAPI.sendMessageToAdmin("Client has clicked the button!");
});


// Function to establish a WebSocket connection
function connectToServer() {
    console.log('Attempting to connect to WebSocket server...');
    // Update status message
    statusDiv.innerText = 'Connecting to signaling server...';

    socket = new WebSocket('ws://192.168.1.69:8080'); // Ensure the server is running on this port

    socket.addEventListener('open', () => {
        console.log('WebSocket connection established');
        statusDiv.innerText = 'Connected to signaling server';
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
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
    console.log('Reconnect button clicked');
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('Already connected, no need to reconnect');
        statusDiv.innerText = 'Already connected to server';
        return;
    }

    // Close the existing socket if it's open
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('Closing existing WebSocket connection...');
        socket.close();
    }

    // Reconnect to the server
    connectToServer();
}

// Event listener for reconnect button
reconnectBtn.addEventListener('click', reconnect);

// Initial connection
connectToServer();