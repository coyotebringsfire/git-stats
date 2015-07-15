"use strict";
var rimraf=require('rimraf'),
    async=require('async'),
    Q=require('q');

module.exports=function deleteRepo() {
  var deletePromise=Q.defer(), _this=this;
  var log = require('./logger')(_this.module), repo;
  log.info({repo:_this.gitDir, cwd:process.cwd()}, "deleting repo");
  repo = _this.gitDir;
  if(!repo ) {
    async.setImmediate(function immediately() {
      log.error({cwd:process.cwd(), err:new Error("repo has not been cloned")}, "error");
      deletePromise.reject(new Error("repo has not been cloned"));
    });
  } else {
    log.info({cwd:process.cwd()}, "really deleting now");
    rimraf(repo, function(err) {
      log.info({cwd:process.cwd()}, "DELETE DONE");
      if(err) {
        log.error({cwd:process.cwd(), err:err}, "error");
        deletePromise.reject(err);
      } else {
        deletePromise.resolve({});      
      }
  
    });
  }
  return deletePromise.promise;
}