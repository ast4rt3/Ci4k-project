const { contextBridge, ipcRenderer } = require('electron');

// Expose ipcRenderer methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  sendMessageToAdmin: (message) => ipcRenderer.send('send-message-to-admin', message)
});
