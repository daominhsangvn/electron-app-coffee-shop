var Table = require('./../models/table');
var Promise = require('promise');
var _ = require('lodash');
module.exports = {
  list: function(page, per_page, filter, sort) {
    filter = filter || {};
    return new Promise(function(resolve, reject) {
      // Count all documents in the datastore
      var total = 0;
      Table.count({}, function(err, count) {
        total = count;
        //var filterObj = {};
        //if(filter && filter.length > 0) {
        //  filterObj = {
        //    name: {
        //      $regex: new RegExp(filter, 'gi')
        //    }
        //  };
        //}

        var queries = Table;

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

      var newModel = new Table(doc);

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
      Table.findByIdAndUpdate(id, {$set: doc}, function(err) {
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
      Table.findByIdAndRemove(id, function(err, doc) {
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
      Table.findOne({_id: id}, function(err, doc) {
        if(err) {
          reject(err);
        }
        else {
          resolve(doc);
        }
      });
    });
  },

  isDeletable(tableId){
    return new Promise(function(resolve, reject) {
      Table.findOne({_id: tableId}, function(err, doc) {
        if(err) {
          reject(err);
        }
        else {
          if(doc.orders.length) {
            reject('This table can not remove because it\'s being used by orders');
          } else {
            resolve();
          }
        }
      });
    });
  }
};
