const vm = require('vm');
const remote = require('electron').remote;
const Console = require('./console');
const Module = require('module');
const resolve = require('resolve');
const _ = require('lodash');
const Uber = require('./uber')

const _global = {};
for(var key in global) _global[key] = global[key];

_global.require = function(path){
  return require(resolve.sync(path, {basedir: process.cwd()}));
};
_global.process = remote.process;
_global.console = Console;
_global.global = _global;
_global.uber = new Uber;

var context = vm.createContext(_global);

module.exports = function (content, done)
{
  var cwd = process.cwd()
    , ret = null
  ;

  try
  {
    ret = vm.runInContext(content, context, {filename: `${global.__rootpath}/VM`, displayErrors: false});
    done(null, ret);
  }
  catch(err)
  {
    done(err);
  }
}
