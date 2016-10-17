var userService = require('./../services/user');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var moment = require('moment');
module.exports = {
  login: function (req, res) {
    var userName = req.body.userName;
    var password = req.body.password;
    userService.details(userName, password)
      .then(function (result) {
        if (!result) {
          res.status(400);
          res.send({
            success: false,
            error: 'Username or password incorrect'
          });
          return
        }
        var token,
          expires = moment().add('days', 7);
        try {
          // if user is found and password is right
          // create a token

          token = jwt.sign(result, 'SangDepTrai', {
            expiresIn: 86400 * 7 // expires in 24 hours * 7 (days)
          });
        }
        catch (e) {
          throw e;
        }

        delete result.password;

        res.send({
          success: true,
          access_token: token,
          expires: expires.toDate(),
          user: result
        });
      }, function (err) {
        res.status(400);
        res.send({
          success: false,
          error: err
        });
      });
  },
  userInfo: function(req, res){
    userService.details(req.decoded._id)
      .then(function (result) {
        if (!result) {
          res.status(400);
          res.send({
            success: false,
            error: 'Username or password incorrect'
          });
          return
        }
        var token,
          expires = moment().add('days', 7);
        try {
          // if user is found and password is right
          // create a token

          token = jwt.sign(result, 'SangDepTrai', {
            expiresIn: 86400 * 7 // expires in 24 hours * 7 (days)
          });
        }
        catch (e) {
          throw e;
        }

        delete result.password;

        res.send({
          success: true,
          access_token: token,
          expires: expires.toDate(),
          user: result
        });
      }, function (err) {
        res.status(400);
        res.send({
          success: false,
          error: err
        });
      });
  },
  authGuard: function (req, res, next) {

    // exclude login api for token checking
    if(req.originalUrl === '/api/login'){
      next();
      return;
    }

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.params.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, 'SangDepTrai', function (err, decoded) {
        if (err) {
          return res.status(401).send({success: false, message: 'Authentication token was expired or invalid!'});
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });

    } else {

      // if there is no token
      // return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  }
};
