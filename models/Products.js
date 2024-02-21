const Realm = require('realm');

class Products extends Realm.Object {
  static schema = {
    name: "Products",
    properties: {
      // _id: "int",
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      detail_product: 'string',
      image: 'string',
      title: 'string',
      price: 'double',
      stock: 'int',
      description: 'string',
      rating: 'double'
    },
    primaryKey: "_id",
  }
}

module.exports = Products;