var IO = module.exports = function()
{
  this.stdout = document.querySelector('#stdout');
  this.stdin = document.querySelector('#stdin');
}


IO.prototype.log = function (...args) {
  var self = this;
  args.forEach(function(arg){
    var type = arg.type
      , data = arg.data
      , string = arg.string
    ;
    switch(type)
    {
      case 'null':
        self.writePrimitive('null', 'null'); break;
      case 'undefined':
        self.writePrimitive('undefined', 'undefined'); break;
      case 'boolean':
        self.writePrimitive(string, 'boolean'); break;
      case 'number':
        self.writePrimitive(data, 'number'); break;
      case 'regexp':
        self.writePrimitive(string, 'regexp'); break;
      case 'string':
        self.writePrimitive(data, 'string'); break;
      case 'function':
        self.writeFunction(string); break;
      case 'buffer':
        self.writeBuffer(data); break;
      case 'array':
        self.writeArray(data); break;
      case 'object':
        self.writeObject(data); break;
      default:
        self.writePrimitive(data, 'string');
    }
  });
};

IO.prototype.writePrimitive = function (arg, type, isErr) {
  var isErr = !!isErr ? true : false;
  var out = `<div data-type="${type}" data-error="${isErr}">${arg}</div>`;
  stdout.innerHTML += out;
};

IO.prototype.writeFunction = function (arg) {
  var out = `<div data-type="function" data-error="false">${arg}</div>`;
  stdout.innerHTML += out;
};

IO.prototype.writeBuffer = function (arg) {
  var out = `<div data-type="buffer" data-error="false">&lt;Buffer: [${arg.toJSON().data}]&gt;</div>`;
  stdout.innerHTML += out;
};

IO.prototype.writeArray = function (arg) {

};

IO.prototype.writeObject = function (arg) {
  var out = `<div data-type="object" data-error="false">`;
  out += `${arg.constructor.name} {\n`
  for( var key in arg )
  {
    out += `\t${key}: ${arg[key]}\n`;
  }
  out += `}`;
  stdout.innerHTML += out;
};

IO.prototype.error = function (...args) {
  var self = this;
  args.forEach(function(arg){
    console.error(arg);
    if( arg.type && arg.message )
      self.writePrimitive( `[${arg.type}: ${arg.message}]`, 'string', true );
    else
      self.writePrimitive( `[${arg}]`, 'string', true );
  });
};

IO.prototype.command = function (command) {
  var out = `<div data-type="command" data-error="false">${command}</div>`;
  stdout.innerHTML += out;
};
