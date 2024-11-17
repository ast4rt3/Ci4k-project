const statusDiv = document.getElementById('status');
const messageLogDiv = document.getElementById('messageLog');
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
        const data = JSON.parse(event.data);
        if (data.type === 'client-action') {
            const messageElement = document.createElement('p');
            messageElement.textContent = `Received: ${data.message}`;
            messageLogDiv.appendChild(messageElement);
        }
    });
}

connectToServer();

// Send message to the server (Admin)
notifyAdminBtn.addEventListener('click', () => {
    const message = { type: 'client-action', message: 'Client is requesting action' };
    socket.send(JSON.stringify(message));
});
