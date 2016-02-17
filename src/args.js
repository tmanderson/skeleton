'use strict';

var _ = require('lodash');
var anonArgRE = /(?:^|\s|"|')([\.a-zA-Z0-9]+)(?:$)?/g;

function parseFlaggedArgs(rawArgs, opts) {
  var args = {};

  _.each(
    rawArgs.join(' ').split(/\s-{1,2}(?=\w)/),
    function(value) {
      var vals = _.trim(value).split(' ');
      var opt = vals.shift().replace('-', '');

      _.each(opts, function(config, full) {
        if(config.alias.indexOf(opt) > -1) {
          switch(config.type) {
            case Boolean:
              args[full] = !!vals;
            break;
            case Array:
              args[full] = vals;
            break;
            case String:
              args[full] = vals.join(' ').toString();
            break;
            default:
              args[full] = vals.length && vals || config.default;
          }
        }
      });
    }
  );

  // add any default values for args that weren't supplied
  return _.defaults(args,_.mapValues(opts, function(v) {
    if(!_.isUndefined(v.default)) return v.default;
    return undefined;
  }));
}

function parseAnonymousArgs(rawArgs, opts) {
  var argMatch;
  var args = {};

  _.each(rawArgs.join(' ').match(anonArgRE), function(value, i) {
      var vals = _.trim(value).split(' ');
      var name = _.keys(opts)[i];
      var config = opts[name];
      args[name] = vals;
    }
  );

  return args;
}

function parseArgs(argv, opts) {
  return _.merge(
    parseAnonymousArgs(argv.slice(2), opts.args),
    parseFlaggedArgs(argv.slice(2), opts.flags)
  );
}

module.exports = parseArgs;