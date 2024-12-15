let ws;
let clientId = localStorage.getItem('clientId') || generateClientId(); // Use stored clientId or generate a new one
let connected = false;

function generateClientId() {
  const newClientId = 'client-' + Math.random().toString(36).substring(2, 15);
  localStorage.setItem('clientId', newClientId);
  return newClientId;
}

function connect() {
  ws = new WebSocket('ws://192.168.1.21:8080');

  ws.onopen = () => {
    console.log('Connected to server');
    connected = true;
    ws.send(JSON.stringify({ type: 'clientConnect', clientId: clientId }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'reconnect') {
      console.log('Reconnected!');
      console.log('Previous connection time:', new Date(data.previousConnectionTime));
      console.log('Last disconnect time:', new Date(data.lastDisconnectTime));
    }

    if (data.type === 'newUser') {
      console.log('New user connected:', data.clientId);
    }

    if (data.type === 'userDisconnected') {
      console.log('User disconnected:', data.clientId);
    }
  };

  ws.onclose = () => {
    console.log('Disconnected');
    connected = false;
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

connect();
