var userService = require('./../services/user');
module.exports = {
  userInfo: function(req, res){
    userService.details(req.decoded._id)
      .then(function (result) {
        res.send({
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          id: result._id
        });
      }, function (err) {
        res.status(400);
        res.send({
          success: false,
          error: err
        });
      });
  }
};
