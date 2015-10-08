'use strict';

var _ = require('lodash');
var q = require('q');
var path = require('path');
var request = require('request');

module.exports = Object.create({
  name: 'Create',
  description: 'Creates files and directories',
  type: String,

  args: [
    {
      name: 'name',
      description: 'The name of the project being created',
      type: String
    },
    {
      name: 'path',
      description: 'file path to directory structure',
      type: String
    }
  ],

  run: function createCommand() {
    if(__dirname !== this.args.name &&
      !skeleton.utils.file.exists('./' + this.args.name)) {

      this.createRoot();
    }

    process.chdir(path.join(process.cwd(), this.args.name));
  },

  createFile: function createFile(filePath, name, val) {
    var deferred = q.defer();
    var fullPath;

    if(!(_.isString(filePath) && _.isString(name))) return;

    fullPath = path.join(filePath, name);

    if(/^(http|www\.)/.test(val)) {
      request.get(val, function(err, res, body) {
        if(!err) fsutil.writeFile(fullPath, body);
        deferred.resolve();
      });
    }
    else {
      fsutil.writeFile(fullPath, val);
      deferred.resolve();
    }

    return deferred.promise;
  },

  createDirectory: function createDirectory(filePath, name) {
    skeleton.logger.success('[Create]', path.join(filePath, name));
    if(this.args.nowrite) return;
    fs.mkdirSync(path.join(filePath, name));
  },

  parseSchema: function parseDirectorySchema(schema, dir) {
    var promises = [];

    _.forIn(schema, function(val, name) {
      if(name !== '.' && (_.isObject(val) || _.isArray(val))) {
        this.createDirectory(dir, name);

        if(_.isArray(val)) {
          promises = promises.concat(
            _.map(val,
              _.partialRight(
                _.partial(this.createFile, path.join(dir, name))
              )
            )
          );
        }
        else {
          return parseDirectorySchema(val, path.join(dir, name));
        }
      }
      else if(name === '.') {
        _.each(val, function(val, name) {
          if(!_.isString(name)) return this.createFile(dir, val, '');
          promises.push(this.createFile(dir, name, val));
        });
      }
      else {
        promises.push(this.createFile(dir, name, val));
      }
    });

    return promises;
  },

  createRoot: function createRoot() {
    var basePath = process.cwd();

    if(this.args.overwrite) {
      skeleton.utils.file.delete(path.join(process.cwd(), this.args.name), true);
    }

    this.createDirectory(basePath, this.args.name);
    skeleton.logger.log('[  cd  ]', path.join(process.cwd(), this.args.name));
    basePath = path.join(basePath, this.args.name);

    if(this.args.nowrite) return;
    process.chdir(path.join(process.cwd(), this.args.name));
  }
});