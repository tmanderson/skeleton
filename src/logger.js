'use strict';

var _ = require('lodash');
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

function colorTmp(color, text) {
  return _.template('\x1B[{{color}}m{{text}}\x1B[0m')({ color: color, text: text });
}

function red(label) {
  return colorTmp(31, label);
}

function green(label) {
  return colorTmp(32, label);
}

_.extend(module.exports, {
  log: function() {
    if(args.silent) return;
    console.log.apply(console, arguments);
  },

  success: function(label) {
    if(args.silent) return;
    console.log.apply(console, [green(label)].concat(_.toArray(arguments).slice(1)));
  },

  error: function(label) {
    if(args.silent) return;
    console.log.apply(console, [red(label)].concat(_.toArray(arguments).slice(1)));
  }
});