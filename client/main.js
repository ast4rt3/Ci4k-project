const { app, BrowserWindow, Tray, Menu, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let tray = null;
let mainWindow = null;

app.on('ready', () => {
  const trayIconPath = path.join(__dirname, 'Eggplant_PNG_Clipart.ico');

  console.log('Resolved Tray Icon Path:', trayIconPath);

  // Verify the tray icon exists
  if (!fs.existsSync(trayIconPath)) {
    console.error('Error: Tray icon file does not exist.');
    return;
  }

  // Get the screen dimensions
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize; // Get the usable area excluding the taskbar

  // Set the window size
  const windowWidth = 250;
  const windowHeight = 150;

  // Calculate the bottom-right corner position
  const xPos = width - windowWidth; // Align to the right
  const yPos = height - windowHeight; // Align to the bottom

  // Create the hidden main Electron window at the bottom-right corner
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: xPos, // Bottom-right X position
    y: yPos, // Bottom-right Y position
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
    resizable: false, // Disable resizing
    alwaysOnTop: true, // Optional: Keep window always on top
    frame: false, // Remove the window frame
    show: false, // Start as hidden
  });

  // Load the HTML file
  mainWindow.loadFile(path.join(__dirname, 'client.html'));

  // Debug loading errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`Failed to load URL: ${validatedURL}`);
    console.error(`Error Code: ${errorCode}, Description: ${errorDescription}`);
  });

  // Handle the close event (hide instead of quitting)
  mainWindow.on('close', (event) => {
    event.preventDefault(); // Prevent default close behavior
    mainWindow.hide(); // Hide the window instead of closing
  });

  // Create the tray icon
  try {
    tray = new Tray(trayIconPath);
    console.log('Tray icon loaded successfully.');
  } catch (error) {
    console.error('Failed to load tray icon:', error);
    return;
  }

  // Create the tray menu
  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Show Window',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      },
    },
    {
      label: 'Hide Window',
      click: () => {
        if (mainWindow) {
          mainWindow.hide();
        }
      },
    },
    {
      label: 'Exit',
      click: () => {
        console.log('Exiting the application...');
        app.quit();  // Quit Electron
        process.exit(0);  // Force Node.js to exit the process immediately
      },
    },
  ]);

  tray.setToolTip('Client Dashboard');
  tray.setContextMenu(trayMenu);
});

app.on('window-all-closed', () => {
  // Do not quit the app when all windows are closed
  // Do nothing here so it keeps running until the user explicitly quits
});
