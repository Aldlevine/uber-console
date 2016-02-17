const remote = require('electron').remote;
const Menu = remote.Menu;
const uber = new (require('./uber'));

var template = [];

// Edit
var edit; template.push(edit = {
  label: 'Edit',
  submenu: []
});

edit.submenu.push({
  label: 'Clear Console',
  click: function(){
    uber.clear();
  }
});

edit.submenu.push({
  label: 'Clear History',
  click: function(){
    uber.clearHistory();
  }
});

// View
var view; template.push(view = {
  label: 'View',
  submenu: []
});

view.submenu.push({
  label: 'Dev Tools',
  click: function(){
    remote.getCurrentWindow().openDevTools();
  }
});

var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
