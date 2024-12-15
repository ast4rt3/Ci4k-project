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
      window.api.send('forceLogout', clientId);
    };
  } else if (document.title === 'Client Login') {
    const loginForm = document.getElementById('login-form');
    const status = document.getElementById('status');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientId = document.getElementById('username').value;

      ws.send(JSON.stringify({ type: 'login', clientId }));
      status.textContent = 'Logged in successfully!';
    });

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === 'logout') {
        alert('You have been logged out.');
        window.location.reload();
      }
    };
  }
};
