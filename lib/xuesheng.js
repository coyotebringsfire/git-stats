"use strict";
var nr=require('noderank'),
    async=require('async'),
    fs=require('fs-plus'),
    util=require('util'),
    rimraf=require('rimraf');

process.on('message', function onChildMessageReceived(msg) {
  if( !msg || msg instanceof Array || !msg.module ) {
    process.send({err:new Error("invalid message received")});
  } else {
    var log = require('./logger')(msg.module), module=msg.module;
    log.info({cwd:process.cwd(), message:msg}, "incoming message");
    nr.npmStats.get(module)
      .then(function onGetResolved(details) {
        var module_details={
          starred: details.starred,
          repository: details.repository,
          contributors: details.contributors,
          test: details.scripts.test ? true : false
        };
        log.info({cwd:process.cwd(), module:module, repo:module_details.repository}, "details");
        // clone the git repo
        if( module_details.repository && module_details.repository.type === "git" ) {
          var Git=require('./git'),
              git=new Git(module_details.repository.url, module);
          log.info({cwd:process.cwd(), url:module_details.repository.url, home:git.xuexi_home}, "cloning repo");
          process.chdir("/tmp");
          git.clone()
            .then(function onCloneResolved() {
              log.info({cwd:process.cwd(), dir:git.gitDir}, "getting commits");
              process.chdir(git.gitDir);
              return git.getCommits();
            })
            .then(function onGetCommitsResolved() {
              log.info({cwd:process.cwd(), commit:git.commits}, "processing commits");
              return git.processCommits();
            })
            .then(function onProcessCommitsResolved() {
              process.chdir(git.xuexi_home);
              log.info({xuexi_home:git.xuexi_home, cwd:process.cwd()}, "processCommits done");
              // save the results and delete the repo
              git.deleteRepo()
                .then(function() {
                  process.send({module: module, results: git.processedCommits})
                  process.exit();
                });
            }, function onProcessCommitsRejected(err) {
              log.fatal({cwd:process.cwd(), err:err}, "error cloning/processing/deleting repo");
              process.log({cwd:process.cwd()}, "deleting repo");
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
        log.debug({cwd:process.cwd(), module:module}, "get rejected");
        process.send({module: module, err: err});
        process.exit();
      });
  }
});
