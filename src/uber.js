const fs = require('fs');

var Uber = module.exports = function()
{

}

Uber.prototype.ls = function (path) {
  return fs.readdirSync(path || '.');
};
