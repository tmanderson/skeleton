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
var logger = require('../logger');
var request = require('request');

function determineTabSize(fileContents) {
  var tabs = fileContents.match(/^\t+/gm);
  var spaces = fileContents.match(/^\s+/gm);
  var val = 0;

  if(tabs && tabs.length === lines.length) {
    return 1;
  }

  spaces.sort(function(a,b) {
    if(a.length < b.length) return -1;
    if(b.length > a.length) return 1;
    return 0;
  });

  return _.reduce(spaces.slice(1), function(tabSize, space) {
    if(space.length%tabSize > 0) {
      return undefined;
    }
    else {
      return tabSize;
    }
  }, spaces[0].length);
}

function isFileName(line) {
  return !/\/\s*$/.test(line);
}

module.exports = {
  toJSONSchema: function(source) {
    var dir = [];
    var schema = { '.': [] };
    var indentSize = determineTabSize(source);

    return _.reduce(source.split('\n'), function(schema, line, i) {
      var indent = line.match(new RegExp('(\\s{' + indentSize + '})+', 'g')) || [];
      var depth = (indent[0] && indent[0].length || 0)/indentSize;

      while(depth < dir.length) dir.pop();

      if(indent.length === 0) {
        if(isFileName(line)) {
          schema['.'].push(_.trim(line));
        }
        else {
          dir = [ _.trim(line.replace('/', '')) ];
          _.set(schema, dir[0], { '.': [] });
        }
      }
      else {
        if(isFileName(line)) {
          _.get(schema, dir.join('.'))['.'].push(_.trim(line));
        }
        else if(depth === dir.length) {
          dir.push(_.trim(line.replace('/', '')));
          _.set(schema, dir.join('.'), { '.': [] });
        }
      }

      return schema;
    }, schema);
  }
};