var dbContext = require('./../db')();
var _ = require('lodash');
var Promise = require('promise');
var crypto = require('crypto');
var db = dbContext.user;
module.exports = {
  list: function(page, per_page, filter, sort) {
    filter = filter || {};
    return new Promise(function(resolve, reject) {
      // Count all documents in the datastore
      var total = 0;
      db.count({}, function(err, count) {
        total = count;

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

  update: function(id, doc) {
    return new Promise(function(resolve, reject) {
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

  delete: function(id) {
    return new Promise(function(resolve, reject) {
      db.remove({_id: id}, {}, function(err, doc) {
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

  findByUserName: function(userName){
    return new Promise(function(resolve, reject) {
      db.findOne({userName: userName}, function(err, doc) {
        if(err) {
          reject(err);
        }
        else {
          resolve(doc);
        }
      });
    });
  },

  findByUserNameAndPassword: function(userName, password){
    /**
     * hash password with sha512.
     * @function
     * @param {string} password - List of required fields.
     * @param {string} salt - Data to be validated.
     */
    var sha512 = function (password, salt) {
      var hash = crypto.createHmac('sha512', salt);
      /** Hashing algorithm sha512 */
      hash.update(password);
      var value = hash.digest('hex');
      return {
        salt: salt,
        passwordHash: value
      };
    };

    function saltHashPassword(userpassword) {
      var salt = 'SangDepTrai';
      /** Gives us salt of length 16 */
      var passwordData = sha512(userpassword, salt);
      return passwordData.passwordHash;
      // console.log('UserPassword = ' + userpassword);
      // console.log('Passwordhash = ' + passwordData.passwordHash);
      // console.log('\nSalt = ' + passwordData.salt);
    }

    return new Promise(function(resolve, reject) {
      db.findOne({userName: userName, password: saltHashPassword(password)}, function(err, doc) {
        if(err) {
          reject(err);
        }
        else {
          resolve(doc);
        }
      });
    });
  }
};
