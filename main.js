const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

let clientWindow;
let mainWindow;

// Create a function to create the admin window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,  // Admin window size
    height: 600,  // Admin window size
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'renderer.js')  // Path to renderer.js inside the 'client' folder
    }
  });

  mainWindow.loadFile('admin/index.html');  // Replace with actual admin HTML path
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Function to create the client window (small window)
function createClientWindow() {
  // Get the screen size to place the window at the bottom-right
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  clientWindow = new BrowserWindow({
    width: 250,  // Small window size for client
    height: 150,  // Small window size for client
    x: width - 250,  // Position it at the right
    y: height - 150,  // Position it at the bottom
    frame: false,  // Remove the frame
    resizable: false,  // Prevent resizing
    transparent: true,  // Optional transparency
    alwaysOnTop: true,  // Keep it on top
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'client/renderer.js')  // Path to client-side JS
    }
  });

  clientWindow.loadFile('client/client.html');  // Path to your client-side HTML
  clientWindow.on('closed', () => {
    clientWindow = null;
  });
}

// Check if the app is ready to create windows
app.whenReady().then(() => {
  // Start by creating the main window (admin window)
  createMainWindow();

  // You can create the client window after successful login (from WebSocket or other logic)
  // For now, we'll manually trigger the client window creation for testing:
  createClientWindow();
});

// Close all windows when app is closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
