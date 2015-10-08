'use strict';
/* globals prompt, basename, name, fs, npm */

var _ = require('lodash');
var os = require('os');
var path = require('path');
var logger = require('../logger');
var fileutil = require('../util/fs');

module.exports = Object.create({
  'name': name,
  'version': '0.0.0',
  'description': prompt('description', ''),
  'main': prompt('entry point', 'index.js'),
  'bin': function (cb) {
    var path = require('path');
    var fs = require('fs');
    var exists = fs.exists || path.exists;

    exists('bin/cmd.js', function (ex) {
      var bin;

      if (ex) {
        bin = {};
        bin[basename.replace(/^node-/, '')] = 'bin/cmd.js';
      }

      cb(null, bin);
    });
  },
  'directories': {},
  'dependencies': function(cb) {
    var deps;

    if(_.isArray(npm)) {
      deps = _.mapValues(
        _.mapKeys(npm, function(v) { return v; }),
        _.constant('*')
      );
    }
    else if(_.isObject(npm)) {
      deps = npm;
    }

    cb(null, deps || {});
  },
  'devDependencies': {},
  'scripts': {},
  'repository': {
    'type': 'git',
    'url': prompt('Repository')
  },
  'homepage': prompt('Homepage'),
  'keywords': prompt(function (s) { return s.split(/\s+/); }),
  'author': {
    'name': prompt('Author name', _.capitalize(path.basename(os.homedir()))),
    'email': prompt('Author email', ''),
    'url': prompt('Author website', '')
  },
  'license': prompt('license', 'MIT'),
  'engine': {
    'node': (function() { return process.version; })()
  }
});