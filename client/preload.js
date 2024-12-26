const { contextBridge, ipcRenderer } = require('electron');

// Expose only the necessary API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    runNpmStart: () => ipcRenderer.invoke('run-npm-start') // This will call the 'run-npm-start' handler in main.js
});

