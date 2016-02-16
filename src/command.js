
const vm = require('vm');
const remote = require('electron').remote;

var Command = module.exports = {};
var context = {
  require: remote.require,
  process: remote.process,
  console: {
    log: function(...args)
    {
      args.forEach(function(arg){
        receive(null, arg);
      });
    },
    error: function(...args)
    {
      args.forEach(function(arg){
        receive(arg);
      });
    }
  }
};

Command.command =  function (content, done)
{
  var cwd = process.cwd()
    , ret = null
  ;
  try
  {
    process.chdir(__rootpath);
    ret = vm.runInNewContext(content, context, {displayErrors: false});
    process.chdir(cwd);
    done(null, ret);
  }
  catch(err)
  {
    done(err);
  }
}
