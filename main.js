const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

const GEMINI_URL = 'https://gemini.google.com/';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Gemini',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      partition: 'persist:gemini'
    }
  });

  // Load Gemini
  mainWindow.loadURL(GEMINI_URL);

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('https://gemini.google.com')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Set user agent to avoid potential blocks
  mainWindow.webContents.setUserAgent(
    mainWindow.webContents.getUserAgent().replace('Electron', '')
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
