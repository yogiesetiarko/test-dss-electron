const Realm = require('realm');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const config = require("dotenv");
config.config();

const url = require('url');
const path = require('path');
const axios = require('axios');
const LoginService = require('./services/LoginService');
const isPackaged = require('electron-is-packaged').isPackaged;
const Products = require('./models/Products')
let theapp = null;
let realm = null;
let currentUser = null;

function getCurrentUser() {
  return currentUser;
}

function makeRealm() {
  theapp = new Realm.App({ 
    // id: process.env.REALM_APP_ID, 
    id: "thehello-mghcp", 
    // baseFilePath: '/Users/yogiedigital/Downloads/dss' 
    // baseFilePath: '/Users/yogiedigital/Library/Application\ Support/test-dss-electron/main' 
    // baseFilePath: `${app.getPath('userData')}/main` 
    baseFilePath: `${app.getPath('userData')}` 
  });  
  return theapp;
}

async function loginAtlas() {
  const credentials = Realm.Credentials.anonymous();
  currentUser = await theapp.logIn(credentials);  
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
  return realm ? realm.objects(Products) : [];
}

function getProductById(id) {
  return realm ? realm.objectForPrimaryKey("Products", new Realm.BSON.ObjectID(id)) : [];
}

function addRecord(payload) {
  let result = realm.write(() => {
    return realm.create(Products, {
      title: payload.title,
      price: Number(payload.price),
      stock: Number(payload.stock),
      detail_product: payload.detail,
      description: payload.description,
      image: payload.image_product,
      rating: payload.rating
    });
  });  
  // console.log("result", result)  
  return result;
}

function updateRecord(id, payload) {
  realm.write(() => {
    let product = getProductById(id);

    product.title = payload.title
    product.price = Number(payload.price)
    product.stock = Number(payload.stock)
    product.detail_product = payload.detail
    product.description = payload.description
    product.image = payload.image_product
    product.rating = payload.rating

    product = null;
    return {a: "zz"};
  });
}

function deleteRecord(id) {
  realm.write(() => {
    let product = getProductById(id);
    realm.delete(product);

    // Discard the reference.
    product = null;
    return {a: "zz"};
  })
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
  
  // win.webContents.openDevTools();
  
  const startUrl = url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file'
  });

  if(isPackaged) {
    win.loadURL(startUrl);
  } else {
    // win.loadURL(startUrl);
    win.webContents.openDevTools({ mode: 'detach' });
    win.loadURL('http://localhost:5173/');
  }

  // Open DevTools if in development mode
  if (process.env.NODE_ENV === 'development') {

  }

}

app.whenReady().then( async () => {
  
  // Initialize Realm to connect DB
  makeRealm();
  loginAtlas();
  await openRealm();

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

// app.on('activate', function () {
//   if (win === null) {
//     createWindow();
//   }
// });

// ipcMain.handle('', async (event, data) => {

// });

// Handle login 
ipcMain.handle( 'login', async ( event, data ) => {
  let payload = {'username': data.username,'password': data.password}
  let options = {'headers': { 'Content-Type': 'application/json'}}
  let response = await LoginService.handleLogin(payload, options).then((result) => { return result; }).catch((error) => {return error});
  return response
});

// Handle create new product
ipcMain.handle('post:newProduct', (event, data) => {

  let result = addRecord(data.form)
  
  return {
    success: true,
    message: 'success',
  }
});

// Handle update product
ipcMain.handle('put:productById', (event, data) => {
  let result = updateRecord(data.id, data.form)
  
  return {
    success: true,
    message: 'success',
  }
});

// Handle delete product
ipcMain.handle('del:productById', (event, data) => {
  let result = deleteRecord(data.id)

  return {
    success: true,
    message: 'successa',
  }
})

// Handle get products
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

// Handle get product by id
ipcMain.handle('get:productById', async (event, data) => {
  // console.log("get:productById main.js")
  // console.log("get:productById data", data)

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

// Handle when login failed, it shows dialog from Electron
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
