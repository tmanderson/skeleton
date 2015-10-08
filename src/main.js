'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var args = require('./args');

console.log(fs.readFileSync('./src/data/banner.txt').toString());

var skeletonPaths = [ './src/commands' ];

if(process.env.SKELETON_COMMAND_PATH) {
  skeletonPaths = skeletonPaths.concat(process.env.SKELETON_COMMAND_PATH.split(':'));
}

skeletonPaths = _.map(skeletonPaths, function(dirPath) {
  return path.resolve(dirPath);
});

function Skeleton(config) {
  _.each(
    args(process.argv, _.extend(config, { commands: this.commands })),
    function(args, cmd) {
      if(this.commands[cmd]) {
        _.extend(this.commands[cmd], { args: args }).run();
      }
    },
    this
  );
}

_.extend(Skeleton.prototype, {
  utils: {
    file: require('./util/fs')
  },

  logger: require('./logger'),

  commands: (function() {
    var commands = _.flatten(
      _.map(skeletonPaths, function(dirPath) {
        return _.map(fs.readdirSync(dirPath), function(filePath) {
          return path.join(dirPath, filePath);
        });
      })
    );

    return _.mapValues(
      _.mapKeys(commands, function(name) {
        return name.split('/').pop().split('.').shift();
      }),
      function(name) {
        return require(name);
      }
    );
  })()
});

global.skeleton = new Skeleton({
  flags: {
    name: {
      alias: ['t', 'name'],
      type: String,
      description: 'Name of the project being created',
      default: __dirname
    },

    silent: {
      alias: ['s', 'silent'],
      type: Boolean,
      default: false
    },

    overwrite: {
      alias: ['o', 'overwrite'],
      type: Boolean,
      default: false
    },

    nowrite: {
      alias: [ 'x', 'nowrite' ],
      type: Boolean,
      default: false
    }
  }
});