// grab the things we need
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

// create a schema
var schema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true},
  field: {type: String, required: true, unique: true},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

schema.pre('save', function(next) {
  // change the updated_at field to current date
  this.updated_at = new Date();
  next();
});

// the schema is useless so far
// we need to create a model using it
var Model = mongoose.model('Configuration', schema);

// make this available to our users in our Node applications
module.exports = Model;
