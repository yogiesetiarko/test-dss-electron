const { app, BrowserWindow } = require('electron');
// const url = require('url');
// const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');

  // Open DevTools if in development mode
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// function createMainWindow() {
//   const mainWindow = new BrowserWindow({
//     title: 'electron',
//     width: 1000,
//     height: 600
//   });

//   const startUrl = url.format({
//     pathname: path.join(__dirname, 'index.html'),
//     protocol: file
//   });

//   console.log("aa", startUrl)

//   mainWindow.loadURL(startUrl);
// }

// app.whenReady().then(createMainWindow);

