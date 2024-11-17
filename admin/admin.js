const { app, BrowserWindow, ipcMain } = require('electron');
const WebSocket = require('ws');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile('admin/index.html');
}

// WebSocket setup
const socket = new WebSocket('ws://192.168.1.69:8080');

socket.onopen = () => {
    console.log('Connected to signaling server');
};

socket.onmessage = (event) => {
    console.log('Received message:', event.data);
    const receivedData = JSON.parse(event.data);
    mainWindow.webContents.send('client-data', receivedData);
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

socket.onclose = () => {
    console.log('Disconnected from signaling server');
};

// Listen for IPC messages from renderer
ipcMain.on('admin-action', (event, action) => {
    console.log('Admin action:', action);
    // Additional admin actions can be handled here
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
