var Product = require('./../models/product');
var Promise = require('promise');
var _ = require('lodash');
module.exports = {
  list: function(page, per_page, filter, sort) {
    filter = filter || {};
    return new Promise(function(resolve, reject) {
      // Count all documents in the datastore
      var total = 0;
      Product.count({}, function(err, count) {
        total = count;
        //var filterObj = {};
        //if(filter && filter.length > 0) {
        //  filterObj = {
        //    name: {
        //      $regex: new RegExp(filter, 'gi')
        //    }
        //  };
        //}

        var queries = Product;

        queries = queries.find(filter);

        if(sort) {
          queries = queries.sort(sort)
        }

        queries
          .skip((page - 1) * per_page)
          .limit(per_page)
          .populate('category unit') // Include
          .exec(function(err, docs) {
            if(err) {
              reject(err);
            }
            else {
              resolve({
                page: page,
                per_page: per_page,
                total: total,
                count: docs.length,
                result: docs
              });
            }
          });
      });
    });
  },

  create: function(doc) {
    return new Promise(function(resolve, reject) {
      var newModel = new Product(doc);

      newModel.save(function(err, newDoc) {
        if(err) {
          reject(err);
        }
        else {
          resolve(newDoc);
        }
      });
    });
  },

  update: function(id, doc) {
    return new Promise(function(resolve, reject) {
      Product.findByIdAndUpdate(id, {$set: doc}, function(err) {
        if(err) {
          reject(err);
        }
        else {
          resolve(doc);
        }
      });
    });
  },

  delete: function(id) {
    return new Promise(function(resolve, reject) {
      Product.findByIdAndRemove(id, function(err, doc) {
        if(err) {
          reject(err);
        }
        else {
          doc.remove();
          resolve();
        }
      });
    });
  },

  details: function(id) {
    return new Promise(function(resolve, reject) {
      Product
        .findOne({_id: id})
        .populate('category unit productsInOrder') // Include
        .exec(function(err, doc) {
          if(err) {
            reject(err);
          }
          else {
            resolve(doc);
          }
        });
    });
  },

  isDeletable(productId){
    return new Promise(function(resolve, reject) {
      Product
        .findOne({_id: productId})
        .populate('category unit productsInOrder') // Include
        .exec(function(err, doc) {
          if(err) {
            reject(err);
          }
          else {
            if(doc.productInOrders.length) {
              reject('This product can not remove because it\'s being used by orders');
            } else {
              resolve();
            }
          }
        });
    });
  }
};
