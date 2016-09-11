var Area = require('./../models/area');
var Promise = require('promise');
var _ = require('lodash');
module.exports = {
  list: function(page, per_page, filter, sort) {
    filter = filter || {};
    return new Promise(function(resolve, reject) {
      // Count all documents in the datastore
      var total = 0;
      Area.count({}, function(err, count) {
        total = count;
        //var filterObj = {};
        //if(filter && filter.length > 0) {
        //  filterObj = {
        //    name: {
        //      $regex: new RegExp(filter, 'gi')
        //    }
        //  };
        //}

        var queries = Area;

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
          //.populate('orders')
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

      var newModel = new Area(doc);

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
      Area.findByIdAndUpdate(id, {$set: doc}, function(err) {
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
      Area.findByIdAndRemove(id, function(err, doc) {
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
      Area.findOne({_id: id}, function(err, doc) {
        if(err) {
          reject(err);
        }
        else {
          resolve(doc);
        }
      });
    });
  },

  isDeletable(areaId){
    return new Promise(function(resolve, reject) {
      Area.findOne({_id: areaId}, function(err, doc) {
        if(err) {
          reject(err);
        }
        else {
          if(doc.orders.length) {
            reject('This area can not remove because it\'s being used by orders');
          } else {
            resolve();
          }
        }
      });
    });
  }
};
