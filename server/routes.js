var unitController = require('./controllers/unit');
var categoryController = require('./controllers/category');
var areaController = require('./controllers/area');
var productController = require('./controllers/product');
var orderController = require('./controllers/order');
var invoiceController = require('./controllers/invoice');
var tableController = require('./controllers/table');
var configController = require('./controllers/configuration');
var printerController = require('./controllers/printer');
var accountController = require('./controllers/account');

module.exports = function (app) {
  // ---------------------------------------------------------
  // route middleware to authenticate and check token
  // ---------------------------------------------------------
  app.use(accountController.authGuard);

  // Account routes
  app.post('/api/login', [accountController.login]);

  // Unit routes
  app.post('/api/unit/list', [unitController.list]);
  app.post('/api/unit', [unitController.create]);
  app.put('/api/unit/:id', [unitController.update]);
  app.delete('/api/unit/:id', [unitController.delete]);
  app.get('/api/unit/:id', [unitController.details]);
  app.post('/api/unit/delete', [unitController.deleteMany]);

  // Category routes
  app.post('/api/category/list', [categoryController.list]);
  app.post('/api/category', [categoryController.create]);
  app.put('/api/category/:id', [categoryController.update]);
  app.delete('/api/category/:id', [categoryController.delete]);
  app.get('/api/category/:id', [categoryController.details]);
  app.post('/api/category/delete', [categoryController.deleteMany]);

  // Area routes
  app.post('/api/area/list', [areaController.list]);
  app.post('/api/area', [areaController.create]);
  app.put('/api/area/:id', [areaController.update]);
  app.delete('/api/area/:id', [areaController.delete]);
  app.get('/api/area/:id', [areaController.details]);
  app.post('/api/area/delete', [areaController.deleteMany]);

  // Product routes
  app.post('/api/product/list', [productController.list]);
  app.post('/api/product', [productController.create]);
  app.put('/api/product/:id', [productController.update]);
  app.delete('/api/product/:id', [productController.delete]);
  app.get('/api/product/:id', [productController.details]);
  app.post('/api/product/delete', [productController.deleteMany]);

  // Table routes
  app.post('/api/table/list', [tableController.list]);
  app.post('/api/table', [tableController.create]);
  app.put('/api/table/:id', [tableController.update]);
  app.delete('/api/table/:id', [tableController.delete]);
  app.get('/api/table/:id', [tableController.details]);
  app.post('/api/table/delete', [tableController.deleteMany]);

  // Order routes
  app.post('/api/order/list', [orderController.list]);
  app.post('/api/order', [orderController.create]);
  app.put('/api/order/:id', [orderController.update]);
  app.delete('/api/order/:id', [orderController.delete]);
  app.get('/api/order/:id', [orderController.details]);
  app.post('/api/order/delete', [orderController.deleteMany]);

  // Invoice routes
  app.post('/api/invoice/list', [invoiceController.list]);
  app.post('/api/invoice', [invoiceController.create]);
  app.put('/api/invoice/:id', [invoiceController.update]);
  app.delete('/api/invoice/:id', [invoiceController.delete]);
  app.get('/api/invoice/:id', [invoiceController.details]);
  app.post('/api/invoice/delete', [invoiceController.deleteMany]);
  app.post('/api/invoice/print', [invoiceController.print]);

  // Configuration routes
  app.get('/api/config', [configController.get]);
  app.put('/api/config', [configController.put]);

  // Printer routes
  app.get('/api/printer/list', [printerController.list])
};
