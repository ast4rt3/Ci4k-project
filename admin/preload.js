const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onClientData: (callback) => ipcRenderer.on('update-client-list', (event, data) => callback(data)),
    onStatusUpdate: (callback) => ipcRenderer.on('status-update', (event, data) => callback(data)),
    onClientActionMessage: (callback) => ipcRenderer.on('client-action-message', (event, data) => callback(data)),
    reconnect: () => ipcRenderer.send('reconnect'),
});
