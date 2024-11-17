const { ipcRenderer } = require('electron');

<<<<<<< HEAD:renderer.js
// Listen for messages from the client
ipcRenderer.on('display-client-message', (event, message) => {
    const messageDiv = document.getElementById('clientMessages');
    messageDiv.innerHTML = `<p>${message}</p>`;  // Display the message in the UI
=======
// Listen for the 'client-data' event from the main process
ipcRenderer.on('client-data', (event, username) => {
    console.log('Received username:', username);

    // Update the HTML to show the received username
    document.getElementById('clientData').innerText = `Client's username: ${username}`;
>>>>>>> parent of 9e65829 (eeeeeee):admin/renderer.js
});
