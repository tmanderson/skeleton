'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var logger = require('../logger');

function isDir(path) {
  return fs.statSync(path).isDirectory();
}

function deleteFileResource(path) {
  if(isDir(path)) {
    logger.error('[Delete]', path);
    if(args.nowrite) return;
    recursiveDelete(path);
  }
  else {
    logger.error('[Delete]', path);
    if(args.nowrite) return;
    fs.unlinkSync(path);
  }
}

function recursiveDelete(base) {
  var filePath;

  _.each(fs.readdirSync(base), function(name) {
    filePath = path.join(base, name);
    deleteFileResource(path.join(base, name), true);
  });

  if(args.nowrite) return;
  fs.rmdirSync(base);
}

module.exports = _.extend({
  exists: function(path) {
    return fs.existsSync(path);
  },

  writeFile: function writeFileSync(path, contents) {
    logger.success('[Create]', path);
    if(args.nowrite) return;
    fs.writeFileSync(path, contents);
  },

  writeJSON: function writeJSONSync(path, json) {
    this.writeFile(path, JSON.stringify(json));
  },

  readFile: function readFileSync(path) {
    return fs.readFileSync(path);
  },

  readJSON: function readJSONSync(path) {
    return JSON.parse(this.readFile(path));
  },

  delete: function(path, recursive) {
    if(recursive) return recursiveDelete(path);
    return deleteFileResource(path);
  }
});