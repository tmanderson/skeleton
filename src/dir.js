'use strict';

var _ = require('lodash');

_.mixin({
  typeof: function(val) {
    if(_.isArray(val)) return 'array';
    if(_.isNumber(val)) return 'number';
    if(_.isString(val)) return 'string';
    if(_.isObject(val)) return 'object';
    return null;
  }
});

var fs = require('fs');
var path = require('path');
var logger = require('./logger');
var request = require('request');
var parser = require('./parsers');

var schema;
var basePath = process.cwd();

try {
  schema = JSON.parse(fs.readFileSync(args.fs[0]))
} catch(e) {
  schema = parser.toJSONSchema(fs.readFileSync(args.fs[0]).toString());
}

function writeFileSync(path, contents) {
  logger.success('[Create]', path);
  if(args.nowrite) return;
  fs.writeFileSync(path, contents);
}

function createFile(filePath, name, val) {
  var fullPath;

  if(!(_.isString(filePath) && _.isString(name))) return;

  if(/^(http|www\.)/.test(name)) {
    fullPath = path.join(filePath, name.split('/').pop());
    request.get(name, function(err, res, body) {
      if(!err) {
        writeFileSync(fullPath, body);
      }
    });
  }
  else {
    // console.log(filePath, name, val);
    writeFileSync(path.join(filePath, name), val || '');
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
  if(fs.existsSync(path.join(filePath, name))) return;
  logger.success('[Create]', path.join(filePath, name));
  if(args.nowrite) return;
  fs.mkdirSync(path.join(filePath, name));
}

function parseDirectorySchema(schema, dir) {
  console.log(schema, dir);
  _.forIn(schema, function(val, name) {
    switch(_.typeof(val)) {
      case 'string':
        if(name === '.') return parseDirectorySchema(val, dir);

        createFile(dir, name, val);
      break;
      case 'object':
        if(name !== '.') createDirectory(dir, name);
        parseDirectorySchema(val, path.join(dir, name));
      break;
      case 'array' :
        createDirectory(dir, name);
        _.each(_.filter(val), _.partialRight(_.ary(_.partial(createFile, path.join(dir, name)), 1)));
      break;
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