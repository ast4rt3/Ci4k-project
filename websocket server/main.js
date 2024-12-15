const { Server } = require('socket.io');
const io = new Server();

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('login', (data) => {
    // Handle login logic here
    io.emit('updateClients', { id: socket.id, status: 'Active', sessionTime: '00:05:00' });
  });

  socket.on('forceLogout', (clientId) => {
    io.to(clientId).emit('logout');
  });
});

io.listen(3000);
console.log('Socket server running on port 3000');
