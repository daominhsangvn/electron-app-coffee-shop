var configurationService = require('./../services/configuration');
var Configuration = require('./../models/configuration');
var _ = require('lodash');

module.exports = {
  get: function(req, res) {
    configurationService.list(1, 1000)
      .then(function(resp) {
        res.send({
          success: true,
          data: resp.result
        });
      });
  },
  put: function(req, res) {
    var promises = [];
    _.each(req.body, function(el) {
      promises.push(new Promise(function(r, e) {
        Configuration.findByIdAndUpdate(el._id, {$set: el}, function(err, doc) {
          if(err) {
            e(err);
          }
          else {
            r(doc);
          }
        });
      }));
    });

    Promise.all(promises).then(function() {
      res.send({
        success: true
      });
    });
  }
};
