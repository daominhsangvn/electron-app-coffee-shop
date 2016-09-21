// grab the things we need
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var _ = require('lodash');
var Product = require('./product');
var Invoice = require('./invoice');

// create a schema
var schema = new Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
  price: {type: Number, required: true},
  invoice: {type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true},
  quantity: {type: Number, required: true},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

schema.pre('save', function(next) {
  var productInInvoice = this;

  // change the updated_at field to current date
  this.updated_at = new Date();

  Product.findOne({_id: productInInvoice.product})
    .populate({
      path: 'productsInInvoice',
      populate: { path: 'product invoice' }
    })
    .exec(function(err, product) {
      // Prevent duplicate
      if(!err && !_.find(product.productsInInvoice, {'invoice._id': productInInvoice.invoice})) {
        product.productsInInvoice.push(productInInvoice);
        product.save();
      }
    });

  Invoice.findOne({_id: productInInvoice.invoice})
    .populate({
      path: 'productsInInvoice',
      populate: { path: 'product invoice' }
    })
    .exec(function(err, invoice) {
      // Prevent duplicate
      if(!err && !_.find(invoice.productsInInvoice, {'product._id': productInInvoice.product})) {
        invoice.productsInInvoice.push(productInInvoice);
        invoice.save();
      }
    });

  next();
});

// the schema is useless so far
// we need to create a model using it
var Model = mongoose.model('ProductInInvoice', schema);

// make this available to our users in our Node applications
module.exports = Model;
