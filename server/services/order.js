var dbContext = require('./../db')();
var _ = require('lodash');
var Promise = require('promise');
var db = dbContext.product;
var dbPio = dbContext.productInOrder;
module.exports = {
  list: function (page, per_page, filter, sort) {
    filter = filter || {};
    return new Promise(function (resolve, reject) {
      // Count all documents in the datastore
      var total = 0;
      db.count({}, function (err, count) {
        total = count;
        //var filterObj = {};
        //if(filter && filter.length > 0) {
        //  filterObj = {
        //    name: {
        //      $regex: new RegExp(filter, 'gi')
        //    }
        //  };
        //}

        var queries = db;

        if (!_.isEmpty(filter)) {
          queries = queries.where('name', new RegExp(filter, 'gi'));
        } else {
          queries = queries.find({});
        }

        if (sort) {
          queries = queries.sort(sort)
        }

        queries
          .skip((page - 1) * per_page)
          .limit(per_page)
          .populate({
            path: 'table area productsInOrder invoice',
            populate: {path: 'product'}
          })
          .exec(function (err, docs) {
            if (err) {
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

  create: function (doc) {
    return new Promise(function (resolve, reject) {
      var products = doc.products;
      delete doc.products;
      // Create Order
      db.save(doc, function (err, newOrder) {
        if (err) {
          reject(err);
        }
        else {
          // Create product in order
          dbPio.insert(_.map(products, function(p){
            return {
              product: p.productId,
              price: p.price,
              order: newOrder.id,
              quantity: p.qty
            }
          }), function (err, result) {
            if (err) {
              reject(err);
            }
            else {
              resolve(newOrder);
            }
          });
        }
      });
    });
  },

  update: function (id, doc) {
    return new Promise(function (resolve, reject) {
      db.update({_id: id}, {$set: doc}, function (err) {
        if (err) {
          reject(err);
        }
        else {
          resolve(doc);
        }
      });
    });
  },

  delete: function (id) {
    return new Promise(function (resolve, reject) {
      db.remove({_id: id}, function (err, doc) {
        if (err) {
          reject(err);
        }
        else {
          doc.remove();
          resolve();
        }
      });
    });
  },

  details: function (id) {
    return new Promise(function (done, fail) {
      Order
        .findOne({_id: id})
        .populate({
          path: 'table area productsInOrder',
          populate: {path: 'product'}
        })
        .exec(function (err, doc) {
          if (err) {
            fail(err);
          }
          else {
            done(doc);
          }
        });
    });
  },

  isDeletable(orderId){
    return new Promise(function (resolve, reject) {
      db.findOne({_id: orderId}, function (err, doc) {
        if (err) {
          reject('Error');
        }
        else {
          if (doc.invoice) {
            reject('This order can not remove because it\'s being used by invoice');
          } else {
            resolve();
          }
        }
      });
    });
  }
};
