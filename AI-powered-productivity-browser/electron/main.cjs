const { app, BrowserWindow, ipcMain, shell, session } = require("electron");
const path = require("node:path");

const isDev = !app.isPackaged;
let proxyState = {
  connected: false,
  label: "Direct",
  country: "Local",
  proxyRules: "",
  language: "System",
  timezone: "System",
};
let proxyAuth = {
  username: "",
  password: "",
};

app.on("login", (event, webContents, request, authInfo, callback) => {
  if (authInfo.isProxy && proxyAuth.username) {
    event.preventDefault();
    callback(proxyAuth.username, proxyAuth.password);
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1500,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#081522",
    title: "Intentra",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    return;
  }

  win.loadFile(path.join(__dirname, "../dist/index.html"));
}

ipcMain.handle("proxy:get-status", async () => proxyState);

ipcMain.handle("proxy:apply", async (_event, payload) => {
  const { proxyRules, bypassRules, label, country, language, timezone, username, password } = payload;

  await session.defaultSession.setProxy({
    proxyRules,
    proxyBypassRules: bypassRules || "",
  });
  proxyAuth = {
    username: username || "",
    password: password || "",
  };

  proxyState = {
    connected: true,
    label,
    country,
    proxyRules,
    language,
    timezone,
  };

  return proxyState;
});

ipcMain.handle("proxy:clear", async () => {
  await session.defaultSession.setProxy({
    mode: "direct",
  });

  proxyState = {
    connected: false,
    label: "Direct",
    country: "Local",
    proxyRules: "",
    language: "System",
    timezone: "System",
  };
  proxyAuth = {
    username: "",
    password: "",
  };

  return proxyState;
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
