const WebSocket = require('ws');
const wss = new WebSocket.Server({ host: '192.168.1.69', port: 8080 });

wss.on('connection', (ws) => {
  console.log('A client connected');

  ws.on('message', (message) => {
    console.log('Received: ' + message);
  });

  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));
});

console.log('WebSocket server started on ws://192.168.1.69:8080');
