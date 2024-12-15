const ws = new WebSocket('ws://192.168.1.21:8080');  // Connect to the WebSocket server

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
    addUserToList(data.clientId);
  }

  if (data.type === 'userDisconnected') {
    // A user disconnected
    const duration = formatDuration(data.duration);
    showNotification(`User ${data.clientId} disconnected. Duration: ${duration}`);
    removeUserFromList(data.clientId);
  }
};

// Display a notification on the admin dashboard
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);  // Hide notification after 5 seconds
}

// Add a new user to the connected users list
function addUserToList(clientId) {
  const list = document.getElementById('connectedUsers');
  const listItem = document.createElement('li');
  listItem.id = `user-${clientId}`;
  listItem.textContent = `${clientId} (Connected)`;
  list.appendChild(listItem);
}

// Remove a user from the list when they disconnect
function removeUserFromList(clientId) {
  const list = document.getElementById('connectedUsers');
  const listItem = document.getElementById(`user-${clientId}`);
  if (listItem) {
    listItem.textContent = `${clientId} (Disconnected)`;
    listItem.style.textDecoration = 'line-through';  // Optional: Strike through disconnected user
  }
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


// admin.js
fetch('http://localhost:3000/clients')
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // Display client data on the admin side
  })
  .catch((error) => console.error('Error fetching client data:', error));
