const { app, BrowserWindow, shell, globalShortcut } = require("electron");
const path = require("path");

const GEMINI_URL = "https://gemini.google.com/";

const windows = new Set();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Gemini",
    icon: path.join(__dirname, "build", "icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      partition: "persist:gemini",
    },
  });

  // Load Gemini
  win.loadURL(GEMINI_URL);

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith("https://gemini.google.com")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  // Set user agent to avoid potential blocks
  win.webContents.setUserAgent(win.webContents.getUserAgent().replace("Electron", ""));

  // Inject CSS for full-width chat
  win.webContents.on("did-finish-load", () => {
    win.webContents.insertCSS(`
      /* Full width chat content */
      .conversation-container,
      .chat-container,
      [class*="conversation"],
      [class*="response-container"],
      [class*="message-content"] {
        max-width: 100% !important;
        width: 100% !important;
      }

      /* Remove content width restrictions */
      main > div,
      main > div > div {
        max-width: 100% !important;
      }
    `);
  });

  windows.add(win);
  win.on("closed", () => {
    windows.delete(win);
  });

  return win;
}

app.whenReady().then(() => {
  createWindow();

  // Cmd+N: Open new window
  globalShortcut.register("CommandOrControl+N", () => {
    createWindow();
  });

  // Cmd+1: Click bard mode menu button, then select fast mode
  globalShortcut.register("CommandOrControl+1", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.webContents.executeJavaScript(`
        document.querySelector("[data-test-id='bard-mode-menu-button']")?.click();
        setTimeout(() => {
          document.querySelector("[data-test-id='bard-mode-option-fast']")?.click();
        }, 100);
      `);
    }
  });

  // Cmd+2: Click bard mode menu button, then select thinking mode
  globalShortcut.register("CommandOrControl+2", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.webContents.executeJavaScript(`
        document.querySelector("[data-test-id='bard-mode-menu-button']")?.click();
        setTimeout(() => {
          document.querySelector("[data-test-id='bard-mode-option-thinking']")?.click();
        }, 100);
      `);
    }
  });

  // Cmd+3: Click bard mode menu button, then select pro mode
  globalShortcut.register("CommandOrControl+3", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.webContents.executeJavaScript(`
        document.querySelector("[data-test-id='bard-mode-menu-button']")?.click();
        setTimeout(() => {
          document.querySelector("[data-test-id='bard-mode-option-pro']")?.click();
        }, 100);
      `);
    }
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (windows.size === 0) {
    createWindow();
  }
});
