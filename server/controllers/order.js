var orderService = require('./../services/order');
var _ = require('lodash');
module.exports = {
  list: function (req, res){
    var page = req.body.page;
    var per_page = req.body.per_page;
    var filter = req.body.filter;
    var sort = req.body.sort;
    orderService.list(page, per_page, filter, sort)
      .then(function (result){
        res.send({
          success: true,
          data: result
        });
      }, function (err){
        res.status(400);
        res.send({
          success: false,
          error: err
        });
      });
  },

  create: function (req, res){
    var doc = req.body;
    orderService.create(doc)
      .then(function (newDoc){
        res.send({
          success: true,
          data: newDoc
        });
      }, function (err){
        res.status(400);
        res.send({
          success: false,
          error: err
        });
      });
  },

  update: function (req, res){
    var doc = req.body;
    var id = req.params.id;
    orderService.update(id, doc)
      .then(function (newDoc){
        res.send({
          success: true,
          data: newDoc
        });
      }, function (err){
        res.status(400);
        res.send({
          success: false,
          error: err
        });
      });
  },

  delete: function (req, res){
    var id = req.params.id;
    orderService.isDeletable(id, function (){
      orderService.delete(id)
        .then(function (){
          res.send({
            success: true
          });
        }, function (err){
          res.status(400);
          res.send({
            success: false,
            error: err
          });
        });
    }, function (){
      res.status(400);
      res.send({
        success: false,
        error: 'Cannot delete order ' + id + ' because it is being used'
      });
    });
  },

  deleteMany: function (req, res){
    var ids = req.body.ids, idx = 0;

    function deleteItem(idx){
      orderService.isDeletable(ids[idx]).then(function (){
        orderService.delete(ids[idx])
          .then(function (){
            idx++;
            if (idx === ids.length) {
              res.send({
                success: true
              });
            } else {
              deleteItem(idx);
            }
          }, function (err){
            res.status(400);
            res.send({
              success: false,
              error: err
            });
          });
      }, function (err){
        res.status(400);
        res.send({
          success: false,
          error: _.isObject(err) ? 'Order ' + err._id + ' cannot delete because it is being used' : err
        });
      });
    }

    deleteItem(idx);
  },

  details: function (req, res){
    var id = req.params.id;
    orderService.details(id)
      .then(function (doc){
        res.send({
          success: true,
          data: doc
        });
      }, function (err){
        res.status(400);
        res.send({
          success: false,
          error: err
        });
      });
  }
};