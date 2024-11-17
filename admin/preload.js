const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onClientData: (callback) => ipcRenderer.on('client-data', (event, data) => callback(data)),
});
