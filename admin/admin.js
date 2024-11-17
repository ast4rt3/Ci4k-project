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

        // Forward the message to the renderer process
        if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('client-data', data);
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

notifyAdminBtn.addEventListener('click', () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const message = {
            type: 'client-action',
            username: 'ClientUsername',
            message: 'Hello to Admin!',
        };
        socket.send(JSON.stringify(message));
    } else {
        console.error('Cannot notify admin, WebSocket not open');
    }
});
