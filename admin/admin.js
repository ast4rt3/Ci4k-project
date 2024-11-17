const { app, BrowserWindow, ipcMain } = require('electron');
const WebSocket = require('ws');
const path = require('path');

let mainWindow;
let socket;
let connectedClients = [];

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        }
    });

    mainWindow.loadFile('admin/index.html');

    // Initialize WebSocket after the window is ready
    setupWebSocket();
}

// Setup WebSocket connection
function setupWebSocket() {
    socket = new WebSocket('ws://192.168.1.222:8080');

    socket.onopen = () => {
        console.log('Admin connected to signaling server');
        mainWindow.webContents.send('status-update', 'Connected to signaling server');
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message on admin:', data);

        // Handle client-connected and client-disconnected messages
        if (data.type === 'client-connected') {
            connectedClients.push(data.clientId);
        } else if (data.type === 'client-disconnected') {
            connectedClients = connectedClients.filter(client => client !== data.clientId);
        } else if (data.type === 'client-action') {
            // This is the message we want to display in the UI
            mainWindow.webContents.send('client-action-message', data.message);
        }

        // Send the updated client list to the renderer
        mainWindow.webContents.send('update-client-list', connectedClients);
    };

    socket.onerror = (error) => {
        console.error('WebSocket error on admin:', error);
        mainWindow.webContents.send('status-update', 'Error connecting to signaling server');
    };

    socket.onclose = () => {
        console.log('Admin disconnected from signaling server');
        mainWindow.webContents.send('status-update', 'Disconnected from signaling server');
    };
}

// Reconnect to signaling server
function reconnect() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('Already connected, no need to reconnect');
        return;
    }

    setupWebSocket();  // Reconnect logic
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Listen for the reconnect action from the renderer
ipcMain.on('reconnect', reconnect);
