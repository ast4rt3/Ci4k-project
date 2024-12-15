window.onload = () => {
  const ws = new WebSocket('ws://192.168.1.21:8080'); // Connect to the WebSocket server

  // Log WebSocket connection errors for debugging
  ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };

  // Handle WebSocket messages
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

    if (data.type === 'logout') {
      alert('You have been logged out.');
      window.location.reload();
    }
  };

  // Handle the login form submission
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
