const { app, BrowserWindow, ipcMain } = require('electron');
const WebSocket = require('ws');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile('admin/index.html');
}

// WebSocket setup
const socket = new WebSocket('ws://192.168.1.69:8080');

socket.onopen = () => {
    console.log('Admin connected to signaling server');
};

socket.onmessage = (event) => {
    const receivedData = JSON.parse(event.data);
    console.log('Message received in admin:', receivedData);

    // Forward the data to the renderer process
    mainWindow.webContents.send('client-data', receivedData);
};

socket.onerror = (error) => {
    console.error('WebSocket error in admin:', error);
};

socket.onclose = () => {
    console.log('Disconnected from signaling server');
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
