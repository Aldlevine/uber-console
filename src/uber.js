const fs = require('fs');

var Uber = module.exports = function()
{
}

Uber.prototype.ls = function (path)
{
  return fs.readdirSync(path || '.');
};

Uber.prototype.clear = function ()
{
  setImmediate(function(){ stdout.innerHTML = '' });
}

Uber.prototype.clearHistory = function () {
  setImmediate(function(){
    localStorage.setItem('commandHistory', '[]');
    commandHistory = [];
    commandHistoryIndex = -1;
  });
};
