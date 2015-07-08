"use strict";
var gitHistory=require('git-history'), 
    Commit=require('./Commit'),
    debug=require('debug')('xuexi:gitHelper');

process.on('message', function onChildMessageReceived(msg) {
  var history=gitHistory(), commits={}, _this=this, repoDir=msg.repo;
  debug("repoDir %j", msg.message);
  process.chdir(repoDir);
  function onCommitEventHandler(_commit) {
    var debug=require('debug')('xuexi:gitHelper:onCommitEventHandler'), commit=_commit;
    if(commit) {
      commits[commit.hash] = new Commit(commit);
    } else {
      debug("null commit history");
    }
  }
  // Listen for commit events from the history.
  history.on("data", onCommitEventHandler);
  
  function onHistoryEnd() {
    var debug=require('debug')('xuexi:git:getCommits:onResolveGetMasterCommit:onHistoryEnd');
    
    debug("history end %s", Object.keys(commits));
    
    debug("all commits:\n%j", commits);
    debug("resolving commitPromise");
    _this.rawCommits=commits;
    process.send(commits);
    process.exit();
  }

  history.on('end', onHistoryEnd);  
});
