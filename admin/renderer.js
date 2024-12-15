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

    if (data.type === 'updateClients') {
      const clientTable = document.querySelector('#client-table tbody');
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

  // Handle client logout
  window.logoutClient = (clientId) => {
    ws.send(JSON.stringify({ type: 'logout', clientId }));
  };

  // Periodically request client updates from the server
  setInterval(() => {
    ws.send(JSON.stringify({ type: 'updateClients' }));
  }, 1000); // Update every second
};
