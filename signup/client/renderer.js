let ws;  // WebSocket variable
let startTime;
let timer;
let connected = false;
let reconnectAttempts = 0;  // Track the number of reconnect attempts

// Function to create and manage WebSocket connection
function connectWebSocket() {
  ws = new WebSocket('ws://localhost:8080'); // WebSocket server connection 

  ws.onopen = () => {
    console.log('Connected to the WebSocket server');
    document.getElementById('status').textContent = 'Connected successfully!';
    connected = true;

    // Initialize the start time
    startTime = Date.now();
    console.log('Connection opened. Start time set to:', startTime);

    startTrackingTime();

    // Notify the server of the new connection
    ws.send(JSON.stringify({ type: 'clientConnect' }));

    // Reset reconnect attempts on successful connection
    reconnectAttempts = 0;
  };

  ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
    document.getElementById('status').textContent = 'Connection error. Please try again.';
    connected = false;
  };

  ws.onmessage = (message) => {
    try {
      const data = JSON.parse(message.data);
      console.log('Received:', data);

      if (data.type === 'loginResponse') {
        handleLoginResponse(data);
      } else if (data.type === 'timeUpdate') {
        updateTimeSpent(data.timeSpent);
      } else if (data.type === 'notification') {
        showNotification(data.message);
      }
    } catch (e) {
      console.error('Error parsing WebSocket message:', e);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed. Reconnecting...');
    document.getElementById('status').textContent = 'Disconnected. Reconnecting...';
    connected = false;
    stopTrackingTime();

    // Try to reconnect with an increasing delay if the connection is lost
    reconnectAttempts++;
    const reconnectDelay = Math.min(3000 * reconnectAttempts, 30000); // Max 30 seconds delay
    setTimeout(connectWebSocket, reconnectDelay);
  };
}

// Function to track time spent
function startTrackingTime() {
  console.log('Starting time tracking...');
  console.log('Start time (ms):', startTime);

  timer = setInterval(() => {
    if (connected) {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      console.log('Elapsed time (seconds):', elapsedTime);
      updateTimeSpent(elapsedTime);

      // Send the time spent to the server
      if (ws.readyState === WebSocket.OPEN) {
        console.log('Sending time update to server:', elapsedTime);
        ws.send(JSON.stringify({ type: 'timeUpdate', timeSpent: elapsedTime }));
      } else {
        console.warn('WebSocket is not open.');
      }
    } else {
      console.warn('Not connected. Skipping time tracking.');
    }
  }, 1000);
}

// Function to stop time tracking
function stopTrackingTime() {
  clearInterval(timer);
  document.getElementById('timeSpent').textContent = 'Time Spent: 00:00:00';
}

// Function to update time spent on the UI
function updateTimeSpent(timeSpent) {
  const formattedTime = formatDuration(timeSpent); // Format the time
  console.log('Updating UI with time spent:', formattedTime);
  document.getElementById('timeSpent').textContent = `Time Spent: ${formattedTime}`; // Display formatted time
}

// Format duration in seconds to a readable format (hh:mm:ss)
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600); // Calculate the number of hours
  const minutes = Math.floor((seconds % 3600) / 60); // Calculate the number of minutes
  const remainingSeconds = seconds % 60;   // Calculate the remaining seconds

  // Pad the time to always show two digits (e.g., "01" instead of "1")
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`; // Return time in "hh:mm:ss" format
}

// Handle login response
function handleLoginResponse(data) {
  const status = document.getElementById('status');
  if (data.success) {
    status.textContent = 'Logged in successfully!';
  } else {
    status.textContent = 'Login failed. Please check your credentials.';
  }
}

// Display a notification to the user
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000); // Hide notification after 5 seconds
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

    // Validate clientId
    if (!clientId.trim()) {
      document.getElementById('status').textContent = 'Please enter a valid username.';
      return;
    }

    // Send login request to the server
    if (connected && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'login',
        clientId: clientId,
      }));
    } else {
      console.error('WebSocket connection not established.');
      document.getElementById('status').textContent = 'Unable to log in. Reconnecting...';
    }
  });
};
