// var printer = require("printer");
//
module.exports = {
  list: function(req, res) {
    // var printers = printer.getPrinters();
    res.send({
      success: true,
      // data: printers
    });
  }
};
