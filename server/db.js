var nedb = require('nedb');
var _ = require('lodash');
var databaseInstance;

module.exports = function () {
  if (!databaseInstance) {
    databaseInstance = {
      unit: new nedb({filename: "db/unit.db", autoload: true}),
      category: new nedb({filename: "db/category.db", autoload: true}),
      area: new nedb({filename: "db/area.db", autoload: true}),
      product: new nedb({filename: "db/product.db", autoload: true}),
      table: new nedb({filename: "db/table.db", autoload: true}),
      order: new nedb({filename: "db/order.db", autoload: true}),
      productInOrder: new nedb({filename: "db/productInOrder.db", autoload: true}),
      productInInvoice: new nedb({filename: "db/pdocutInInvoice.db", autoload: true}),
      user: new nedb({filename: "db/user.db", autoload: true}),
      invoice: new nedb({filename: "db/invoice.db", autoload: true}),
      configuration: new nedb({filename: "db/configuration.db", autoload: true})
    };
    // , {adapter : 'websql'}
    //console.log(databaseInstance.unit.adapter);

    // Init configuration data
    databaseInstance.configuration.find({}, function (err, result) {
        if (result.length === 0) {
          var seedData = [
            {
              name: 'SETTING.PRINTER',
              value: 'POS58 10.0.0.6',
              field: 'printer'
            },
            {
              name: 'SETTING.SHOP.NAME',
              value: 'Tra Sua BiBi',
              field: 'shopName'
            },
            {
              name: 'SETTING.SHOP.ADDRESS',
              value: 'Tra Sua BiBi Address',
              field: 'shopAddress'
            },
            {
              name: 'SETTING.SHOP.PHONE',
              value: '112233',
              field: 'shopPhone'
            }
          ];
          databaseInstance.configuration.insert(seedData);
        }
      });

    // Init Administrator user
    databaseInstance.user.findOne({userName: 'Administrator'}, function (err, result) {
      if (!result) {
        databaseInstance.user.insert({
          userName: 'Administrator',
          password: '123456987@'
        });
      }
    });
  }
  return databaseInstance;
};
