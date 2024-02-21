const Realm = require('realm');
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

  initRealm();

}

async function initRealm() {
  const realmApp = new Realm.App({ id: 'thehello-mghcp' }); // create a new instance of the Realm.App

  const credentials = Realm.Credentials.anonymous();
  try {
    const user = await realmApp.logIn(credentials);
    // console.log("user", user)
    // const DogSchema = {
    //   name: "Dog",
    //   primaryKey: "_id",
    //   properties: {
    //     _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
    //     name: "string",
    //     age: "int",
    //   },
    // }; 
  
    class Task extends Realm.Object {
      static schema = {

        // name: 'Dog',
        // properties: {
        //   _id: 'objectId',
        //   age: 'int?',
        //   name: 'string?',
        // },
        // primaryKey: '_id',

        // name: "Dog",
        // primaryKey: "_id",
        // properties: {
        //   _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
        //   name: "string",
        //   age: "int",
        // },

        // name: "Dog",
        // primaryKey: '_id',
        // properties: {
        //     _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
        //     name: "string",
        //     age: "int",
        //     breed: "string?"
        // },

        name: "Task",
        properties: {
          _id: "int",
          name: "string",
          status: "string?",
          owner_id: "string?",
        },
        primaryKey: "_id",        

      };
    }

    // Flexible Sync uses subscriptions and permissions to determine what data to sync with your App. 
    // You must have at least one subscription before 
    // you can read from or write to a realm with Flexible Sync enabled.
    const config = {
      schema: [Task],
      sync: {
        user: user,
        flexible: true,
        initialSubscriptions: {
          update: (subs, realm) => {
            subs.add(
              realm
                // Use the mapped name in Flexible Sync subscriptions.
                .objects(`Task`)
                // .filtered('name == "Dedo"')
            );
          },
        },
      },      
    }

    // open a synced realm
    // const realm = await Realm.open(config);    
    // console.log("realm", realm)


    // NEW
    const realm = await Realm.open(config);
    // console.log("realm", realm)

    const realmFileLocation = realm.path;
    console.log(`Realm file is located at: ${realm.path}`);

    const tasks = realm.objects(Task);
    console.log("tasks", tasks)

    // // ====== add
    // // await realm.subscriptions.update((subs) => {
    // //   const tasks = realm
    // //     .objects('Task');
    // //   console.log("tasks inside subs", tasks)
    // //   subs.add(tasks);
    // // });

    // realm.write(() => {
    //   realm.create(Task, {
    //     _id: 4,
    //     name: "Kino Shops",
    //     status: "Open",
    //   });
    // });
    // // console.log("res", res)

    // // ===========

    // // ====== edit no need subs first
    // // await realm.subscriptions.update((subs) => {
    // //   const tasks = realm
    // //     .objects('Task')
    // //     .filtered('name == "go grocery shopping"');
    // //   console.log("tasks inside subs", tasks)
    // //   subs.add(tasks);      

    // //   // // update dog's age
    // //   // realm.write(() => {
    // //   //   tasks.status = 'closed';
    // //   // });

    // // });
    // // console.log("edit tasks", tasks)

    // // update dog's age
    // realm.write(() => {
    //   const task = realm.objects(Task)[0];
    //   console.log("task inside edit write", task)
    //   task.status = 'Ahooy';
    // });

    // // ===========

    // // // delete =============
    // // const task = realm.objects("Task").filtered("_id == 2");
    // // console.log("task", task)
    // realm.write(() => {
    //   // Find dogs younger than 2 years old.
    //   let task = realm.objects("Task").filtered("_id == 2");
    //   console.log("task", task)
    //   // Delete the collection from the realm.
    //   realm.delete(task);
    //   // Discard the reference.
    //   task = null;
    // });    
    // // ====================

    // // READ ================
    // const myTask = realm.objectForPrimaryKey("Task", 3);
    // console.log("myTask", myTask)
    // // =====================

    // const task1 = tasks.find((task) => task._id == 1);
    // console.log("task1", task1)

    // realm.close();

    // const subs = realm.subscriptions;
    // subs.update((mutableSubs) => {
    //     sub = mutableSubs.add(realm.objects("Dog").filtered("age > 5"));
    // });
    // await realm.subscriptions.waitForSynchronization();

    // Realm Writes are transactional and Sync automatically
    // let res = realm.write(() => {
    //     realm.create(DogSchema, {
    //         name: "Princess Gracie",
    //         age: 6,
    //         breed: "aaa"
    //     });
    // });
    // console.log("res", res)

    // // Data Synced onto a device can be queried locally
    // const allDogs = realm.objects("Dog");
    // const olderDogs = alLDogs.filtered("age < 5");

    // =======


    // console.log(realm.create({name: "Clifford", age: 12}))

    // const dog = realm.write(() => {
    //   // Use the mapped name when performing CRUD operations.
    //   return realm.create(`Dog`, {
    //     _id: new Realm.BSON.ObjectId(),
    //     name: "Sandro", 
    //     age: 12
    //   });
    // });

    // // console.log("dog", dog);

    // const assignedDog = realm.objects(`Dog`);
    // console.log(`${assignedDog}`);

    // // create new dog
    // const dog = realm.write(() => {
    //   // console.log(realm.create(DogSchema, {name: "Clifford", age: 12}))
    //   return realm.create(DogSchema, {name: "Sandro", age: 12});
    //   // return realm.create("Dog", {name: "Clifford", age: 12});
    // });     
    

    // // update dog's age
    // realm.write(() => {
    //   dog.age = 13;
    // });

    // // delete dog
    // realm.write(() => {
    //   realm.delete(dog);
    // });

    // // get all dogs
    // const dogs = realm.objects(DogSchema);
    // const dogs = realm.objects('Dog');
    // console.log(`Main: Number of Dog objects: ${dogs.length}`);

    // realm.write(() => {
    //   realm.deleteAll();
    // })

    // realm.close();

  } catch(err) {
    // console.error("Failed to log in", err);
    console.error("err", err);
  } 
}

app.whenReady().then( async () => {

  // realm.write(() => {
  //   realm.create('Dog', {
  //     _id: 2,
  //     name: 'Fido',
  //     age: 5,
  //   });
  // });

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
