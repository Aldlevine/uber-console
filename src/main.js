'use strict';


const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const vm = require('vm');
const _ = require('lodash');


var mainWindow = null
  , console_ready = false
  , console_cache = []
;


function getType(value)
{
  if( _.isNull(value) ) return 'null';
  if( _.isUndefined(value) ) return 'undefined';
  if( _.isBoolean(value) ) return 'boolean';
  if( _.isNumber(value) ) return 'number';
  if( _.isRegExp(value) ) return 'regexp';
  if( _.isString(value) ) return 'string';
  if( _.isFunction(value) ) return 'function';
  if( _.isBuffer(value) ) return 'buffer';
  if( _.isArray(value) ) return 'array';
  if( _.isObject(value) ) return 'object';
}


function log(...args)
{
  args.forEach(function(arg, i){
    args[i] = {};
    args[i].type = getType(arg);
    args[i].data = arg;
    if(arg !== null && arg !== undefined) args[i].string = arg.toString();
  });

  mainWindow.webContents.send('console#log', ...args);
}


app.on('window-all-closed', function(){
  app.quit();
});


app.on('ready', function(){
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  //mainWindow.webContents.openDevTools();
});


ipc.on('console#ready', function(){
  flush_cache();
});


var context = {
  require: require,
  __dirname: process.cwd(),
  process: process,
  console: console
};


function command(content)
{
  return vm.runInNewContext(content, context, {displayErrors: false});
}


ipc.on('console#command', function(e, content){
  mainWindow.webContents.send('console#command', content);
  try
  {
    console.log( command(content) );
  }
  catch(err)
  {
    console.error(err);
  }
});


var console_log = console.log;
console.log = function(...args)
{
  if( console_ready )
  {
    log(...args);
  }
  else
  {
    console_cache.push({verb:'log', args:[...args]});
  }
}


var console_error = console.error;
console.error = function(...args)
{
  args.forEach(function(arg, i){
    if( arg.message )
    {
      args[i] = {type: arg.constructor.name, message: arg.message, stack: arg.stack};
    }
    else
    {
      args[i] = {type: 'Error', message: arg, stack: null};
    }
  });

  if( console_ready )
  {
    mainWindow.webContents.send('console#error', ...args);
  }
  else
  {
    console_cache.push({verb:'error', args: [...args]});
  }
}


function flush_cache()
{
  var item = null;
  while( item = console_cache.shift() )
  {
    mainWindow.webContents.send(`console#${item.verb}`, ...item.args);
  }
  if( console_cache.length == 0 ) console_ready = true;
  else flush_cache();
}
