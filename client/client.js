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

// Automatically attempt to connect on page load
window.onload = connect;
