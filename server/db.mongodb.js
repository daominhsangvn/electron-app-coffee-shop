// Retrieve
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Configuration = require('./models/configuration');
var Promise = require('promise');

module.exports = function(done) {
  mongoose.connect('mongodb://localhost:27017/coffee');
  //attach lister to connected event
  mongoose.connection.once('connected', function() {
    console.log("Connected to database");
    Configuration.find({}).exec(function(err, docs) {
      if(!err && docs.length === 0) {
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
        Configuration.collection.insert(seedData, function(errs, docs) {
          done();
          if(errs) {
            console.info('Error on configuration seeding', errs);
          }
          console.info('%d potatoes were successfully stored.', docs.length);
        });
      } else {
        done();
      }
    });
  });
};
