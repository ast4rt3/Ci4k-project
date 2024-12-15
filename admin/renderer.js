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
        <td id="connect-time-${client.id}">${client.connectTime ? `Connected for: ${formatDuration(client.connectTime)}` : 'N/A'}</td>
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

  // Function to update the countdown on the client table
  function updateCountdown() {
    const clients = document.querySelectorAll('#client-table tbody tr');
    clients.forEach((row) => {
      const connectTimeCell = row.querySelector('td:nth-child(3)');
      if (connectTimeCell) {
        const id = row.querySelector('td:first-child').textContent;
        const client = getClientById(id);
        if (client && client.connectTime) {
          const elapsedTime = Math.floor((Date.now() - client.connectTime) / 1000);  // in seconds
          connectTimeCell.textContent = `Connected for: ${formatDuration(elapsedTime)}`;
        }
      }
    });
  }

  // Simulate fetching a client by ID (you can modify this to be real)
  function getClientById(id) {
    // This function is just for illustration purposes
    // You can replace this with your actual logic of accessing client data
    return {
      id,
      connectTime: Date.now() - (Math.floor(Math.random() * 10000)), // Random simulate connection time
    };
  }

  // Update countdown every second
  setInterval(updateCountdown, 1000);
};
