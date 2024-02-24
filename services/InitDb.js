const Realm = require('realm');
const Products = require('../models/Products')
const Task = require('../models/Task')

const realmApp = new Realm.App({ id: 'thehello-mghcp' }); // create a new instance of the Realm.App
const credentials = Realm.Credentials.anonymous();

const initRealm = async () => {
  // const realmApp = new Realm.App({ id: 'thehello-mghcp' }); // create a new instance of the Realm.App

  // const credentials = Realm.Credentials.anonymous();
  try {
    // const user = await realmApp.logIn(credentials);

    // const DogSchema = {
    //   name: "Dog",
    //   primaryKey: "_id",
    //   properties: {
    //     _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
    //     name: "string",
    //     age: "int",
    //   },
    // }; 

    // console.log("Products", Products)
    // console.log("Task", Task)

    // Flexible Sync uses subscriptions and permissions to determine what data to sync with your App. 
    // You must have at least one subscription before 
    // you can read from or write to a realm with Flexible Sync enabled.
    // const config = {
    //   schema: [Task, Products],
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
    //   },      
    // }

    // open a synced realm
    // const realm = await Realm.open(config);    
    // console.log("realm", realm)


    // NEW
    // const realm = await Realm.open(config);
    // console.log("realm", realm)

    // const realmFileLocation = realm.path;
    // console.log(`Realm file is located at: ${realm.path}`);

    // const tasks = realm.objects(Task);
    // console.log("tasks", tasks)

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
};

const getRecords = async (schema, payload) => {
  try {
    console.log("payload", payload)
    // const realmApp = new Realm.App({ id: 'thehello-mghcp' });
    // const credentials = Realm.Credentials.anonymous();
    const user = await realmApp.logIn(credentials);

    const config = {
      schema: [Products],
      sync: {
        user: user,
        flexible: true,
        initialSubscriptions: {
          update: (subs, realm) => {
            subs.add(
              realm
                // Use the mapped name in Flexible Sync subscriptions.
                .objects(`Products`)
                // .filtered('name == "Dedo"')
            );
          },
        },
      },      
    }

    const realm = await Realm.open(config);

    // await realm.subscriptions.update((subs) => {
    //   const products = realm
    //     .objects('Products');
    //   // console.log("products inside subs", products)
    //   subs.add(products);
    // });

    // const products = realm.objects('Products');
    // console.log("products", products)

    realm.close();

    return products;
    // return [];
  } catch(err) {
    console.log("err", err)
  }
}

const addRecord = async (schema, payload) => {
  try {
    console.log("payload", payload)
    const realmApp = new Realm.App({ id: 'thehello-mghcp' });
    const credentials = Realm.Credentials.anonymous();
    const user = await realmApp.logIn(credentials);

    const config = {
      schema: [Products],
      sync: {
        user: user,
        flexible: true,
        // initialSubscriptions: {
        //   update: (subs, realm) => {
        //     subs.add(
        //       realm
        //         // Use the mapped name in Flexible Sync subscriptions.
        //         .objects(`Products`)
        //         // .filtered('name == "Dedo"')
        //     );
        //   },
        // },
      },      
    }

    const realm = await Realm.open(config);

    await realm.subscriptions.update((subs) => {
      const products = realm
        .objects('Products');
      console.log("products inside subs", products)
      subs.add(products);
    });

    let result = realm.write(() => {
      return realm.create(Products, {
        title: payload.title,
        price: Number(payload.price),
        stock: Number(payload.stock),
        detail_product: payload.detail,
        description: payload.description,
        // image: payload.image_product,
        image: 'aa',
        rating: 5
      });
    });  
    console.log("result", result)

    realm.close();
  } catch(err) {
    console.log("err", err)
  }
}

const updateRecord = async (schema, payload, id) => {

}

const deleteRecord = async (schema, payload, id) => {

}

const detailRecord = async (schema, payload, id) => {

}

module.exports = { initRealm, addRecord, updateRecord, deleteRecord, detailRecord, getRecords };
