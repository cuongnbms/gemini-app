const { app, BrowserWindow, shell, globalShortcut } = require("electron");
const path = require("path");

const GEMINI_URL = "https://gemini.google.com/";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
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
  mainWindow.loadURL(GEMINI_URL);

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith("https://gemini.google.com")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  // Set user agent to avoid potential blocks
  mainWindow.webContents.setUserAgent(mainWindow.webContents.getUserAgent().replace("Electron", ""));

  // Inject CSS for full-width chat
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.insertCSS(`
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

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Cmd+1: Click bard mode menu button, then select fast mode
  globalShortcut.register("CommandOrControl+1", () => {
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript(`
        document.querySelector("[data-test-id='bard-mode-menu-button']")?.click();
        setTimeout(() => {
          document.querySelector("[data-test-id='bard-mode-option-fast']")?.click();
        }, 100);
      `);
    }
  });

  // Cmd+2: Click bard mode menu button, then select thinking mode
  globalShortcut.register("CommandOrControl+2", () => {
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript(`
        document.querySelector("[data-test-id='bard-mode-menu-button']")?.click();
        setTimeout(() => {
          document.querySelector("[data-test-id='bard-mode-option-thinking']")?.click();
        }, 100);
      `);
    }
  });

  // Cmd+3: Click bard mode menu button, then select pro mode
  globalShortcut.register("CommandOrControl+3", () => {
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript(`
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
  if (mainWindow === null) {
    createWindow();
  }
});
