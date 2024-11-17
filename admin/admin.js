const { app, BrowserWindow } = require('electron');
const WebSocket = require('ws');
const path = require('path');

let mainWindow;
let socket;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    });

    mainWindow.loadFile('admin/index.html');

    // Initialize WebSocket after the window is ready
    setupWebSocket();
}

function setupWebSocket() {
    socket = new WebSocket('ws://192.168.1.69:8080');

    socket.onopen = () => {
        console.log('Admin connected to signaling server');
    };

    socket.onmessage = (event) => {
        console.log('Message received on admin:', event.data);
        const data = JSON.parse(event.data);

        // Send the data to renderer process (admin UI)
        if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('client-data', data); // Pass data to renderer
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket error on admin:', error);
    };

    socket.onclose = () => {
        console.log('Disconnected from signaling server');
    };
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
