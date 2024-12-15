window.onload = () => {
  const ws = new WebSocket('ws://192.168.1.69:8080'); // Change localhost to your local IP
  const status = document.getElementById('status'); // Display connection status

  // When the WebSocket connection is opened successfully
  ws.onopen = () => {
    status.textContent = 'Connected successfully!';
    console.log('Connected to the server');
  };

  // When the WebSocket connection is closed
  ws.onclose = () => {
    status.textContent = 'Connection lost!';
    console.log('Connection closed');
  };

  // Handle incoming messages from the server
  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    console.log('Received message:', data);

    if (data.type === 'loginResponse') {
      if (data.success) {
        status.textContent = 'Logged in successfully!';
      } else {
        status.textContent = 'Login failed. Try again.';
      }
    }

    // Handle logout
    if (data.type === 'logout') {
      alert('You have been logged out.');
      window.location.reload();
    }
  };

  // Handle errors
  ws.onerror = (error) => {
    console.log('WebSocket error:', error);
    status.textContent = 'WebSocket error occurred';
  };

  // Handle form submission for login
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const clientId = document.getElementById('username').value;
    ws.send(JSON.stringify({ type: 'login', clientId }));
  });
};
