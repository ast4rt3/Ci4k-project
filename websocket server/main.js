const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let clients = {};

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = JSON.parse(data);

    if (message.type === 'login') {
      // Register client
      clients[message.clientId] = ws;
      broadcastClients();
    } else if (message.type === 'logout') {
      // Remove client
      delete clients[message.clientId];
      broadcastClients();
    }
  });

  ws.on('close', () => {
    // Remove disconnected clients
    Object.keys(clients).forEach((id) => {
      if (clients[id] === ws) delete clients[id];
    });
    broadcastClients();
  });
});

// Send the list of connected clients to all admin clients
function broadcastClients() {
  const clientList = Object.keys(clients).map((id) => ({ id, status: 'active' }));
  const payload = JSON.stringify({ type: 'updateClients', clients: clientList });

  Object.values(clients).forEach((client) => {
    client.send(payload);
  });
}
