const socket = new WebSocket('ws://192.168.1.69:8080');  // Server IP address

socket.onopen = function() {
    console.log('Connected to signaling server');
    
    // Send the username after connection is established
    const username = 'ClientUsername'; // Replace with actual username
    socket.send(JSON.stringify({ type: 'client-info', username: username }));
};

socket.onmessage = function(event) {
    console.log('Received message:', event.data);
};

socket.onerror = function(error) {
    console.log('WebSocket Error:', error);
};

socket.onclose = function() {
    console.log('Disconnected from signaling server');
};
