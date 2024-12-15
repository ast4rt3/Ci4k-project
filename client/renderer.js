let ws;  // WebSocket variable
let startTime;
let timer;
let connected = false;

// Function to create and manage WebSocket connection
function connectWebSocket() {
  ws = new WebSocket('ws://192.168.1.21:8080');  // Connect to the WebSocket server

  ws.onopen = () => {
    console.log('Connected to the WebSocket server');
    document.getElementById('status').textContent = 'Connected successfully!';
    connected = true;
    startTime = Date.now();
    startTrackingTime();
  };

  ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
    document.getElementById('status').textContent = 'Connection failed';
    connected = false;
  };

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    console.log('Received:', data);

    if (data.type === 'loginResponse') {
      const status = document.getElementById('status');
      if (data.success) {
        status.textContent = 'Logged in successfully!';
      } else {
        status.textContent = 'Login failed. Try again.';
      }
    }
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed. Reconnecting...');
    document.getElementById('status').textContent = 'Disconnected. Reconnecting...';
    connected = false;
    stopTrackingTime();

    // Try to reconnect after 3 seconds if the connection is lost
    setTimeout(connectWebSocket, 3000);
  };
}

// Function to track time spent
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

// Automatically attempt to connect on page load
window.onload = () => {
  connectWebSocket();

  // Handle login form submission
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const clientId = document.getElementById('username').value;

    // Send login request to the server
    ws.send(JSON.stringify({
      type: 'login',
      clientId: clientId,
    }));
  });
};
let ws;
let clientWindow;

function connectWebSocket() {
  ws = new WebSocket('ws://192.168.1.21:8080');  // Connect to the WebSocket server

  ws.onopen = () => {
    console.log('Connected to WebSocket');
    // Optionally show connection status in client window
    if (clientWindow) {
      clientWindow.webContents.send('status', 'Connected');
    }
  };

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    console.log('Received:', data);

    // If login is successful, open the small client window
    if (data.type === 'loginResponse' && data.success) {
      createClientWindow();
    }
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };
}

function createClientWindow() {
  if (clientWindow) return;  // Ensure only one client window is created

  clientWindow = new BrowserWindow({
    width: 250,
    height: 150,
    frame: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    x: 1920 - 250,  // Set to right bottom of the screen (if screen width is 1920px)
    y: 1080 - 150,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  clientWindow.loadFile('client/client.html');
}

window.onload = connectWebSocket;
