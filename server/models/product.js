// grab the things we need
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var _ = require('lodash');
var Category = require('./category');
var Unit = require('./unit');

// create a schema
var schema = new Schema({
  name: {type: String, required: true, unique: true},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
  unit: {type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true},
  productsInOrder: [{type: mongoose.Schema.Types.ObjectId, ref: 'ProductInOrder'}],
  productsInInvoice: [{type: mongoose.Schema.Types.ObjectId, ref: 'ProductInInvoice'}],
  price: {type: Number, required: true},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

schema.pre('save', function(next) {
  var product = this;
  // change the updated_at field to current date
  this.updated_at = new Date();

  Category.findOne({_id: product.category})
    .populate('products')
    .exec(function(err, category) {
      // Prevent duplicate
      if(!err && !_.find(category.products, {id: product.id})) {
        category.products.push(product);
        category.save();
      }
    });

  Unit.findOne({_id: product.unit})
    .populate('products')
    .exec(function(err, unit) {
      // Prevent duplicate
      if(!err && !_.find(unit.products, {id: product.id})) {
        unit.products.push(product);
        unit.save();
      }
    });

  next();
});

// the schema is useless so far
// we need to create a model using it
var Model = mongoose.model('Product', schema);

// make this available to our users in our Node applications
module.exports = Model;
