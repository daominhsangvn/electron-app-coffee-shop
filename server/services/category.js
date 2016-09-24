var dbContext = require('./../db')();
var _ = require('lodash');
var Promise = require('promise');
var db = dbContext.category;
module.exports = {
  list: function (page, per_page, filter, sort){
    filter = filter || {};
    return new Promise(function (resolve, reject){
      // Count all documents in the datastore
      var total = 0;
      db.count({}, function (err, count){
        total = count;
        //var filterObj = {};
        //if (filter && filter.length > 0) {
        //  filterObj = {
        //    name: {
        //      $regex: new RegExp(filter,'gi')
        //    }
        //  };
        //}

        var queries = db;

        if(!_.isEmpty(filter)) {
          queries = queries.where('name', new RegExp(filter, 'gi'));
        } else {
          queries = queries.find({});
        }

        if(sort) {
          queries = queries.sort(sort)
        }

        queries
          .skip((page - 1) * per_page)
          .limit(per_page)
          //.populate('products')
          .exec(function (err, docs){
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

  create: function (doc){
    return new Promise(function (resolve, reject){
      db.insert(doc, function(err, newDoc) {
        if(err) {
          reject(err);
        }
        else {
          resolve(newDoc);
        }
      });
    });
  },

  update: function (id, doc){
    return new Promise(function (resolve, reject){
      db.update({_id: id}, {$set: doc}, function(err) {
        if(err) {
          reject(err);
        }
        else {
          resolve(doc);
        }
      });
    });
  },

  delete: function (id){
    return new Promise(function (resolve, reject){
      db.remove({_id: id}, function(err, doc) {
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

  details: function (id){
    return new Promise(function (resolve, reject){
      db.findOne({_id: id}, function(err, doc) {
        if(err) {
          reject(err);
        }
        else {
          resolve(doc);
        }
      });
    });
  },

  isDeletable(categoryId){
    return new Promise(function (resolve, reject){
      db.findOne({_id: categoryId}, function(err, doc) {
        if(err) {
          reject(err);
        }
        else {
          if(doc.products.length) {
            reject('This category can not remove because it\'s being used by products');
          } else {
            resolve();
          }
        }
      });
    });
  }
};
