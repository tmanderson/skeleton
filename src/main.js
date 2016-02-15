'use strict';

global.args = require('./args')(process.argv, {
  args: {
    fs: {
      required: true,
      type: String
    }
  },

  flags: {
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
    },

    root: {
      alias: ['c', 'create-root'],
      type: String,
      description: 'Create the project directory'
    },

    npm: {
      alias: ['n', 'npm'],
      type: Array,
      action: {
        before: function() {},
        exec: 'npm i {{value}}'
      }
    },

    bower: {
      alias: ['b', 'bower'],
      type: Array,
      action: {
        before: function() {},
        exec: 'bower i {{value}}'
      }
    }
  }
});


require('./dir');
require('./deps');
