var nr=require('noderank'),
    async=require('async'),
    clone = require('./git.clone'),
    getCommits = require('./git.getCommits'),
    processCommits = require('./git.processCommits'),
    deleteRepo = require('./git.deleteRepo'),
    fs=require('fs-plus'),
    util=require('util'),
    rimraf=require('rimraf');

process.on('message', function onChildMessageReceived(msg) {
  var debug=require('debug')('xuexi:xuesheng:onChildMessageReceived');
  debug("msg= %j", msg);
  async.eachLimit(msg, 1, function forEachModule(module, nextModule) {
    debug("getting details for %s", module);
    nr.npmStats.get(module)
      .then(function onGetResolved(details) {
        var debug=require('debug')('xuexi:xuesheng:onChildMessageReceived:onGetResolved');
        var module_details={
          starred: details.starred,
          repository: details.repository,
          contributors: details.contributors,
          test: details.scripts.test ? true : false
        };
        debug("%s %j", module, module_details);
        // clone the git repo
        if( module_details.repository && module_details.repository.type === "git" ) {
          debug("cloning repo %s", module_details.repository.url);
          clone(module_details.repository.url, {targetDirectory:"/tmp/xuexi"})
            .then(function onCloneResolved(results) {
              var debug=require('debug')('xuexi:xuesheng:onChildMessageReceived:onGetResolved:onCloneResolved'), repoPath=util.format("/tmp/xuexi/%s", module);
              //TODO analyze git repo
              debug("analyzing repo at %s", repoPath);
              // delete git repo
              debug("deleting repo %s", repoPath);
              deleteRepo(repoPath)
                .then(function() {
                  debug("finished deleting file");
                  nextModule();
                }, function(err) {
                  debug("error deleting file %j", err);
                  nextModule();
                });
            }, function onCloneRejected(err) {
              debug(err);
              debug("deleting repo %s", repoPath);
              deleteRepo(repoPath)
                .then(function() {
                  debug("finsished deleting file");
                  nextModule();
                }, function(err) {
                  debug("error deleting file %j", err);
                  nextModule();
                });
            });
        } else {
          nextModule();
        }
      }, function onGetRejected(err) {
        var debug=require('debug')('xuexi:xuesheng:onChildMessageReceived:onGetRejected');
        debug("%s get rejected", module);
        process.send({module: module, err: err});
        nextModule();
      });
  }, function afterAllDetailsAreGotten() {
    process.exit();
  });
});
