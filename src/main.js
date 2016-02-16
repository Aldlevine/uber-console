'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const vm = require('vm');
const _ = require('lodash');
const __rootpath = process.argv[2] || process.cwd();


global.__rootpath = __rootpath;


var mainWindow = null
  , console_ready = false
  , console_cache = []
  , console_log
  , console_error
;


app.on('window-all-closed', function(){
  app.quit();
});


app.on('ready', function(){
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.webContents.executeJavaScript(`global.__rootpath = "${__rootpath}"`);
});


var stdout_write = process.stdout.write;
process.stdout.write = function(data){
  mainWindow.webContents.executeJavaScript(`io.receive(null, \`${data.toString()}\` )`);
};
