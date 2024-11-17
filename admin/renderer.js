const { ipcRenderer } = require('electron');

// Listen for the 'client-data' event from the main process
ipcRenderer.on('client-data', (event, username) => {
    console.log('Received username:', username);
    document.getElementById('clientData').innerText = `Client's username: ${username}`;
});
