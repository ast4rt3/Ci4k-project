let ws;  // WebSocket variable

// Function to create and manage WebSocket connection
function connectWebSocket() {
  ws = new WebSocket('ws://192.168.1.21:8080');  // Connect to the WebSocket server

  ws.onopen = () => {
    console.log('Connected to the WebSocket server');
    document.getElementById('status').textContent = 'Connected successfully!';
  };

  ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
    document.getElementById('status').textContent = 'Connection failed';
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

    // Try to reconnect after 3 seconds if the connection is lost
    setTimeout(connectWebSocket, 3000);
  };
}

// Initialize WebSocket connection
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
