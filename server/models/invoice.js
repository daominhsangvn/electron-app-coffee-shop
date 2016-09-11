// grab the things we need
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var _ = require('lodash');
var Order = require('./order');

// create a schema
var schema = new Schema({
  order: {type: mongoose.Schema.Types.ObjectId, ref: 'Order'},
  productsInInvoice: [{type: mongoose.Schema.Types.ObjectId, ref: 'ProductInInvoice'}],
  total: {type: Number, required: true},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

schema.pre('save', function(next) {
  // change the updated_at field to current date
  this.updated_at = new Date();
  var invoice = this;

  Order
    .findOne({_id: invoice.order})
    .populate('invoice')
    .exec(function(err, order){
      if(!err){
        order.invoice = invoice;
        order.save();
      }
    });

  next();
});

// the schema is useless so far
// we need to create a model using it
var Model = mongoose.model('Invoice', schema);

// make this available to our users in our Node applications
module.exports = Model;
