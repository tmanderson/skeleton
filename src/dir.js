'use strict';

module.exports = {
  run: function() {
    var schema = fsutil.readJSON(args.fs[0]);
    var deferred = q.defer();

    createRoot(process.cwd());
    q.all(parseDirectorySchema(schema, process.cwd())).then(deferred.resolve);

    return deferred.promise;
  }
};