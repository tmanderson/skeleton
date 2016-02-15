'use strict';

var _ = require('lodash');
var fs = require('fs');
var exec = require('child_process').exec;
var npm = require('npm');
var logger = require('./logger');
var bower = require('bower');

setTimeout(function() {
  if(fs.existsSync('package.json')) {
    exec('npm install -s', function(err) {
      if(!err) {
        logger.success('NPM modules install successfully');
      }
      else {
        logger.error(err);
      }
    });
  }

  if(fs.existsSync('bower.json')) {
    exec('bower install -s', function(err) {
      if(!err) {
        logger.success('Bower modules install successfully');
      }
      else {
        logger.error(err);
      }
    });
  }
}, 1000);