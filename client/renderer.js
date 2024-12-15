const ws = new WebSocket('ws://192.168.1.69:8080');

ws.onopen = () => {
  console.log('Connected to WebSocket server!');
  ws.send(JSON.stringify({ type: 'ping' }));  // Send a test message
};

ws.onmessage = (message) => {
  console.log('Received from server:', message.data);
};

ws.onerror = (error) => {
  console.error('WebSocket Error:', error);
};

ws.onclose = (event) => {
  console.log('Connection closed:', event);
};
