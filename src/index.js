'use strict';

const electron = require('electron');
const ipc = electron.ipcRenderer;
const IO = require('./io');


var stdout = null
  , stdin = null
  , io = null
;

/*function write(...args)
{
  args.forEach(function(arg){
    if( typeof arg === 'object' )
      stdout.innerHTML += JSON.stringify(arg);
    else
      stdout.innerHTML += arg;
    stdout.innerHTML += ' ';
  });
  stdout.innerHTML += '<br>';
}*/

function send(content)
{
  stdin.innerHTML = '';
  ipc.send('console#command', content);
}

window.addEventListener('load', function(){
  stdout = document.querySelector('#stdout');
  stdin = document.querySelector('#stdin');
  io = new IO;

  ipc.on('console#log', function(event, ...args){
    io.log(...args);
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
