const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const childProcess = require('child_process');

let signupWindow;

function createSignupWindow() {
  signupWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Disable nodeIntegration for security
      contextIsolation: true, // Enable context isolation
      preload: path.join(__dirname, 'preload.js'), // Ensure preload is used
    },
  });

  signupWindow.loadFile(path.join(__dirname, 'signup.html'));

  signupWindow.on('closed', () => {
    signupWindow = null;
  });
}

// Event to open the client window and run the `npm start` command
ipcMain.on('open-client', (event) => {
  // Path to the client directory where the client app resides
  const clientDir = path.join(__dirname, 'client');
  
  console.log(`Starting client app in directory: ${clientDir}`);



  // Wrap the npm start command in double quotes to handle spaces in paths
  const command = `npm start`;

  // Execute the command to start the client app from the client directory
  childProcess.exec(command, { cwd: clientDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting client app: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  // Optional: Delay the closing of the signup window for 5 seconds (or adjust as needed)
  setTimeout(() => {
    if (signupWindow) {
      signupWindow.close();
    }
  }, 5000);  // Delay for 5 seconds (5000 milliseconds)
});

app.whenReady().then(createSignupWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
