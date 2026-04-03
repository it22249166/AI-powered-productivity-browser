const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getProxyStatus: () => ipcRenderer.invoke("proxy:get-status"),
  applyProxy: (payload) => ipcRenderer.invoke("proxy:apply", payload),
  clearProxy: () => ipcRenderer.invoke("proxy:clear"),
});
