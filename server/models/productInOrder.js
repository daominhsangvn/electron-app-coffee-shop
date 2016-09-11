// grab the things we need
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var _ = require('lodash');
var Product = require('./product');
var Order = require('./order');

// create a schema
var schema = new Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
  price: {type: Number, required: true},
  order: {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
  quantity: {type: Number, required: true},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

schema.pre('save', function(next) {
  var productInOrder = this;

  // change the updated_at field to current date
  this.updated_at = new Date();

  Product.findOne({_id: productInOrder.product})
    .populate({
      path: 'productsInOrder',
      populate: { path: 'product order' }
    })
    .exec(function(err, product) {
      // Prevent duplicate
      if(!err && !_.find(product.productsInOrder, {'order._id': productInOrder.order})) {
        product.productsInOrder.push(productInOrder);
        product.save();
      }
    });

  Order.findOne({_id: productInOrder.order})
    .populate({
      path: 'productsInOrder',
      populate: { path: 'product order' }
    })
    .exec(function(err, order) {
      // Prevent duplicate
      if(!err && !_.find(order.productsInOrder, {'product._id': productInOrder.product})) {
        order.productsInOrder.push(productInOrder);
        order.save();
      }
    });

  next();
});

// the schema is useless so far
// we need to create a model using it
var Model = mongoose.model('ProductInOrder', schema);

// make this available to our users in our Node applications
module.exports = Model;
