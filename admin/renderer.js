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
      // Update the client list on the renderer side
      updateClientsTable(data.clients);
    }
  };

  // Update the client table with data from the server
  function updateClientsTable(clients) {
    const clientTable = document.querySelector('#client-table tbody');
    clientTable.innerHTML = '';  // Clear existing rows

    clients.forEach((client) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${client.id}</td>
        <td>${client.status}</td>
        <td>${client.connectTime ? `Connected for: ${formatDuration(client.connectTime)}` : 'N/A'}</td>
      `;
      clientTable.appendChild(row);
    });
  }

  // Format duration in seconds to a readable format (e.g., "5 minutes", "2 hours")
  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours} hours ${remainingMinutes} minutes`;
    }
    return `${minutes} minutes`;
  }

  // Periodically request client updates from the server
  setInterval(() => {
    ws.send(JSON.stringify({ type: 'updateClients' }));
  }, 1000); // Update every second
};
