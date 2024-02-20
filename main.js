const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const url = require('url');
const path = require('path');
const axios = require('axios');
const LoginService = require('./services/LoginService');
// const { ipcMain } = require('electron/main');

let win;


async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // enableRemoteModule: true,
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
    pathname: path.join(__dirname, 'app/index.html'),
    // pathname: path.join(__dirname, './app/build/index.html'),
    // pathname: path.join(__dirname, '../test-dss-reactjs/dist/index.html'),
    protocol: 'file'
  });
  // console.log(startUrl)

  // console.log("aaa");

  // win.loadFile(yogieDir);
  // win.loadURL(`file://${__dirname}/build/index.html`);

  // win.loadFile(dirReact);
  // win.loadURL('http://localhost:5173/halo');
  // win.loadURL('http://localhost:5173');
  win.loadURL(startUrl);

  // CANNOT !!!!
  // win.loadFile(startUrl);

  // Open DevTools if in development mode
  if (process.env.NODE_ENV === 'development') {
    // win.webContents.openDevTools();
    win.webContents.openDevTools({ mode: 'detach' });
  }
  // win.webContents.send( 'login:success', data );
  // return win;
}

app.whenReady().then(() => {
  // ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// app.whenReady().then(createWindow);
// app.on('ready', createWindow)
// app.on('ready', () => {
//   window = createWindow();
  
//   // Send a message to the window.
//   window.webContents.send('message:update', 'Doing work...');
// });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });
app.on('activate', function () {
  if (win === null) {
    createWindow();
  }
});

ipcMain.handle( 'login', async ( event, data ) => {
  // console.log( "elec", data )
  let payload = {'username': data.username,'password': data.password}
  let options = {'headers': { 'Content-Type': 'application/json'}}
  // const response = await LoginService.handleLogin(payload, options);
  let response = await LoginService.handleLogin(payload, options).then((result) => { return result; }).catch((error) => {return error});
  // console.log(response)
  return response
  // console.log(win)
  // send: (channel, data) => ipcRenderer.send(channel, data),
  // ipcMain.send('login:success', {data: 'awa'})
  // win.webContents.send('login:success', {data: response} );
});

// window.webContents.send('login:success', data );

// ipcMain.on('login', async (event, { username, password }) => {
//   // Perform authentication logic here
//   console.log("username", username)
//   console.log("password", password)

//   let payload = {'username': 'kminchelle','password': '0lelplR'}
//   let options = {'headers': { 'Content-Type': 'application/json'}}

//   const data = await LoginService.handleLogin(payload, options);
//   // console.log("data", data)
//   // win.webContents.send('login:success', { task: data });
//   event.reply("login:success",{ data: data });

//   // const url = 'https://jsonplaceholder.typicode.com/posts/1';
//   // if (username === 'admin' && password === 'password') {
//   //   event.reply('login-success');
//   // } else {
//   //   event.reply('login-failure');
//   // }
//   // axios.get(url)
//   // .then(response => {
//   //   // Handle successful response
//   //   console.log('Response data:', response.data);
//   // })
//   // .catch(error => {
//   //   // Handle error
//   //   console.error('Error:', error);
//   // });

// });
