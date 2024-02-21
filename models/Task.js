const Realm = require('realm');

class Task extends Realm.Object {
  static schema = {
    name: "Task",
    properties: {
      // _id: "int",
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      name: "string",
      status: "string?",
      owner_id: "string?",
    },
    primaryKey: "_id",
  }
}

module.exports = Task;