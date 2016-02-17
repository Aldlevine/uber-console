const remote = require('electron').remote;
const Menu = remote.Menu;

var template = [];

var edit; template.push(edit = {
  label: 'Edit',
  submenu: []
});

edit.submenu.push({
  label: 'Clear Console',
  click: function(){
    stdout.innerHTML = '';
  }
});

edit.submenu.push({
  label: 'Clear History',
  click: function(){
    localStorage.setItem('commandHistory', '');
    commandHistory = [];
    commandHistoryIndex = -1;
  }
});

var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
