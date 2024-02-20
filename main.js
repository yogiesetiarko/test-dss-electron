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
  
  win.webContents.openDevTools();
  
  const startUrl = url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    // pathname: path.join(__dirname, './app/build/index.html'),
    // pathname: path.join(__dirname, '../test-dss-reactjs/dist/index.html'),
    protocol: 'file'
  });

  win.loadURL(startUrl);

  // Open DevTools if in development mode
  if (process.env.NODE_ENV === 'development') {
    // win.webContents.openDevTools();
    win.webContents.openDevTools({ mode: 'detach' });
  }

}

app.whenReady().then(() => {
  // ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

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

ipcMain.handle('', async (event, data) => {

});

ipcMain.handle( 'login', async ( event, data ) => {
  let payload = {'username': data.username,'password': data.password}
  let options = {'headers': { 'Content-Type': 'application/json'}}
  let response = await LoginService.handleLogin(payload, options).then((result) => { return result; }).catch((error) => {return error});
  return response
});

ipcMain.handle('get:products', async (event, data) => {
  console.log("get:products main.js")
  return {
    success: true,
    message: 'success',
    data: [
      {
        title: "Sepatu",
        price: 55000,
        stock: 25
      },
      {
        title: "Baju",
        price: 45000,
        stock: 244
      },
      {
        title: "Topi",
        price: 25000,
        stock: 2578
      },
    ]
  }
});

ipcMain.on('login:failed', async (event, data) => {
  // Open a simple message box
  // dialog.showMessageBox({
  //   type: 'info',
  //   title: 'Information',
  //   message: 'This is an information message.',
  //   buttons: ['OK']
  // }).then((response) => {
  //   console.log('User clicked OK');
  // }).catch((err) => {
  //   console.error(err);
  // });  
  dialog.showErrorBox("Login Failed", data.message)
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
