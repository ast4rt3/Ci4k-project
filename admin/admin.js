const { app, BrowserWindow, dialog, ipcMain } = require('electron');
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
            preload: path.join(__dirname, 'preload.js'), // Use preload for secure communication
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

// Handle client click event (from client UI)
ipcMain.on('client-clicked', (event, message) => {
    console.log('Client clicked:', message);
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Client Action',
        message: `Client said: ${message}`,
    });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
