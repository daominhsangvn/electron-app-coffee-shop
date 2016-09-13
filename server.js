var express = require("express");
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var methodOverride = require('method-override');
var cors = require('cors');
var _ = require('lodash');
var port = 9000;

global.ROOTPATH = __dirname;

var util = require('./server/util');
var RouteConfig = require('./server/routes');
var Db = require('./server/db');

Db(function() {

  // Init express
  var app = express();

  // Config
  app.set('port', port);
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(methodOverride());
  app.use(cors());
  app.use(express.static(path.join(__dirname, 'dist')));

  RouteConfig(app);

  //var printer = require("printer");
  //var printData =
  //  [
  //    0x1b, 0x40, // Clear data in buffer and reset modes
  //    0x1b, 0x2d, 0x01, // underline
  //    0x1b, 0x45, 0x01 // Bold font ON
  //  ]
  //    .concat("qwertyuiopasdfghjklzxcvbnm qwerty".toBytes());
  //
  //
  //printData = printData.concat([0x0a, 0x0a]);
  //printData = printData.concat([0x01B, 0x64, 10]); // print
  //printer.printDirect({
  //  data: new Buffer(printData)
  //  //data: new Buffer(fs.readFileSync(__dirname + '/server/test.txt', 'utf-8'))//.data.toString('ascii', 0, data.length)
  //  , printer: 'POS58 10.0.0.6'
  //  , type: 'RAW'
  //  , success: function (jobID){
  //    console.log("sent to printer with ID: " + jobID);
  //  }
  //  , error: function (err){
  //    console.log(err);
  //  }
  //});


  app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });

});

module.exports = {
  port: port
};

//// Feed control sequences
//  CTL_LF: 			[ 0x0a ],						// Print and line feed
//  CTL_FF: 			[ 0x0c ],						// Form feed
//  CTL_CR: 			[ 0x0d ],						// Carriage return
//  CTL_HT: 			[ 0x09 ],						// Horizontal tab
//  CTL_VT: 			[ 0x0b ],						// Vertical tab
//
//  // Printer hardware
//  HW_INIT: 			[ 0x1b, 0x40 ],					// Clear data in buffer and reset modes
//  HW_SELECT: 			[ 0x1b, 0x3d, 0x01 ],			// Printer select
//  HW_RESET: 			[ 0x1b, 0x3f, 0x0a, 0x00 ],		// Reset printer hardware
//
//  // Cash Drawer
//  CD_KICK_2: 			[ 0x1b, 0x70, 0x00 ],			// Sends a pulse to pin 2 []
//  CD_KICK_5: 			[ 0x1b, 0x70, 0x01 ],			// Sends a pulse to pin 5 []
//
//  // Paper
//  PAPER_FULL_CUT: 	[ 0x1d, 0x56, 0x00 ],			// Full cut paper
//  PAPER_PART_CUT: 	[ 0x1d, 0x56, 0x01 ],			// Partial cut paper
//
//  // Text format
//  TXT_NORMAL: 		[ 0x1b, 0x21, 0x00 ],			// Normal text
//  TXT_2HEIGHT: 		[ 0x1b, 0x21, 0x10 ],			// Double height text
//  TXT_2WIDTH: 		[ 0x1b, 0x21, 0x20 ],			// Double width text
//  TXT_UNDERL_OFF: 	[ 0x1b, 0x2d, 0x00 ],			// Underline font OFF
//  TXT_UNDERL_ON: 		[ 0x1b, 0x2d, 0x01 ],			// Underline font 1-dot ON
//  TXT_UNDERL2_ON: 	[ 0x1b, 0x2d, 0x02 ],			// Underline font 2-dot ON
//  TXT_BOLD_OFF: 		[ 0x1b, 0x45, 0x00 ],			// Bold font OFF
//  TXT_BOLD_ON: 		[ 0x1b, 0x45, 0x01 ],			// Bold font ON
//  TXT_FONT_A: 		[ 0x1b, 0x4d, 0x00 ],			// Font type A
//  TXT_FONT_B: 		[ 0x1b, 0x4d, 0x01 ],			// Font type B
//  TXT_ALIGN_LT: 		[ 0x1b, 0x61, 0x00 ],			// Left justification
//  TXT_ALIGN_CT: 		[ 0x1b, 0x61, 0x01 ],			// Centering
//  TXT_ALIGN_RT: 		[ 0x1b, 0x61, 0x02 ],			// Right justification
//
//  // Barcode format
//  BARCODE_TXT_OFF: 	[ 0x1d, 0x48, 0x00 ],			// HRI barcode chars OFF
//  BARCODE_TXT_ABV: 	[ 0x1d, 0x48, 0x01 ],			// HRI barcode chars above
//  BARCODE_TXT_BLW: 	[ 0x1d, 0x48, 0x02 ],			// HRI barcode chars below
//  BARCODE_TXT_BTH: 	[ 0x1d, 0x48, 0x03 ],			// HRI barcode chars both above and below
//  BARCODE_FONT_A: 	[ 0x1d, 0x66, 0x00 ],			// Font type A for HRI barcode chars
//  BARCODE_FONT_B: 	[ 0x1d, 0x66, 0x01 ],			// Font type B for HRI barcode chars
//  BARCODE_HEIGHT: 	[ 0x1d, 0x68, 0x64 ],			// Barcode Height [1-255]
//  BARCODE_WIDTH: 		[ 0x1d, 0x77, 0x03 ],			// Barcode Width  [2-6]
//  BARCODE_UPC_A: 		[ 0x1d, 0x6b, 0x00 ],			// Barcode type UPC-A
//  BARCODE_UPC_E: 		[ 0x1d, 0x6b, 0x01 ],			// Barcode type UPC-E
//  BARCODE_EAN13: 		[ 0x1d, 0x6b, 0x02 ],			// Barcode type EAN13
//  BARCODE_EAN8: 		[ 0x1d, 0x6b, 0x03 ],			// Barcode type EAN8
//  BARCODE_CODE39: 	[ 0x1d, 0x6b, 0x04 ],			// Barcode type CODE39
//  BARCODE_ITF: 		[ 0x1d, 0x6b, 0x05 ],			// Barcode type ITF
//  BARCODE_NW7: 		[ 0x1d, 0x6b, 0x06 ],			// Barcode type NW7
//
//  // Image format
//  S_RASTER_N: 		[ 0x1d, 0x76, 0x30, 0x00 ], 	// Set raster image normal size
//  S_RASTER_2W: 		[ 0x1d, 0x76, 0x30, 0x01 ], 	// Set raster image double width
//  S_RASTER_2H: 		[ 0x1d, 0x76, 0x30, 0x02 ], 	// Set raster image double height
//  S_RASTER_Q: 		[ 0x1d, 0x76, 0x30, 0x03 ]	 	// Set raster image quadruple
