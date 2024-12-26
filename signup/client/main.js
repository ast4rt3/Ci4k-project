const { ipcRenderer } = require('electron'); // Import ipcRenderer to communicate with the main process

let ws;  // WebSocket variable
let startTime;
let timer;
let connected = false;
let reconnectAttempts = 0;  // Track the number of reconnect attempts
let studentID;  // Client ID for login

// Function to get and display the PC username
async function getAndDisplayUsername() {
  try {
    studentID = await ipcRenderer.invoke('get-pc-username');  // Request the PC username from the main process
    console.log('PC Username:', studentID);
    document.getElementById('pcUsername').textContent = `PC: ${studentID}`; // Display the username
  } catch (error) {
    console.error('Error retrieving PC username:', error);
  }
}

// Function to create and manage WebSocket connection
function connectWebSocket() {
  const serverAddress = 'ws://localhost:8080';  // Adjust WebSocket URL to server's address
  ws = new WebSocket(serverAddress);

  ws.onopen = async () => {
    console.log('Connected to the WebSocket server');
    document.getElementById('status').textContent = 'Connected successfully!';
    connected = true;

    // Notify the server of the new connection
    ws.send(JSON.stringify({
      type: 'clientConnect',
      studentID: studentID,  // Send the PC username as studentID
      computerNumber: 1,     // or dynamically determine it
    }));

    // Initialize the start time
    startTime = Date.now();
    console.log('Connection opened. Start time set to:', startTime);

    startTrackingTime();

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

// Start tracking time and update the UI
function startTrackingTime() {
  timer = setInterval(() => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    updateTimeSpent(timeSpent);
    sendTimeUpdate(timeSpent);
  }, 1000); // Update every second
}

// Send time update to the server
function sendTimeUpdate(timeSpent) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'timeUpdate',
      studentID: studentID,  // Send student ID along with the time update
      timeSpent: timeSpent,
    }));
  }
}

// Update the UI with the time spent
function updateTimeSpent(timeSpent) {
  document.getElementById('timeSpent').textContent = `Time Spent: ${timeSpent}s`;
}

// Stop the time tracking when the user disconnects
function stopTrackingTime() {
  clearInterval(timer);
}

// Handle login response (optional, you can adjust as per your requirements)
function handleLoginResponse(data) {
  console.log('Login response received:', data);
}

// Show notifications to the user
function showNotification(message) {
  new Notification('Server Message', { body: message });
}

// Initial call to get the username
getAndDisplayUsername();

// Connect WebSocket when ready
connectWebSocket();
