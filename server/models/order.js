// grab the things we need
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var _ = require('lodash');
var Area = require('./area');
var Table = require('./table');

// create a schema
var schema = new Schema({
  productsInOrder: [{type: mongoose.Schema.Types.ObjectId, ref: 'ProductInOrder'}],
  table: {type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true},
  area: {type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true},
  invoice: {type: mongoose.Schema.Types.ObjectId, ref: 'Invoice'},
  total: {type: Number, required: true},
  status: {type: String, required: true},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

schema.pre('save', function(next) {
  // change the updated_at field to current date
  this.updated_at = new Date();
  var order = this;
  Area.findOne({_id: order.area})
    .populate('orders')
    .exec(function(err, area) {
      if(!err && !_.find(area.orders, {id: order.id})) {
        area.orders.push(order);
        area.save();
      }
    });

  Table.findOne({_id: order.table})
    .populate('orders')
    .exec(function(err, table) {
      if(!err && !_.find(table.orders, {id: order.id})) {
        table.orders.push(order);
        table.save();
      }
    });

  next();
});

schema.post('remove', function(order) {
  // Update Order to Area
  //Area.findOne({_id: order.area})
  //  .populate('orders')
  //  .exec(function(err, area) {
  //    if(!err) {
  //      _.remove(area.orders, {id: order.id});
  //      area.save();
  //    }
  //  });
});

// the schema is useless so far
// we need to create a model using it
var Model = mongoose.model('Order', schema);

// make this available to our users in our Node applications
module.exports = Model;
