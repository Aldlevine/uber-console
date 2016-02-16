var Console = module.exports = function Console()
{

}

Console.prototype.log = function (...args) {
  args.forEach(function(arg){
    io.receive(null, arg);
  });
};

Console.prototype.error = function (...args) {
  args.forEach(function(arg){
    io.receive(arg);
  });
};
