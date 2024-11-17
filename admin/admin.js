const { app, BrowserWindow, dialog } = require('electron');
const WebSocket = require('ws');

// Create the Electron window
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    mainWindow.loadFile('index.html');
}

// WebSocket setup
const socket = new WebSocket('ws://192.168.1.69:8080');

// When WebSocket connection is opened
socket.onopen = function() {
    console.log('Connected to signaling server');
};

// When the server sends a message
socket.onmessage = function(event) {
    console.log('Received message:', event.data);
    const receivedData = JSON.parse(event.data);  // If data is JSON
    mainWindow.webContents.send('client-data', receivedData);  // Send data to renderer process
};

// When a new client connects
socket.on('connection', function() {
    console.log('A new client has connected!');
    // Show popup notification in the Electron UI when a client connects
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'New Client Connected',
        message: 'A new client has successfully connected to the server.',
    });
});

// Handle errors
socket.onerror = function(error) {
    console.log('WebSocket Error:', error);
};

// Handle WebSocket closure
socket.onclose = function() {
    console.log('Disconnected from signaling server');
};

// Run the app
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
