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
  if( !(msg instanceof Array) ) {
    process.send({err:new Error("invalid message received")});
  } else {
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
            var Git=require('./git'),
                git=new Git(module_details.repository.url);
            debug("cloning repo %s", module_details.repository.url);
            git.clone()
              .then(git.getCommits)
              .then(git.processCommits)
              .then(function onRepoProcessed(results) {
                //TODO save the results and delete the repo
                git.deleteRepo()
                  .then(function() {
                    process.send({module: module, results: results})
                    nextModule();
                  });
              }, function(err) {
                debug("error cloning/processing/deleting repo %j", err);
                process.send({module: module, err: err});
                nextModule();
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
  }
});
