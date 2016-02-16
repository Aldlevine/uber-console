const assert = require('assert');
const remote = require('electron').remote;
const Console = require('console').Console;
var __console = remote.getGlobal('console');

module.exports = console;


console.log = function (...args) {
  args.forEach(function(arg){
    io.receive(null, arg);
  });
};

console.dir = console.log;

console.error = function (...args) {
  args.forEach(function(arg){
    io.receive(arg);
  });
};

console.warn = console.error;

console.info = function (...args) {
  args.forEach(function(arg){
    io.receive(null, `<span class="fa fa-info">(i) ${arg}</span>`);
  });
};

console.assert = function(assertion, obj) {
  try
  {
    assert(assertion, obj);
  }
  catch(err)
  {
    io.receive(err);
  }
}

console.time = function(...args)
{
  return __console.time.call(__console, ...args);
}

console.timeEnd = function(...args)
{
  return __console.timeEnd.call(__console, ...args);
}

console.trace = function(...args)
{
  var trace_console = new Console(process.stdout, process.stderr);
  var write = process.stderr.write;
  process.stderr.write = function(data)
  {
    io.receive(data);
    process.stderr.write = write;
  }
  trace_console.trace(...args);
}
