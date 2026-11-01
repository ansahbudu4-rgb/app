const { app, BrowserWindow, shell } = require("electron");
const { URL } = require("node:url");
const { schoolhubPortalUrl } = require("../package.json");

const portalUrl = process.env.SCHOOLHUB_PORTAL_URL || schoolhubPortalUrl;
const portalLocation = new URL(portalUrl);

if (portalLocation.protocol !== "https:") {
  throw new Error("SCHOOLHUB_PORTAL_URL must use HTTPS.");
}

function isPortalUrl(candidate) {
  try {
    return new URL(candidate).origin === portalLocation.origin;
  } catch {
    return false;
  }
}

function openExternalUrl(candidate) {
  try {
    const url = new URL(candidate);
    if (url.protocol === "https:" || url.protocol === "http:") {
      void shell.openExternal(url.href);
    }
  } catch {
    return;
  }
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    backgroundColor: "#f7f8f6",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (!isPortalUrl(url)) {
      openExternalUrl(url);
    }
    return { action: "deny" };
  });
  window.webContents.on("will-navigate", (event, url) => {
    if (!isPortalUrl(url)) {
      event.preventDefault();
      openExternalUrl(url);
    }
  });

  void window.loadURL(portalLocation.href);
}

app.whenReady().then(() => {
  app.setAppUserModelId("com.schoolhub.desktop");
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