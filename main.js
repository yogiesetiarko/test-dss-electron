const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      contentSecurityPolicy: "default-src 'self'; script-src 'self';",
    },
  });

  // const startUrl = url.format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: file
  // });

  // console.log(path.join(__dirname, 'index.html'))
  const parentDir = path.resolve(__dirname, '..');
  const dirReact = path.join(parentDir, 'test-dss-reactjs/dist/index.html');
  const newDir = path.resolve(dirReact);
  // console.log(parentDir)
  // console.log(dirReact)
  console.log(newDir)

  // const startUrl = url.format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: file
  // });
  // console.log(startUrl)

  win.webContents.openDevTools();

  // console.log("aaa");

  win.loadFile(dirReact);
  // win.loadURL('http://localhost:5173/halo');
  // win.loadURL('http://localhost:5173');

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

