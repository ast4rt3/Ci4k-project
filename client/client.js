let ws;
let startTime;
let timer;
let connected = false;

// Function to start WebSocket connection
function connect() {
  ws = new WebSocket('ws://192.168.1.21:8080');  // Replace with your server's IP

  ws.onopen = function() {
    document.getElementById('status').textContent = 'Connected!';
    connected = true;
    startTime = Date.now();
    startTrackingTime();
  };

  ws.onclose = function() {
    document.getElementById('status').textContent = 'Connection Lost!';
    connected = false;
    stopTrackingTime();
  };

  ws.onerror = function(error) {
    console.error('WebSocket error:', error);
  };
}

// Function to track time
function startTrackingTime() {
  timer = setInterval(function() {
    if (connected) {
      let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      document.getElementById('timeSpent').textContent = `Time Spent: ${elapsedTime}s`;
      
      // Send the time spent to the server
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'timeUpdate', timeSpent: elapsedTime }));
      }
    }
  }, 1000);
}

// Function to stop time tracking
function stopTrackingTime() {
  clearInterval(timer);
  document.getElementById('timeSpent').textContent = 'Time Spent: 0s';
}

// Function to disconnect WebSocket connection
function disconnect() {
  if (ws) {
    ws.close();
  }
  stopTrackingTime();
  document.getElementById('status').textContent = 'Disconnected';
}

const { app, BrowserWindow } = require('electron');
const path = require('path');

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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// Automatically attempt to connect on page load
window.onload = connect;
