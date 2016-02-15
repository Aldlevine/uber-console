'use strict';
const argv = require('yargs').argv;
const child_process = require('child_process');
const electron = require('electron-prebuilt');

var child = child_process.spawn(electron, ['.'], {cwd: process.cwd, detached: true, stdio: 'pipe'});

process.on('exit', function(){
  child.kill();
});

process.on('SIGINT', function(){
  process.exit();
});

process.on('SIGTERM', function(){
  process.exit();
});
