const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win; // Variable for the signup window
let clientWindow; // Variable for the client window

function createWindow() {
  // Create the signup window
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Allow Node.js integration for IPC and other features
    },
  });

  // Load the signup.html file correctly (ensure it's in the same directory or adjust path)
  win.loadFile(path.join(__dirname, 'signup.html'));

  // Handle the closed window event to clean up the reference
  win.on('closed', () => {
    win = null;
  });
}

// Handle 'open-client' event to open the client window after successful signup
ipcMain.on('open-client', () => {
  // If a client window already exists, focus on it
  if (clientWindow) {
    clientWindow.focus();
  } else {
    // Create a new client window if it doesn't exist
    clientWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,  // Enable node integration for the new window
      },
    });

    // Correct path to load client.html (ensure the 'client' folder is correctly set)
    clientWindow.loadFile(path.join(__dirname, 'client', 'client.html'));

    // Handle the closed event of the client window
    clientWindow.on('closed', () => {
      clientWindow = null;
    });
  }

  // Optionally close the signup window after opening the client window
  if (win) {
    win.close(); // Close the signup window after signup is successful
  }
});

app.whenReady().then(createWindow);

// Handle quitting the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Recreate the window if the app is activated (macOS specific behavior)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
