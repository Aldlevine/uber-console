'use strict';

const electron = require('electron');
const ipc = electron.ipcRenderer;
const IO = require('./io');


var stdout = null
  , stdin = null
  , io = null
;


window.addEventListener('load', function(){
  stdout = document.querySelector('#stdout');
  stdin = document.querySelector('#stdin');
  io = new IO;

  stdin.addEventListener('keypress', function(e){
    if( e.which == 13 && e.shiftKey == false ) e.preventDefault();
  });

  stdin.addEventListener('keyup', function(e){
    if( e.which == 13 && e.shiftKey == false )
    {
      e.preventDefault();
      var content = stdin.innerText;
      io.command(content);
      io.send(content);
    }
  });

  ipc.on('data', function(e, data){
    console.log(data);
  });
});
