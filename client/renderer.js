window.onload = () => {
  const ws = new WebSocket('ws://192.168.1.69:8080'); // Server IP and port
  const status = document.getElementById('status');
  const loginForm = document.getElementById('login-form');
  const connectBtn = document.getElementById('connect-btn'); // Button reference

  // WebSocket connection open event
  ws.onopen = () => {
    console.log('Client connected to WebSocket server');
    status.textContent = 'Connected to server!';
  };

  // WebSocket message event for receiving data from server
  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    
    if (data.type === 'loginResponse') {
      if (data.success) {
        status.textContent = 'Logged in successfully!';
      } else {
        status.textContent = 'Login failed. Invalid credentials.';
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
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login request to the WebSocket server
    ws.send(JSON.stringify({ type: 'login', username, password }));
  });

  // Handle "Connect" button click to notify admin
  connectBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    ws.send(JSON.stringify({ type: 'clientConnected', clientId: username }));
  });
};
