'use strict';

const argv = require('yargs').argv;
const child_process = require('child_process');
const electron = require('electron-prebuilt');


var cwd = __dirname.split('/');
cwd.pop();
cwd = cwd.join('/');
var child = child_process.spawn(electron, ['.', process.cwd()], {cwd: cwd, detached: true, stdio: 'pipe'});

process.on('exit', function(){
  child.kill();
});

process.on('SIGINT', function(){
  process.exit();
});

process.on('SIGTERM', function(){
  process.exit();
});
