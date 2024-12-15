let ws;
let startTime;
let timer;
let connected = false;

// Function to start WebSocket connection
function connect() {
  ws = new WebSocket('ws://192.168.1.21:8080');  // Connect to WebSocket server

  ws.onopen = () => {
    document.getElementById('status').textContent = 'Connected!';
    connected = true;
    startTime = Date.now();
    startTrackingTime();
  };

  ws.onclose = () => {
    document.getElementById('status').textContent = 'Connection Lost!';
    connected = false;
    stopTrackingTime();
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    document.getElementById('status').textContent = 'Connection failed';
  };
}

// Function to track time spent
function startTrackingTime() {
  timer = setInterval(() => {
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
  connect();

  // Handle login form submission (if there's a login form in the HTML)
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientId = document.getElementById('username').value;

      // Send login request to the server
      ws.send(JSON.stringify({
        type: 'login',
        clientId: clientId,
      }));
    });
  }
};
