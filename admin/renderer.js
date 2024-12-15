window.onload = () => {
  const ws = new WebSocket('ws://192.168.1.69:8080'); // Server IP and port

  const clientTable = document.querySelector('#client-table tbody'); // Table reference

  // WebSocket connection open event
  ws.onopen = () => {
    console.log('Admin connected to WebSocket server');
  };

  // WebSocket message event for receiving data from server
  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);

    if (data.type === 'updateClients') {
      // Clear the current table
      clientTable.innerHTML = '';

      // Display the list of connected clients
      data.clients.forEach((client) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${client.id}</td>
          <td>${client.status}</td>
        `;
        clientTable.appendChild(row);
      });
    }
  };
};
