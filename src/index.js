'use strict';

const electron = require('electron');
const IO = require('./io');

require('./menu');

var stdout = null
  , stdin = null
  , io = null
  , shouldShowCommandHistory = false
  , commandHistory = localStorage.getItem('commandHistory') ? JSON.parse(localStorage.getItem('commandHistory')) : []
  , commandHistoryIndex = commandHistory.length - 1
;

window.addEventListener('unload', function(){
  localStorage.setItem('commandHistory', JSON.stringify(commandHistory));
});

function getCaretOffset(element)
{
  var range = window.getSelection().getRangeAt(0)
    , preCaretRange = range.cloneRange()
  ;
  preCaretRange.selectNodeContents(element);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  return preCaretRange.toString().length;
}

function getLineHeight(element){
   var temp = document.createElement(element.nodeName);
   temp.setAttribute("style","margin:0px;padding:0px;font-family:"+element.style.fontFamily+";font-size:"+element.style.fontSize);
   temp.innerHTML = "test";
   temp = element.parentNode.appendChild(temp);
   var ret = temp.clientHeight;
   temp.parentNode.removeChild(temp);
   return ret;
}

function isCaretAtTop()
{
  var selection = window.getSelection()
    , range = selection.getRangeAt(0)
    , span = document.createElement('span')
  ;
  if(!range.collapsed) return false;
  span.style.display = 'inline-block';
  range.insertNode(span);
  var distanceFromTop = span.getBoundingClientRect().top - stdin.getBoundingClientRect().top;
  span.remove();
  return getLineHeight(stdin) > distanceFromTop;
}

function isCaretAtBottom()
{
  var selection = window.getSelection()
    , range = selection.getRangeAt(0)
    , span = document.createElement('span')
  ;
  if(!range.collapsed) return false;
  span.style.display = 'inline-block';
  range.insertNode(span);
  var distanceFromBottom = stdin.getBoundingClientRect().bottom - span.getBoundingClientRect().bottom;
  span.remove();
  return getLineHeight(stdin) > distanceFromBottom;
}

window.addEventListener('load', function(){
  
  stdout = document.querySelector('#stdout');
  stdin = document.querySelector('#stdin');
  io = new IO;

  stdin.addEventListener('keydown', function(e){
    if( e.which == 38 && !e.shiftKey && isCaretAtTop() )
    {
      if( commandHistoryIndex >= 0)
      {
        stdin.innerText = commandHistory[commandHistoryIndex--];
        var selection = window.getSelection();
        selection.selectAllChildren(stdin);
        selection.collapseToEnd();
      }
      shouldShowCommandHistory = false;
    }

    if( e.which == 40 && !e.shiftKey && isCaretAtBottom() )
    {
      if( commandHistoryIndex < commandHistory.length - 1 )
      {
        commandHistoryIndex++;
        stdin.innerText = commandHistory[commandHistoryIndex];
        var selection = window.getSelection();
        selection.selectAllChildren(stdin);
        selection.collapseToEnd();
      }
      else
        stdin.innerText = '';
      shouldShowCommandHistory = false;
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

      if( commandHistory[commandHistory.length - 1] != content )
        commandHistory.push(content);
      commandHistoryIndex = commandHistory.length - 1;
    }
  });


  window.addEventListener('click', function(){
    var selection = window.getSelection();
    if(selection.isCollapsed)
      stdin.focus();
  }, true);


  stdin.addEventListener('paste', function(e){
    e.preventDefault();
    var text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  });

});
