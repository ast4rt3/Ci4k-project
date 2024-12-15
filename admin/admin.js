const ws = new WebSocket('ws://192.168.1.21:8080'); // WebSocket server connection

ws.onopen = () => {
  console.log('Connected to WebSocket server');
};

ws.onerror = (error) => {
  console.error('WebSocket Error:', error);
};

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  console.log('Received:', data);

  if (data.type === 'newUser') {
    // A new user connected
    showNotification(`New user connected: ${data.clientId}`);
    addUserToTable(data.clientId, data.connectTime); // Add user details to the table
  }

  if (data.type === 'userDisconnected') {
    // A user disconnected
    const duration = formatDuration(data.duration);
    showNotification(`User ${data.clientId} disconnected. Duration: ${duration}`);
    updateUserStatus(data.clientId, 'Disconnected', duration);
  }

  if (data.type === 'clientList') {
    // Updates the list of connected clients
    updateClientTable(data.clients);
  }
};

// Display a notification on the admin dashboard
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000); // Hide notification after 5 seconds
}

// Add a connected client to the table
function addUserToTable(clientId, timestamp) {
  const tableBody = document.getElementById('client-table-body');
  const row = document.createElement('tr');
  row.id = `client-${clientId}`;

  // Convert timestamp to readable time
  const connectTime = new Date(timestamp).toLocaleTimeString();

  row.innerHTML = `
    <td>${clientId}</td>
    <td>Connected</td>
    <td id="time-${clientId}">Joined at: ${connectTime}</td>
    <td>
      <button onclick="logoutClient('${clientId}')">Logout</button>
    </td>
  `;

  tableBody.appendChild(row);
}

// Update user status when disconnected
function updateUserStatus(clientId, status, duration) {
  const row = document.getElementById(`client-${clientId}`);
  if (row) {
    const statusCell = row.children[1]; // Status column
    const timeCell = row.children[2];  // Connection time column

    statusCell.textContent = status;
    timeCell.textContent = `Duration: ${duration}`;
    row.style.backgroundColor = '#f8d7da'; // Optional: Highlight disconnected user row
  }
}

// Update the full client table (e.g., for periodic updates)
function updateClientTable(clients) {
  const tableBody = document.getElementById('client-table-body');
  tableBody.innerHTML = ''; // Clear the table before updating

  clients.forEach((client) => {
    const row = document.createElement('tr');
    row.id = `client-${client.id}`;

    const duration = client.duration
      ? `Duration: ${formatDuration(client.duration)}`
      : 'Connected';

    const status = client.status || 'Connected';
    const connectTime = client.connectTime
      ? new Date(client.connectTime).toLocaleTimeString()
      : 'Unknown';

    row.innerHTML = `
      <td>${client.id}</td>
      <td>${status}</td>
      <td>${duration}</td>
      <td>
        <button onclick="logoutClient('${client.id}')">Logout</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Logout a client
function logoutClient(clientId) {
  ws.send(JSON.stringify({ type: 'logout', clientId }));
  console.log(`Logout request sent for client: ${clientId}`);
}

// Format duration in seconds to a readable format
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

// Periodically request client updates from the server
setInterval(() => {
  ws.send(JSON.stringify({ type: 'updateClients' }));
}, 1000); // Update every second
