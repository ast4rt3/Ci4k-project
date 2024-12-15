window.onload = () => {
  const ws = new WebSocket('ws://localhost:8080');

  if (document.title === 'Admin Dashboard') {
    const clientTable = document.querySelector('#client-table tbody');

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === 'updateClients') {
        clientTable.innerHTML = '';
        data.clients.forEach((client) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.status}</td>
            <td>
              <button onclick="logoutClient('${client.id}')">Logout</button>
            </td>
          `;
          clientTable.appendChild(row);
        });
      }
    };

    window.logoutClient = (clientId) => {
      ws.send(JSON.stringify({ type: 'logout', clientId }));
    };

  } else if (document.title === 'Client Login') {
    const loginForm = document.getElementById('login-form');
    const status = document.getElementById('status');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientId = document.getElementById('username').value;

      // Send login request
      ws.send(JSON.stringify({ type: 'login', clientId }));

      // Waiting for the server's response to handle login success/failure
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.type === 'loginResponse') {
          if (data.success) {
            status.textContent = 'Logged in successfully!';
            // Optionally, redirect or update UI here
          } else {
            status.textContent = 'Login failed. Try again.';
          }
        }

        // Handle logout response (if needed)
        if (data.type === 'logout') {
          alert('You have been logged out.');
          window.location.reload();
        }
      };
    });
  }
};
