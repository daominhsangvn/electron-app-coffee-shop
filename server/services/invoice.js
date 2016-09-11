var Invoice = require('./../models/invoice');
var Configuration = require('./../models/configuration');
var ProductInOrder = require('./../models/productInOrder');
var ProductInInvoice = require('./../models/productInInvoice');
var Promise = require('promise');
var _ = require('lodash');
var moment = require('moment');
var printer = require("printer");
var printers = printer.getPrinters();

function getInvoiceDetails(id) {
  return new Promise(function(done, fail) {
    Invoice
      .findOne({_id: id})
      .populate({
        path: 'order',
        populate: {
          path: 'order productsInInvoice',
          populate: {
            path: 'table area product'
          }
        }
      })
      .exec(function(err, doc) {
        if(err) {
          fail(err);
        }
        else {
          done(invoice);
        }
      });





    //// Count all documents in the datastore
    //var orders = [], products = [], tables = [], areas = [];
    //
    //return new Promise(function(resolve, reject) {
    //  dbContext.order.find({}).exec(function(err, data) {
    //    orders = data;
    //    resolve();
    //  });
    //})
    //  .then(function() {
    //    return new Promise(function(resolve, reject) {
    //      dbContext.product.find({}).exec(function(err, data) {
    //        products = data;
    //        resolve();
    //      });
    //    });
    //  })
    //  .then(function() {
    //    return new Promise(function(resolve, reject) {
    //      dbContext.table.find({}).exec(function(err, data) {
    //        tables = data;
    //        resolve();
    //      });
    //    });
    //  })
    //  .then(function() {
    //    return new Promise(function(resolve, reject) {
    //      dbContext.area.find({}).exec(function(err, data) {
    //        areas = data;
    //        resolve();
    //      });
    //    });
    //  })
    //  .then(function() {
    //    db.findOne({_id: id}, function(err, invoice) {
    //      if(err) {
    //        fail(err);
    //      }
    //      else if(!invoice) {
    //        fail('Invoice not found!');
    //      }
    //      else {
    //        invoice.order = _.find(orders, {_id: invoice.orderId});
    //        if(invoice.order) {
    //          invoice.order.table = _.find(tables, {_id: invoice.order.tableId});
    //          invoice.order.area = _.find(areas, {_id: invoice.order.areaId});
    //          invoice.order.products = _.map(invoice.order.products, function(prod) {
    //            prod.product = _.find(products, {_id: prod.productId});
    //            return prod;
    //          });
    //        }
    //        done(invoice);
    //      }
    //    });
    //  });
  });
}

module.exports = {
  list: function(page, per_page, filter, sort) {
    filter = filter || {};
    return new Promise(function(resolve, reject) {
      // Count all documents in the datastore
      var total = 0;
      Invoice.count({}, function(err, count) {
        total = count;
        //var filterObj = {};
        //if(filter && filter.length > 0) {
        //  filterObj = {
        //    name: {
        //      $regex: new RegExp(filter, 'gi')
        //    }
        //  };
        //}

        var queries = Invoice;

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
          .populate({
            path: 'order productsInInvoice',
            populate: {
              path: 'table area product'
            }
          })
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
    return new Promise(function(done, fail) {

      var createProductInInvoicePromise = [];
      var products = doc.products;
      delete doc.products;

      var newModel = new Invoice(doc);

      // Create Order
      newModel.save(function(err, newInvoice) {
        if(err) {
          reject(err);
        }
        else {
          // Create ProductInInvoice
          _.each(products, function(el) {
            createProductInInvoicePromise.push(new Promise(function(resolve, reject) {
              new ProductInInvoice({
                product: el.productId,
                price: el.price,
                invoice: newInvoice.id,
                quantity: el.qty
              }).save(function(err, newDoc) {
                if(err) {
                  reject(err);
                }
                else {
                  resolve(newDoc);
                }
              });
            }));
          });

          Promise.all(createProductInInvoicePromise).then(function() {
            done(newInvoice);
          }, function(err) {
            fail(err);
          })
        }
      });
    });
  },

  update: function(id, doc) {
    return new Promise(function(resolve, reject) {
      Invoice.findByIdAndUpdate(id, {$set: doc}, function(err) {
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
      Invoice.findByIdAndRemove(id, function(err, doc) {
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
      Invoice
        .findOne({_id: id})
        .populate({
          path: 'order',
          populate: {
            path: 'productsInOrder',
            populate: {
              path: 'product'
            }
          }
        })
        .exec(function(err, doc) {
          if(err) {
            reject(err);
          }
          else {
            resolve(doc);
          }
        });
    });
  },

  print: function(id) {
    Configuration.find({}, function(err, docs) {
      var config = {};
      _.each(docs, function(el) {
        return config[el.field] = el.value;
      });

      function escapeUnicode(input) {
        var str = input;
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/Đ/g, "Đ");
        //str = str.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, " ");
        //str = str.replace(/-+-/g, " ");
        //str = str.replace(/^\-+|\-+$/g, "");
        return str;
      }

      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      function addProduct(name, price, qty, total) {
        return [
          0x1b, 0x21, 0x00,
          0x1b, 0x61, 0x00
        ]
          .concat((escapeUnicode(name) + "\r\n").toBytes())
          .concat(0x1b, 0x21, 0x00)
          .concat(0x1b, 0x61, 0x02)
          .concat(((' ' + qty + ' x ').slice(-5)).toBytes())
          .concat(0x1b, 0x21, 0x00)
          .concat(0x1b, 0x61, 0x02)
          .concat(((numberWithCommas(price)).slice(-8)).toBytes())
          .concat(0x1b, 0x21, 0x00)
          .concat(0x1b, 0x61, 0x02)
          .concat((((space(5) + (numberWithCommas(total)).slice(-8))) + "\r\n").toBytes());
      }

      function space(length) {
        var str = "";
        for (var i = 0; i < length; i++) {
          str += " ";
        }
        return str;
      }

      // 32 chars 1 line
      function doPrint(invoice, done, fail) {
        var printData =
          [
            0x1b, 0x40, // Clear data in buffer and reset modes
            0x1b, 0x2d, 0x01, // underline
            0x1b, 0x45, 0x01 // Bold font ON
          ]
            .concat((escapeUnicode(config.shopName || "Tra Sua Vicente") + "\r\n").toBytes())
            .concat([0x1b, 0x21, 0x00]) // normal
            .concat(("Dc: " + escapeUnicode(config.shopAddress || "Den Thanh Vicente") + "\r\n").toBytes())
            .concat([0x1b, 0x21, 0x00]) // normal
            .concat(("Dt: " + escapeUnicode(config.shopPhone || "0934.16.96.16") + "\r\n\r\n").toBytes())
            .concat([
              0x1b, 0x45, 0x01, // Bold font ON
              0x1b, 0x61, 0x01, // Center
              0x1b, 0x21, 0x10, // Double height text
              0x1b, 0x21, 0x20  // Double width text
            ]) // normal
            .concat("HOA DON\r\n\r\n".toBytes())
            .concat([
              0x1b, 0x21, 0x00,
              0x1b, 0x61, 0x00
            ])
            .concat((escapeUnicode(invoice.order.table.name) + " - KV: " + escapeUnicode(invoice.order.area.name) + "\r\n").toBytes())
            .concat([0x1b, 0x21, 0x00])
            .concat("--------------------------------\r\n".toBytes())
            .concat([0x1b, 0x21, 0x00])
            //.concat("So: ".toBytes())
            //.concat([0x1b, 0x45, 0x01])
            //.concat("DV00012/10".toBytes())
            //.concat([0x1b, 0x21, 0x00])
            .concat("Ngay: ".toBytes())
            .concat([0x1b, 0x45, 0x01])
            .concat((moment(invoice.order.created_at).format('DD/MM/YYYY') + "\r\n").toBytes())
            //.concat([0x1b, 0x21, 0x00])
            //.concat("Thu ngan: Quan ly\r\n".toBytes())
            .concat([0x1b, 0x21, 0x00, 0x0d])
            .concat(("Vao:  " + moment(invoice.order.created_at).format('HH:mm a').replace('pm', 'ch').replace('am', 'sa') + "     Ra: " + moment(invoice.created_at).format('HH:mm a').replace('pm', 'ch').replace('am', 'sa') + "\r\n").toBytes())
            .concat([0x1b, 0x21, 0x00])
            .concat("--------------------------------\r\n".toBytes())
            .concat([
              0x1b, 0x45, 0x01,
              0x1b, 0x4d, 0x00
            ])
            .concat("Ten hang                   Tien \r\n".toBytes());

        _.each(invoice.productsInInvoice, function(pii) {
          printData = printData.concat(addProduct(pii.product.name, pii.price, pii.qty, pii.qty * pii.price));
        });

        // TOtal
        printData = printData.concat("--------------------------------\r\n".toBytes());
        printData = printData.concat([0x1b, 0x45, 0x01]); // bold on
        printData = printData.concat(("Tong tien:" + space(22 - numberWithCommas(invoice.total).length) + numberWithCommas(invoice.total) + "\r\n\r\n").toBytes());
        printData = printData.concat([0x1b, 0x45, 0x00]); // bold off
        // Thank you
        printData = printData.concat([0x1b, 0x61, 0x01]);
        printData = printData.concat("~~~~~~~~~~~~~~\r\n".toBytes());
        printData = printData.concat("Cam on va hen gap lai quy khach!\r\n\r\n".toBytes());


        printData = printData.concat([0x0a, 0x0a]);
        printData = printData.concat([0x01B, 0x64, 10]); // print

        printer.printDirect({
          data: new Buffer(printData)
          //data: new Uint8Array(printData).buffer
          //data: fs.readFileSync(__dirname + '/receipts/test.txt', 'utf-8')//.data.toString('ascii', 0, data.length)
          , printer: config.printer.name || 'POS58 10.0.0.6'
          , type: 'RAW'
          , success: function(jobID) {
            console.log("sent to printer with ID: " + jobID);
          }
          , error: function(err) {
            console.log(err);
          }
        });

        done();
      }

      return new Promise(function(done, fail) {
        getInvoiceDetails(id)
          .then(function(invoice) {
            doPrint(invoice, done, fail);
          }, function(err) {
            fail(err);
          });
      });
    });
  }
};
