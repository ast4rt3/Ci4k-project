window.onload = () => {
  const ws = new WebSocket('ws://192.168.1.69:8080'); // Use your local IP

  const status = document.getElementById('status'); // For displaying connection status
  const loginForm = document.getElementById('login-form'); // For login form

  // WebSocket connection open event
  ws.onopen = () => {
    console.log('Client connected successfully to WebSocket server'); // Debug log
    status.textContent = 'Connected to server successfully!'; // Update UI with success message
  };

  // WebSocket error event
  ws.onerror = (error) => {
    console.error('WebSocket error:', error); // Debug log
    status.textContent = 'Error connecting to server. Please try again later.'; // Update UI with error message
  };

  // WebSocket message event for receiving data from server
  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    
    if (data.type === 'loginResponse') {
      if (data.success) {
        status.textContent = 'Logged in successfully!';
      } else {
        status.textContent = 'Login failed. Try again.';
      }
    }

    if (data.type === 'logout') {
      alert('You have been logged out.');
      window.location.reload();
    }
  };

  // Handle login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const clientId = document.getElementById('username').value;

    // Send login request to the WebSocket server
    ws.send(JSON.stringify({ type: 'login', clientId }));
  });
};
