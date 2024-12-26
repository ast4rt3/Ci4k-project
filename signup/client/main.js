const { app, BrowserWindow, Tray, Menu, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let tray = null;
let mainWindow = null;

// Get the correct icon path based on development or production
function getTrayIconPath() {
    console.log("Checking if app is packaged:", app.isPackaged);

    if (app.isPackaged) {
        const iconPath = path.join(process.resourcesPath, 'resources', 'egg.ico');
        if (fs.existsSync(iconPath)) {
            console.log('Found tray icon at:', iconPath);
            return iconPath;
        } else {
            console.error('Error: Tray icon file does not exist in resources.');
            return null;
        }
    } else {
        const iconPath = path.join(__dirname, 'egg.ico');
        console.log('Looking for tray icon in development:', iconPath);
        if (fs.existsSync(iconPath)) {
            return iconPath;
        } else {
            console.error('Error: Tray icon file does not exist in development.');
            return null;
        }
    }
}

// Get the correct path for the HTML file
// Get the correct path for the HTML file
function getHtmlFilePath() {
    if (app.isPackaged) {
        // For packaged app, the file is under the 'resources' folder
        return path.join(process.resourcesPath, 'client', 'client.html');
    } else {
        // For development mode, look for the file in the root
        return path.join(__dirname, 'client.html');
    }
}


// Create the main application window
function createMainWindow() {
    const htmlPath = getHtmlFilePath();

    if (!fs.existsSync(htmlPath)) {
        console.error('Error: client.html file does not exist at:', htmlPath);
        app.quit();
        return;
    }
    console.log('Resolved HTML Path:', htmlPath);

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const windowWidth = 250;
    const windowHeight = 150;

    const xPos = width - windowWidth;
    const yPos = height - windowHeight;

    mainWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: xPos,
        y: yPos,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        },
        resizable: false,
        alwaysOnTop: true,
        frame: false,
        show: false, // Hide initially
    });

    mainWindow.loadFile(htmlPath);

    mainWindow.once('ready-to-show', () => {
        console.log('Window ready to show.');
        mainWindow.show();
    });

    mainWindow.on('close', (event) => {
        console.log('Window close attempt.');
        event.preventDefault();
        mainWindow.hide(); // Hide the window instead of closing
    });
}

// Create the tray icon and menu
function createTray(trayIconPath) {
    try {
        tray = new Tray(trayIconPath);
        console.log('Tray icon loaded successfully.');

        const trayMenu = Menu.buildFromTemplate([
            { label: 'Show Window', click: () => mainWindow.show() },
            { label: 'Hide Window', click: () => mainWindow.hide() },
            { label: 'Exit', click: () => app.quit() },
        ]);

        tray.setToolTip('Client Dashboard');
        tray.setContextMenu(trayMenu);
    } catch (error) {
        console.error('Failed to load tray icon:', error);
        app.quit();
    }
}

app.on('ready', () => {
    console.log('App is ready.');

    const trayIconPath = getTrayIconPath();
    if (!trayIconPath) {
        console.error('Tray icon path is invalid. Exiting app.');
        app.quit();
        return;
    }

    createMainWindow();
    createTray(trayIconPath);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

process.on('uncaughtException', (err) => {
    console.error('Unhandled exception:', err);
    app.quit();
});
