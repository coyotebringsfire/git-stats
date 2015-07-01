var Q=require('q'),
    nr=require('noderank'),
    async=require('async'),
    EventEmitter = require('events').EventEmitter,
    noderank=require('noderank-nightly'),
    child_process=require('child_process');

var xuexi=function() {
  var debug=require('debug')('xuexi'),
      self=this, children=[], childrenPromises=[], numChildren=1, i;
  self.all_modules={};
  EventEmitter.call(this);
  //calculate NodeRank for all the npm modules
  debug("calculating NodeRank");
  //getting details for all modules
  for( i=0; i<numChildren; i++) {
    childrenPromises.push( Q.defer() );
    children.push( child_process.fork('lib/xuesheng') );
  }
  var allModuleNames=Object.keys(noderank), jobsPerChild=Math.floor(allModuleNames.length/numChildren);
  for( i=0; i<numChildren; i++) {
    children[i].send(allModuleNames.slice(i*jobsPerChild, i*jobsPerChild+jobsPerChild));
    children[i].on('message', function(msg) {
      if(!msg.err) {
        self.all_modules[msg.module]=msg.details;
      }
    });
    children[i].on('exit', function() {
      childrenPromises.pop().resolve("SUCCESS");
    });
  }
  childrenPromises.push( Q.defer() );
  children.push( child_process.fork('lib/xuesheng') );
  children[children.length-1].send(allModuleNames.slice(jobsPerChild*numChildren, allModuleNames.length));
  children[children.length-1].on('message', function(msg) {
    if(!msg.err) {
      self.all_modules[msg.module]=msg.details;
    }
  });
  children[children.length-1].on('exit', function() {
    childrenPromises.pop().resolve("SUCCESS");
  });

  Q.all(childrenPromises)
    .then(function onAllModuleDetailsGotten(err) {
      var debug=require('debug')('xuexi:onAllModuleDetailsGotten');
      debug("cloning repos");
      async.eachLimit( Object.keys(rankedModules), 10, function forEachModule(module, finished) {
        var debug=require('debug')('xuexi:onAllModuleDetailsGotten:forEachModule');
        debug("%s, %j", module, self.all_modules[module].repository);
        //self.emit("learning");
        // TODO clone the associated git repository
        if( self.all_modules[module].repository && self.all_modules[module].repository.type==="git" ) {
          debug("cloning %s", self.all_modules[module].repository.url );
          // TODO analyze git repo
          debug("training");
          // TODO delete repo
          debug("deleting repo");
        }
        finished();
      }, function afterAllModules(err) {
        var debug=require('debug')('xuexi:onAllModuleDetailsGotten:afterAllModules');
        if(err) return self.emit("error", err);
        self.emit("ready");
      });
    });
    /*
  async.eachLimit(Object.keys(noderank), 10, function getDetailsForEachModule(module, finishedGettingDetails) {
    var debug=require('debug')('xuexi:getDetailsForEachModule');
    debug("getting details for %s", module);
    //TODO replace with forks to do the work
    //assign modules in a round-robin
    /*
    nr.npmStats.get(module)
      .then(function onGetResolved(details) {
        var debug=require('debug')('xuexi:getDetailsForEachModule:onGetResolved');
        self.all_modules[module]={
          starred: details.starred,
          repository: details.repository,
          contributors: details.contributors,
          test: details.scripts.test ? true : false
        };
        self.all_modules[module].noderank=noderank[module];
        debug("%s %j", module, self.all_modules[module]);
        finishedGettingDetails();
      }, function onGetRejected(err) {
        var debug=require('debug')('xuexi:getDetailsForEachModule:onGetRejected');
        debug("%s get rejected", module);
        finishedGettingDetails();
      });
  }, function onAllModuleDetailsGotten(err) {
    var debug=require('debug')('xuexi:onAllModuleDetailsGotten');
    debug("cloning repos");
    async.eachLimit( Object.keys(rankedModules), 10, function forEachModule(module, finished) {
      var debug=require('debug')('xuexi:onAllModuleDetailsGotten:forEachModule');
      debug("%s, %j", module, self.all_modules[module].repository);
      //self.emit("learning");
      // TODO clone the associated git repository
      if( self.all_modules[module].repository && self.all_modules[module].repository.type==="git" ) {
        debug("cloning %s", self.all_modules[module].repository.url );
        // TODO analyze git repo
        debug("training");
        // TODO delete repo
        debug("deleting repo");
      }
      finished();
    }, function afterAllModules(err) {
      var debug=require('debug')('xuexi:onAllModuleDetailsGotten:afterAllModules');
      if(err) return self.emit("error", err);
      self.emit("ready");
    });
  });
*/
}
util.inherits(xuexi, EventEmitter);

module.exports=xuexi;