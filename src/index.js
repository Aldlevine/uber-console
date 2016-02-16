'use strict';

const electron = require('electron');
const ipc = electron.ipcRenderer;
const IO = require('./io');


var stdout = null
  , stdin = null
  , io = null
  , shouldShowCommandHistory = false
  , commandHistory = []
  , commandHistoryIndex = 0
;


function getCaretOffset(element)
{
  var range = window.getSelection().getRangeAt(0)
    , preCaretRange = range.cloneRange()
  ;
  preCaretRange.selectNodeContents(element);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  return preCaretRange.toString().length;
}

window.addEventListener('load', function(){

  stdout = document.querySelector('#stdout');
  stdin = document.querySelector('#stdin');
  io = new IO;

  stdin.addEventListener('keydown', function(e){

    if( e.which == 38 && !e.shiftKey && getCaretOffset(stdin) == 0)
    {
      shouldShowCommandHistory = true;
    }

    if( e.which == 40 && !e.shiftKey && getCaretOffset(stdin) == stdin.innerText.replace(/\n/g, '').length )
    {
      shouldShowCommandHistory = true;
    }
  });

  stdin.addEventListener('keypress', function(e){
    if( e.which == 13 && !e.shiftKey ) e.preventDefault();
  });

  stdin.addEventListener('keyup', function(e){
    if( e.which == 13 && !e.shiftKey )
    {
      e.preventDefault();
      var content = stdin.innerText;
      io.command(content);
      io.send(content);

      commandHistory.push(content);
      commandHistoryIndex = commandHistory.length - 1;
    }

    if( e.which == 38 && !e.shiftKey && shouldShowCommandHistory )
    {
      if( commandHistoryIndex >= 0)
        stdin.innerText = commandHistory[commandHistoryIndex--];
      shouldShowCommandHistory = false;
    }

    if( e.which == 40 && !e.shiftKey && shouldShowCommandHistory )
    {
      if( commandHistoryIndex < commandHistory.length - 1 )
        stdin.innerText = commandHistory[++commandHistoryIndex];
      else
        stdin.innerText = '';
      shouldShowCommandHistory = false;
    }

  });

  ipc.on('data', function(e, data){
    console.log(data);
  });

});
