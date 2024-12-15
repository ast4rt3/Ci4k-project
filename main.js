const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let adminWindow, clientWindow;

// Hardcoded user credentials
const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'client', password: 'client123', role: 'client' },
];

app.whenReady().then(() => {
  // Admin window
  adminWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  adminWindow.loadFile('admin.html');

  // Client window
  clientWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  clientWindow.loadFile('client.html');

  // Close the app when all windows are closed
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
});

// Handle login requests
ipcMain.on('login', (event, credentials) => {
  const user = users.find(
    (u) =>
      u.username === credentials.username &&
      u.password === credentials.password
  );

  if (user) {
    event.reply('loginResponse', { success: true, role: user.role });
  } else {
    event.reply('loginResponse', { success: false });
  }
});

// Force logout from the admin window
ipcMain.on('forceLogout', (event, clientId) => {
  console.log(`Client ${clientId} has been logged out by admin.`);
  clientWindow.webContents.send('logout', { clientId });
});
