'use strict';

var promzard = require('promzard');
var logger = require('./logger');
var path = require('path');
var fsutil = require('./util/fs');

module.exports = {
  run: function() {
    if(!fsutil.exists(path.join(__dirname, 'package.json'))) {
      if(args.npm) {
        promzard(
          path.resolve('./src/data/npm.js'),
          _.extend(args, { keys: 'NPM' }),
          function(err, data) {
            if(err) return logger.error(err.message);
            fsutil.writeJSON(path.join(process.cwd(), 'package.json'), data);
          }
        );
      }
    }

    if(!fsutil.exists(path.join(__dirname, 'bower.json'))) {
      if(args.bower) {

      }
    }
  }
};