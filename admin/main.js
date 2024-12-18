const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // Disables the default window frame
    webPreferences: {
      preload: path.join(__dirname, 'admin.js'), // Corrected path for preload
      nodeIntegration: true, // Enable Node.js integration in renderer process
      contextIsolation: false, // Allow renderer to access IPC
    }
  });

  // Load the admin.html file
  win.loadFile(path.join(__dirname, 'admin.html'));

  // Minimize window
  ipcMain.on('minimize-window', () => {
    if (win) {
      win.minimize();
    }
  });

  // Close window
  ipcMain.on('close-window', () => {
    if (win) {
      win.close(); // This will close the window
    }
  });

  // When the window is closed
  win.on('closed', () => {
    win = null;
  });
}

// Wait for the app to be ready and create the window
app.whenReady().then(createWindow);

// Quit the app when all windows are closed (except for macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle macOS-specific behavior (recreate window when app is clicked in dock)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
