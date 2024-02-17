const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
// const { ipcMain } = require('electron/main');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      // contextIsolation: false,
      // sandbox: false,
      // contentSecurityPolicy: "default-src 'self'; script-src 'self';",
    },
  });

  // const startUrl = url.format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: file
  // });

  // console.log(path.join(__dirname, 'index.html'))
  // const parentDir = path.resolve(__dirname, '..');
  // const dirReact = path.join(parentDir, 'test-dss-reactjs/dist/index.html');
  // const newDir = path.resolve(dirReact);
  // console.log(parentDir)
  // console.log(dirReact)

  // const yogieDir = path.resolve(__dirname, 'build/index.html');
  // const yogieDir = `file://${__dirname}/build/index.html`;
  // console.log(yogieDir)

  
  win.webContents.openDevTools();
  
  const startUrl = url.format({
    // pathname: path.join(__dirname, 'index.html'),
    // pathname: path.join(__dirname, './app/build/index.html'),
    pathname: path.join(__dirname, '../test-dss-reactjs/dist/index.html'),
    protocol: 'file'
  });
  console.log(startUrl)

  // console.log("aaa");

  // win.loadFile(yogieDir);
  // win.loadURL(`file://${__dirname}/build/index.html`);

  // win.loadFile(dirReact);
  // win.loadURL('http://localhost:5173/halo');
  // win.loadURL('http://localhost:5173');
  win.loadURL(startUrl);

  // Open DevTools if in development mode
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);
// app.on('ready', createWindow)

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

ipcMain.on('login', (event, { username, password }) => {
  // Perform authentication logic here
  console.loog("username", username)
  console.loog("password", password)
  // if (username === 'admin' && password === 'password') {
  //   event.reply('login-success');
  // } else {
  //   event.reply('login-failure');
  // }
});

