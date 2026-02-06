const { app, BrowserWindow, shell } = require("electron");
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
      .conversation-container[_ngcontent-ng-c1531589041] {
        max-width: 1200px !important;
      }
    `);
  });

  // Register keyboard shortcuts scoped to this window
  win.webContents.on("before-input-event", (event, input) => {
    if (!input.meta && !input.control) return;
    if (input.type !== "keyDown") return;

    if (input.key === "n") {
      event.preventDefault();
      createWindow();
    } else if (input.key === "1") {
      event.preventDefault();
      win.webContents.executeJavaScript(`
        document.querySelector("[data-test-id='bard-mode-menu-button']")?.click();
        setTimeout(() => {
          document.querySelector("[data-test-id='bard-mode-option-fast']")?.click();
        }, 100);
      `);
    } else if (input.key === "2") {
      event.preventDefault();
      win.webContents.executeJavaScript(`
        document.querySelector("[data-test-id='bard-mode-menu-button']")?.click();
        setTimeout(() => {
          document.querySelector("[data-test-id='bard-mode-option-thinking']")?.click();
        }, 100);
      `);
    } else if (input.key === "3") {
      event.preventDefault();
      win.webContents.executeJavaScript(`
        document.querySelector("[data-test-id='bard-mode-menu-button']")?.click();
        setTimeout(() => {
          document.querySelector("[data-test-id='bard-mode-option-pro']")?.click();
        }, 100);
      `);
    }
  });

  windows.add(win);
  win.on("closed", () => {
    windows.delete(win);
  });

  return win;
}

app.whenReady().then(() => {
  createWindow();
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
