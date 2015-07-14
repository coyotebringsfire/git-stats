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
  if( typeof msg != 'object' ) {
    process.send({err:new Error("invalid message received")});
  } else {
    var log = require('./logger')(msg.module), module=msg.module;
    log.info({cwd:null, message:msg}, "incoming message");
    nr.npmStats.get(module)
      .then(function onGetResolved(details) {
        var module_details={
          starred: details.starred,
          repository: details.repository,
          contributors: details.contributors,
          test: details.scripts.test ? true : false
        };
        log.info({cwd:null, module:module, repo:module_details.repository}, "details");
        // clone the git repo
        if( module_details.repository && module_details.repository.type === "git" ) {
          var Git=require('./git'),
              git=new Git(module_details.repository.url, module);
          log.info({cwd:null, url:module_details.repository.url, home:git.xuexi_home}, "cloning repo");
          process.chdir("/tmp");
          git.clone()
            .then(function onResolve() {
              log.info({cwd:null, dir:git.gitDir}, "getting commits");
              process.chdir(git.gitDir);
              return git.getCommits();
            })
            .then(function onResolve() {
              log.info({cwd:null, commit:git.commits}, "processing commits");
              //process.chdir(git.gitDir);
              return git.processCommits();
            }, function onRejected(err) {
              log.fatal({cwd:null, err:err}, "getCommits rejected");
            })
            .then(function onRepoProcessed() {
              // save the results and delete the repo
              log.info({processedCommits:git.processedCommits, cwd:null}, "processedCommits");
              process.chdir("/tmp/");
              git.deleteRepo()
                .then(function() {
                  process.send({module: module, results: git.processedCommits})
                  process.exit();
                });
            }, function onRejected(err) {
              log.fatal({cwd:null, err:err}, "error cloning/processing/deleting repo");
              process.chdir("/tmp/");
              git.deleteRepo()
                .then(function() {
                  process.send({module: module, err: err});
                  process.exit();
                });
            });
        } else {
          process.exit();
        }
      }, function onGetRejected(err) {
        log.debug({cwd:null, module:module}, "get rejected");
        process.send({module: module, err: err});
        process.exit();
      });
  }
});
