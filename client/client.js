const ws = new WebSocket('ws://192.168.1.21:8080');  // WebSocket server URL

let clientId = localStorage.getItem('clientId');  // Retrieve stored client ID (if any)

// Generate a new client ID if not found
if (!clientId) {
  clientId = generateUniqueId();
  localStorage.setItem('clientId', clientId);  // Store the client ID locally
  console.log('Generated new client ID:', clientId);
}

// Send client ID on connection
ws.onopen = () => {
  console.log(`Connected with Client ID: ${clientId}`);
  ws.send(JSON.stringify({
    type: 'clientConnect',
    clientId: clientId,
    timestamp: Date.now(),
  }));
};

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  console.log('Received:', data);
};

ws.onerror = (error) => {
  console.error('WebSocket Error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from server');
};

// Generate a unique client ID (can be a random number, UUID, etc.)
function generateUniqueId() {
  return 'client-' + Math.random().toString(36).substr(2, 9);
}
