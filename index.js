const path = require('path');
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// Report crashes to our server.
electron.crashReporter.start({
  companyName: 'Coffee',
  submitURL: 'http://localhost:123'
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd   Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  // start web server
  var mainApp = require('./server');

  // wait for 100ms before start the electron app
  setTimeout(function(){
    // Create the browser window and disable integration with node
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      nodeIntegration: false,
      frame: true, // close/minimize/maximize
      resizable: true,
    });

    // and load the index.html of the app.
    mainWindow.loadURL(`http://localhost:${mainApp.port}`);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  }, 100);
});

process.on('uncaughtException', function (err){
  if (err) {
    console.error('uncaughtException: ' + err.message);
    console.error(err.stack);
    //process.exit(1);             // exit with error
  }
});
