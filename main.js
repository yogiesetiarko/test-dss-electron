const Realm = require('realm');
// const bson = require('bs');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const url = require('url');
const path = require('path');
const axios = require('axios');
const LoginService = require('./services/LoginService');
const InitDb = require('./services/InitDb');
// const isDev = require('electron-is-dev');
const isPackaged = require('electron-is-packaged').isPackaged;
const Products = require('./models/Products')
let theapp = null;
let realm = null;
let currentUser = null;

// const realmapp = new Realm.App({ id: "thehello-mghcp" });

function getCurrentUser() {
  return currentUser;
}

function makeRealm() {
  theapp = new Realm.App({ id: "thehello-mghcp" });  
  return theapp;
}



async function loginAtlas() {
  // console.log("theapp",theapp)
  const credentials = Realm.Credentials.anonymous();
  currentUser = await theapp.logIn(credentials);  
  // console.log("currentUser", currentUser)
  return true;
}

async function openRealm() {
  // const nowUser = getCurrentUser();
  const credentials = Realm.Credentials.anonymous();
  const nowUser = await theapp.logIn(credentials);  
  
  // console.log("nowUser", nowUser)
  const config = {
    schema: [Products],
    sync: {
      user: nowUser,
      flexible: true,
      // initialSubscriptions: {
      //   update: (subs, realm) => {
      //     subs.add(
      //       realm
      //         // Use the mapped name in Flexible Sync subscriptions.
      //         .objects(`Products`)
      //         // .filtered('name == "Dedo"')
      //     );
      //     // console.log(">>>", realm.objects('Products'))
      //   },
      // },
      // initialSubscriptions: {
      //   update: (mutableSubs, realm) => {
      //     // Subscribe to the store with the given ID.
      //     mutableSubs.add(
      //       realm.objects(Store).filtered("_id = $0", SYNC_STORE_ID),
      //       { name: "storeA" },
      //     );
      //     // Subscribe to all kiosks in the store with the given ID.
      //     mutableSubs.add(
      //       realm.objects(Kiosk).filtered("storeId = $0", SYNC_STORE_ID),
      //       { name: "kiosksInStoreA" },
      //     );
      //     // Subscribe to all products in the store with the given ID.
      //     mutableSubs.add(
      //       realm.objects(Product).filtered("storeId = $0", SYNC_STORE_ID),
      //       { name: "productsInStoreA" },
      //     );
      //   },
      // },
    },      
    // path: '../'
  }
  realm = await Realm.open(config);
  await realm.subscriptions.update((subs) => {
    const products = realm
      .objects(Products);
    // console.log("products inside subs", products)
    subs.add(products);
  });
  // console.log(">>>", realm)
  return realm;
}

function getProducts() {
  // return realm ? realm.objects(Products).filtered('title == "Handuk"') : [];
  return realm ? realm.objects(Products) : [];
}

function getProductById(id) {
  // Electron.ObjectId(id)
  // console.log(Electron.ObjectId(id))
  // realm.objectForPrimaryKey("Products", id);
  // return realm ? realm.objects(Products).filtered("_id == $0", ObjectId(id)) : [];
  return realm ? realm.objectForPrimaryKey("Products", new Realm.BSON.ObjectID(id)) : [];
}

let win;

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 1000,
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

  // console.log("process.env.NODE_ENV", process.env.NODE_ENV)
  console.log("isPackaged", isPackaged)

  // win.loadURL(startUrl);
  win.loadURL('http://localhost:5173/');

  // Open DevTools if in development mode
  if (process.env.NODE_ENV === 'development') {
    // win.webContents.openDevTools();
    win.webContents.openDevTools({ mode: 'detach' });
  }

  // initRealm();
  // InitDb.initRealm();
  // win.webContents.send('pushDetails', {'name': 'halo'});
  // run();


}

app.whenReady().then( async () => {

  // realm.write(() => {
  //   realm.create('Dog', {
  //     _id: 2,
  //     name: 'Fido',
  //     age: 5,
  //   });
  // });

  makeRealm();
  loginAtlas();
  await openRealm();
  // const products = getProducts();
  // const products = realm.objects('Products');
  // console.log("products", products)
  // const products = realm.objects('Products');

  // ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

});

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

// ipcMain.handle('', async (event, data) => {

// });

ipcMain.handle( 'login', async ( event, data ) => {
  let payload = {'username': data.username,'password': data.password}
  let options = {'headers': { 'Content-Type': 'application/json'}}
  let response = await LoginService.handleLogin(payload, options).then((result) => { return result; }).catch((error) => {return error});
  return response
});

ipcMain.handle('post:newProduct', async (event, data) => {
  // console.log("data", data)
  // data.form
  await InitDb.addRecord('Products', data.form)
  // for (const value of data.form.values()) {
  //   console.log(value);
  // }
  return {
    success: true,
    message: 'successa',
  }
});

ipcMain.handle('get:products', async (event, data) => { 
  // const realmApp = new Realm.App({ 
  //   id: 'thehello-mghcp', 
  //   // baseFilePath: '../' 
  // }); // create a new instance of the Realm.App
  // const credentials = Realm.Credentials.anonymous();
  // const user = await realmApp.logIn(credentials);

  // const config = {
  //   schema: [Products],
  //   sync: {
  //     user: user,
  //     flexible: true,
  //     initialSubscriptions: {
  //       update: (subs, realm) => {
  //         subs.add(
  //           realm
  //             // Use the mapped name in Flexible Sync subscriptions.
  //             .objects(`Products`)
  //             // .filtered('name == "Dedo"')
  //         );
  //       },
  //     },
  //     // rerunOnOpen: true,
  //   },      
  //   // path: '../'
  // }

  // const realm = await Realm.open(config);
  // const products = realm.objects('Products');

  let products = getProducts();
  // console.log('products.length', products.length)
  // console.log('products', products)

  // if error => An object could not be cloned must do set itemone by one using forEach / map
  // second solution, use the serialize, so the array / object become string
  let newArr = [];
  products.forEach(element => {
    const item = {
      _id: element._id.toString(),
      title: element.title,
      stock: element.stock,
      price: element.price,
      detail_product: element.detail_product,
      image: element.image,
      description: element.description,
      rating: element.rating
    }
    newArr.push(item)
  });
  // console.log('newArr', newArr)
  
  return {data: newArr}
  // return products
});

ipcMain.handle('get:productById', async (event, data) => {
  console.log("get:productById main.js")
  console.log("get:productById data", data)

  // const realmApp = new Realm.App({ id: 'thehello-mghcp' }); // create a new instance of the Realm.App
  // const credentials = Realm.Credentials.anonymous();
  // const user = await realmApp.logIn(credentials);

  let product = getProductById(data.id);
  // console.log("product", product)
  const resultData = {
    _id: product._id.toString(),
    detail_product: product.detail_product,
    image: product.image,
    title: product.title,
    price: product.price,
    stock: product.stock,
    description: product.description,
    rating: product.rating
  }

  return {
    success: true,
    message: 'successa',
    // data: {
    //   title: "Sepatu",
    //   price: 55000,
    //   stock: 25,
    //   detail: "ala ala ala",      
    //   description: "ala ala ala description",
    // }
    data: resultData
  }
});

// ipcMain.handle('get:products', (event, data) => {
//   // console.log("get:products main.js")
//   // let result = InitDb.getRecords('Products', {'aha':'halo'});
//   // console.log("result", result)

//   const realmApp = new Realm.App({ id: 'thehello-mghcp' }); // create a new instance of the Realm.App
//   const credentials = Realm.Credentials.anonymous();
//   const user = realmApp.logIn(credentials);
//   // const config = {
//   //   schema: [Products],
//   //   sync: {
//   //     user: user,
//   //     flexible: true,
//   //     initialSubscriptions: {
//   //       update: (subs, realm) => {
//   //         subs.add(
//   //           realm
//   //             // Use the mapped name in Flexible Sync subscriptions.
//   //             .objects(`Products`)
//   //             // .filtered('name == "Dedo"')
//   //         );
//   //       },
//   //     },
//   //   },      
//   // }

//   // const realm = Realm.open(config);
//   // const products = realm.objects('Products');
//   // console.log("products", products)  

//   return {
//     success: true,
//     message: 'success',
//     data: []
//   }
// });

// ipcMain.handle('get:products', async (event, data) => { 
//   // return InitDb.getRecords('Products', data); 
//   return await InitDb.getRecords('Products', data).then(() => { return result; })
// });

// ipcMain.handle('get:products', async (event, data) => { 
//   // return InitDb.getRecords('Products', data); 
//   // return await InitDb.getRecords('Products', data).then(() => { return result; })
//   return []
// });

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
