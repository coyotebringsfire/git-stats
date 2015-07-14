"use strict";
var gitHistory=require('git-history'), 
    Commit=require('./Commit');

process.on('message', function onChildMessageReceived(msg) {
  var history=gitHistory(), commits={}, _this=this, repoDir=msg.repo;
  var log = require('./logger')(msg.module);

  process.chdir(repoDir);
  function onCommitEventHandler(_commit) {
    var commit=_commit;
    if(commit) {
      commits[commit.hash] = new Commit(commit);
    } else {
      log.info("null commit history");
    }
  }
  // Listen for commit events from the history.
  history.on("data", onCommitEventHandler);
  
  function onHistoryEnd() {    
    log.info({commits:Object.keys(commits)}, "history end");
    
    log.info("resolving commitPromise");
    process.send(commits);
    process.exit();
  }

  history.on('end', onHistoryEnd);  
});
