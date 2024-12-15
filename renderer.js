// Renderer logic for Admin and Client
window.onload = () => {
    if (document.title === 'Admin Dashboard') {
      // Admin logic
      const clientTable = document.querySelector('#client-table tbody');
  
      window.api.on('updateClients', (clients) => {
        clientTable.innerHTML = '';
        clients.forEach((client) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.status}</td>
            <td>${client.sessionTime}</td>
            <td>
              <button onclick="forceLogout(${client.id})">Logout</button>
            </td>
          `;
          clientTable.appendChild(row);
        });
      });
    } else if (document.title === 'Client Login') {
      // Client logic
      const form = document.getElementById('login-form');
      const status = document.getElementById('status');
  
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        window.api.send('login', { username, password });
  
        window.api.on('loginResponse', (response) => {
          if (response.success) {
            status.textContent = 'Login successful!';
          } else {
            status.textContent = 'Login failed. Try again.';
          }
        });
      });
    }
  };
  