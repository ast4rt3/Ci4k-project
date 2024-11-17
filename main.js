const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let adminWindow;
let clientWindow;

function createWindow() {
  // Create Admin Window
  adminWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    }
  });
  adminWindow.loadFile('admin.html'); // Load admin UI

  // Create Client Window
  clientWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    }
  });
  clientWindow.loadFile('client.html'); // Load client UI
}

// IPC listener for receiving messages from client
ipcMain.on('send-message-to-admin', (event, message) => {
  if (adminWindow) {
    adminWindow.webContents.send('display-client-message', message);
  }
});

app.whenReady().then(createWindow);
