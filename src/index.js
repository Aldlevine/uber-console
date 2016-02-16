'use strict';

const electron = require('electron');
const ipc = electron.ipcRenderer;
const IO = require('./io');
const command = require('./command').command;


var stdout = null
  , stdin = null
  , io = null
;

function receive(err, ret)
{
  if(err) io.error(err);
  else io.log(ret);
}

function send(content)
{
  stdin.innerHTML = '';
  command(content, receive);
}

window.addEventListener('load', function(){
  stdout = document.querySelector('#stdout');
  stdin = document.querySelector('#stdin');
  io = new IO;

  ipc.on('console#log', function(event, ...args){
    io.console_log(...args);
  });

  ipc.on('console#error', function(event, ...args){
    io.error(...args);
  });

  ipc.on('console#command', function(event, command){
    io.command(command);
  });

  ipc.send('console#ready');

  stdin.addEventListener('keypress', function(e){
    if( e.which == 13 && e.shiftKey == false ) e.preventDefault();
  });

  stdin.addEventListener('keyup', function(e){
    if( e.which == 13 && e.shiftKey == false )
    {
      e.preventDefault();
      var content = stdin.innerText;
      send(content);
    }
  });
});
