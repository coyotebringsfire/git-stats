var Q=require('q'),
	async=require('async'),
	merge=require('merge'),
	child_process=require('child_process'),
	run=require('comandante');

module.exports=function doClone(_options) {
	var defaultOptions = {
			targetDirectory:"/tmp"
		}, doClonePromise=Q.defer(), options = defaultOptions, repo=this.repo, _this=this;
  var log = require('./logger')(_this.module);

	if( _options ) {
		log.trace("merging options");
		merge(options, _options);
		log.trace("merged options %j", options);
	}

	log.info("repo %s %j", repo, options);

	if(!repo) {
		async.setImmediate(function onError() {
      log.error(new Error("missing required repo url"));
			doClonePromise.reject(new Error("missing required repo url"));
		});
		return doClonePromise.promise;
	}
	//if targetDirectory ends in a /, remove it
	log.info("targetDirectory %s", options.targetDirectory);
	if( options.targetDirectory.match(/\/$/) ) {
		options.targetDirectory=options.targetDirectory.slice(0, options.targetDirectory.length-1);
	}
	// run git clone
	var repoMatch=repo.match(/.+\/([^\.]*)/);
	if( !repoMatch ) {
    log.error(new Error("repo string didn't match required format\n(http[s])|(git):\/\/([^\/]+)\/([^\/]+)\/(.+)(\.git)|()"));
		return doClonePromise.reject(new Error("repo string didn't match required format\n(http[s])|(git):\/\/([^\/]+)\/([^\/]+)\/(.+)(\.git)|()"));
	}
	var repoName=repoMatch[1];
  if( !repoName ) {
    log.warn("repoName undefined %s", repoMatch[0])
  }
  log.info("repoMatch %j", repoMatch);
  _this.gitDir=options.targetDirectory+"/"+repoName;
  log.info("cloning: git %s", ["clone", "https"+repo.match(/(:.*)/)[1], _this.gitDir].join(' '));
  // pass env:{"GIT_TERMINAL_PROMPT":"0"} to disable all prompting
	var gc=run('git', ["clone", "https"+repo.match(/(:.*)/)[1], _this.gitDir], {env:{"GIT_TERMINAL_PROMPT":"0"}});
	gc.response="";
  gc.on('error', function onError(msg) {
    log.error(new Error("child error: %s", msg.message));
    doClonePromise.reject(new Error(msg));
  });
	gc.on('data', function onData(data) {
		gc.response+=data;
	});
	gc.on('end', function onEnd(err) {
    if (err) {
      log.error({stderr:stderr}, err);
      return doClonePromise.reject(new Error(err));
    }
    log.info("clone done");
    log.info("response %j", gc.response);
    _this.getCommits=require('./git.getCommits');
    _this.deleteRepo=require('./git.deleteRepo');
    doClonePromise.resolve("");
	});

	return doClonePromise.promise;
};
