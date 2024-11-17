const { ipcRenderer } = require('electron');

// Listen for 'client-data' event sent from the main process
ipcRenderer.on('client-data', (event, data) => {
    console.log('Received data:', data);
    // Update the DOM or UI with the received data
    document.getElementById('clientData').innerText = JSON.stringify(data, null, 2);
});
