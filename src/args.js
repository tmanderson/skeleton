'use strict';

var _ = require('lodash');

function spaces(maxWidth) {
  return _.map(_.range(maxWidth), _.constant(' '));
}

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

function parseCommands(rawArgs, opts) {
  var args = {};
  var flagRE = /\s(?=-)/;
  
  _.each(
    _.filter(rawArgs.join(' ').split(flagRE), function(v) {
      return !(v.charAt(0) === '-');
    }),
    function(value, i) {
      var vals = _.trim(value).split(' ');
      var name = _.keys(opts)[i];
      var config = opts[name];
      args[name] = vals;
    }
  );

  return args;
}

function parseArgs(argv, opts) {
  var cmds;

  // help
  if(argv.indexOf('-h') > -1 || argv.indexOf('--help') > -1) {
    process.stdout.write('\x1B[1;33mUsage:\x1B[0m\n\n  \x1B[34mskeleton\x1B[0m <command>');
    process.stdout.write('\n\n');

    console.log('\x1B[1;33mCommands:\x1B[0m\n');
    _.forIn(opts.commands, function(v, k) {
      console.log('  \x1B[34m%s\x1B[0m%s',
        v.name || k,
        ' <' + _.keys(v.args).join('>, ') + '>'
      );
    });
    
    console.log('\n\x1B[1;33mOptions:\x1B[0m\n');

    _.forIn(opts.flags, function(v, k) {
      cmds = _.map(v.alias, function(v) {
        if(v.length === 1) return '-' + v;
        return '--' + v;
      }).join(', ');

      cmds += spaces(18).slice(cmds.length).join('') + '<' + v.type.name + '>';

      console.log('  %s%s%s',
        cmds,
        spaces(30).slice(cmds.length).join(''),
        (v.description || '')
      );
    });

    process.exit(0);
  }

  var commands = {};
  var args, command, cconfig;

  _.each(
    _.map(argv.slice(2).join(' ').split(';'), _.trim),
    function(value) {
      args = value.split(' ');
      command = args.shift();
      cconfig = opts.commands[command];
      
      commands[command] = _.merge(
        parseFlaggedArgs(args, _.extend(opts.flags, cconfig.flags || {})),
        {
          args: _.mapValues(cconfig.args, function(arg, i) {
            return args[i];
          })
        }
      );
    }
  );

  return commands;
}

module.exports = parseArgs;