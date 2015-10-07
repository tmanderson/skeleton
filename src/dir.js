'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var logger = require('./logger');
var request = require('request');

var schema = JSON.parse(fs.readFileSync(args.fs[0]));
var basePath = process.cwd();

function writeFileSync(path, contents) {
  logger.success('[Create]', path);
  if(args.nowrite) return;
  fs.writeFileSync(path, contents);
}

function createFile(filePath, name, val) {
  var fullPath;
  if(!(_.isString(filePath) && _.isString(name))) return;

  fullPath = path.join(filePath, name);

  if(/^(http|www\.)/.test(val)) {
    request.get(val, function(err, res, body) {
      if(!err) {
        writeFileSync(fullPath, body);
      }
    });
  }
  else {
    writeFileSync(fullPath, val);
  }
}

function recursiveDelete(base) {
  var filePath;

  _.each(fs.readdirSync(base), function(name) {
    filePath = path.join(base, name);

    if(fs.statSync(filePath).isDirectory()) {
      logger.error('[Delete]', filePath);
      recursiveDelete(filePath);
    }
    else {
      logger.error('[Delete]', filePath);
      fs.unlinkSync(filePath);
    }
  });

  fs.rmdirSync(base);
}

function createDirectory(filePath, name) {
  logger.success('[Create]', path.join(filePath, name));
  if(args.nowrite) return;
  fs.mkdirSync(path.join(filePath, name));
}

function parseDirectorySchema(schema, dir) {
  _.forIn(schema, function(val, name) {
    if(name !== '.' && (_.isObject(val) || _.isArray(val))) {
      createDirectory(dir, name);

      if(_.isArray(val)) {
        _.each(val, _.partialRight(_.partial(createFile, path.join(dir, name))));
      }
      else {
        parseDirectorySchema(val, path.join(dir, name));
      }
    }
    else if(name === '.') {
      _.each(val, function(val, name) {
        if(!_.isString(name)) return createFile(dir, val, '');
        createFile(dir, name, val);
      });
    }
    else {
      createFile(dir, name, val);
    }
  });
}

function createRoot() {
  if(!args.root) return;
  if(args.overwrite) recursiveDelete(path.join(process.cwd(), args.root));

  createDirectory(basePath, args.root);
  logger.log('[  cd  ]', path.join(process.cwd(), args.root));
  basePath = path.join(basePath, args.root);
  if(args.nowrite) return;
  process.chdir(path.join(process.cwd(), args.root));
}

createRoot();
parseDirectorySchema(schema, basePath);