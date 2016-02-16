const _ = require('lodash');
const command = require('./command');

var IO = module.exports = function()
{
  this.stdout = document.querySelector('#stdout');
  this.stdin = document.querySelector('#stdin');
}

IO.prototype.receive = function (err, value)
{
  if(err) this.error(err);
  else this.log(value);
}

IO.prototype.send = function (content)
{
  stdin.innerHTML = '';
  command(content, function(...args){
    io.receive.call(io, ...args);
  });
}

IO.prototype.log = function (...args) {
  var self = this;
  args.forEach(function(arg){
    if( _.isNull(arg) ) self.writePrimitive('null', 'null');
    else if( _.isUndefined(arg) ) self.writePrimitive('undefined', 'undefined');
    else if( _.isBoolean(arg) ) self.writePrimitive(arg, 'boolean');
    else if( _.isNumber(arg) ) self.writePrimitive(arg, 'number');
    else if( _.isRegExp(arg) ) self.writePrimitive(arg.toString(), 'regexp');
    else if( _.isString(arg) ) self.writePrimitive(arg, 'string');
    else if( _.isFunction(arg) ) self.writeFunction(arg);
    else if( _.isBuffer(arg) ) self.writeBuffer(arg);
    else if( _.isArray(arg) ) self.writeArray(arg);
    else if( _.isObject(arg) ) self.writeObject(arg);
  });
  window.scrollTo(0, document.body.scrollHeight);
};

IO.prototype.error = function (...args) {
  var self = this;
  args.forEach(function(arg){
    if( arg.type && arg.message )
      self.writePrimitive( `[${arg.type}: ${arg.message}]`, 'string', true );
      if( arg.stack )
        self.writePrimitive( arg.stack, 'stack', true );
    else
      self.writePrimitive( `[${arg}]`, 'string', true );
  });
  window.scrollTo(0, document.body.scrollHeight);
};

IO.prototype.command = function (command) {
  var out = `<div data-type="command" data-error="false">${command}</div>`;
  stdout.innerHTML += out;
  window.scrollTo(0, document.body.scrollHeight);
};

IO.prototype.primitive = function (arg, type, isErr) {
  var isErr = !!isErr ? true : false
    , element = document.createElement('div')
  ;
  element.setAttribute('data-type', type);
  element.setAttribute('data-error', isErr);
  element.innerHTML = arg;
  return element;
};
IO.prototype.writePrimitive = function (arg, type, isErr) {
  stdout.appendChild(this.primitive(arg, type, isErr));
};

IO.prototype.function = function (arg) {
  var element = document.createElement('div');
  element.setAttribute('data-type', 'function');
  element.setAttribute('data-error', false);
  element.innerHTML = arg;
  return element;
}
IO.prototype.writeFunction = function (arg) {
  stdout.appendChild(this.function(arg));
};

IO.prototype.buffer = function (arg) {
  var element = document.createElement('div');
  element.setAttribute('data-type', 'buffer');
  element.setAttribute('data-error', false);
  element.innerHTML = `&lt;Buffer: [${arg.toJSON().data}]&gt;`;
  return element;
};
IO.prototype.writeBuffer = function (arg) {
  stdout.appendChild(this.buffer(arg));
};

IO.prototype.array = function (arg) {
  return this.object(arg);
};
IO.prototype.writeArray = function (arg) {
  return this.writeObject(arg);
};

IO.prototype.object = function (arg) {
  var self = this;
  var object_div = document.createElement('div');
  object_div.setAttribute('data-type', 'object');
  object_div.setAttribute('data-error', false);
  object_div.innerHTML = `${arg.constructor.name || 'Object'} {}`;

  (function(arg){
    function expand(e)
    {
      e.stopPropagation();
      e.stopImmediatePropagation();
      object_div.innerHTML = `${arg.constructor.name || 'Object'} {}`;
      for( var key in arg )
      {
        var value = arg[key]
          , item = null
        ;
        if( _.isNull(value) ) item = self.primitive('null', 'null');
        else if( _.isUndefined(value) ) item = self.primitive('undefined', 'undefined');
        else if( _.isBoolean(value) ) item = self.primitive(value, 'boolean');
        else if( _.isNumber(value) ) item = self.primitive(value, 'number');
        else if( _.isRegExp(value) ) item = self.primitive(value.toString(), 'regexp');
        else if( _.isString(value) ) item = self.primitive(value, 'string');
        else if( _.isFunction(value) ) item = self.function(value);
        else if( _.isBuffer(value) ) item = self.buffer(value);
        else if( _.isArray(value) ) item = self.array(value);
        else if( _.isObject(value) ) item = self.object(value);
        key_div = document.createElement('div');
        key_div.setAttribute('data-type', 'key');
        key_div.innerHTML = `${key}: `;
        key_div.appendChild(item);
        object_div.appendChild(key_div);
      }
    }
    object_div.addEventListener('click', expand);
  })(arg);
  return object_div;
};
IO.prototype.writeObject = function (arg) {
  stdout.appendChild( this.object(arg) );
};
