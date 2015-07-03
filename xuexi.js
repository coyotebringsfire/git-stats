var Q=require('q'),
    nr=require('noderank'),
    async=require('async'),
    EventEmitter = require('events').EventEmitter,
    noderank=require('noderank-nightly'),
    child_process=require('child_process');

function xuexi() {
  var debug=require('debug')('xuexi'),
      self=this, children=[], childrenPromises=[], numChildren=1, i, all_results=[], allModuleNames=[], jobsPerChild;
  self.all_modules={};
  EventEmitter.call(this);
  //getting details for all modules
  debug("forking");

  debug("bucketifying");
  buckets=noderank.bucketify();
  debug("buckets %j", buckets);
  for( m in buckets[2] ) {
    allModuleNames.push(buckets[2][m].module)
  }
  debug("%j", allModuleNames);

  async.eachLimit(allModuleNames, 1, function(moduleName, doneWithFork) {
    var child=child_process.fork('lib/xuesheng');
    child.on('exit', function onChildExit() {
      debug("fork exit");
      doneWithFork();
    });
    child.on('error', function onChildError(err) {
      debug("child error %j", msg);
      doneWithFork();
    });
    child.on('message', function onChildMessage(msg) {
      debug("received message from child %j", msg);
      if(!msg.err) {
        self.all_modules[msg.module]=msg.results;
      }
      doneWithFork();
    });
    child.send(moduleName);
  }, function doneLearning(err) {
    debug("self.all_modules %j", self.all_modules);
    if(err) return self.emit("error", err);
    self.emit("ready");
  });
}
util.inherits(xuexi, EventEmitter);

module.exports=xuexi;