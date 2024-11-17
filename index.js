const { app, BrowserWindow, dialog } = require('electron');
const WebSocket = require('ws');
const path = require('path');

// Create the WebSocket server
const wss = new WebSocket.Server({ port: 8080 });
console.log('Signaling server running on ws://localhost:8080');

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('A new client has connected!');
    ws.on('message', (message) => {
        console.log('Received: %s', message);
        const data = JSON.parse(message);
        if (data.type === 'client-info') {
            console.log('Client info:', data.username);
            // Send back a message to all connected clients (if needed)
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'client-info', username: data.username }));
                }
            });
        }
    });
});

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

    mainWindow.loadFile('admin/index.html');
}

// Run the app and WebSocket server simultaneously
app.whenReady().then(() => {
    // Start the WebSocket server
    console.log('Starting WebSocket server...');

    // Create the Electron window
    createWindow();
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
