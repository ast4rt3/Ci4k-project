const { contextBridge, ipcRenderer } = require('electron');

// Expose APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    runNpmStart: () => ipcRenderer.invoke('run-npm-start'),
    getUsername: () => ipcRenderer.invoke('get-username') // Add a method to get the username
});
