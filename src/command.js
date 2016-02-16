const vm = require('vm');
const remote = require('electron').remote;
const Console = require('./console');

const _global = remote.getGlobal('global');
window.__rootpath = global.__rootpath;

var context = vm.createContext({
  require: require,
  process: remote.process,
  console: new Console(),
  global: remote.getGlobal('global')
});

module.exports = function (content, done)
{
  var cwd = process.cwd()
    , ret = null
  ;
  try
  {
    process.chdir(global.__rootpath);
    vm.runInContext(`process.chdir('${global.__rootpath}')`, context);
    ret = vm.runInContext(content, context, {displayErrors: false});
    process.chdir(cwd);
    done(null, ret);
  }
  catch(err)
  {
    done(err);
  }
}
