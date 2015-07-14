var Q=require('q'),
	async=require('async'),
	merge=require('merge'),
	child_process=require('child_process'),
	run=require('comandante'),
  util=require('util');

module.exports=function doClone(_options) {
	var defaultOptions = {
			targetDirectory:"/tmp"
		}, doClonePromise=Q.defer(), options = defaultOptions, repo=this.repo, _this=this;
  var log = require('./logger')(_this.module);

	if( _options ) {
		log.trace({cwd:process.cwd()}, "merging options");
		merge(options, _options);
		log.trace({cwd:process.cwd(), options:options}, "merged options");
	}

	log.info({cwd:process.cwd(), repo:repo, options:options}, "repo");

	if(!repo) {
		async.setImmediate(function onError() {
      log.error({cwd:process.cwd()}, new Error("missing required repo url"));
			doClonePromise.reject(new Error("missing required repo url"));
		});
		return doClonePromise.promise;
	}
	//if targetDirectory ends in a /, remove it
	log.info({cwd:process.cwd(), dir:options.targetDirectory}, "targetDirectory");
	if( options.targetDirectory.match(/\/$/) ) {
		options.targetDirectory=options.targetDirectory.slice(0, options.targetDirectory.length-1);
	}
	// run git clone
	var repoMatch=repo.match(/.+\/([^\.]*)/);
	if( !repoMatch ) {
    log.error({cwd:process.cwd()}, new Error("repo string didn't match required format\n(http[s])|(git):\/\/([^\/]+)\/([^\/]+)\/(.+)(\.git)|()"));
		return doClonePromise.reject(new Error("repo string didn't match required format\n(http[s])|(git):\/\/([^\/]+)\/([^\/]+)\/(.+)(\.git)|()"));
	}
	var repoName=repoMatch[1];
  if( !repoName ) {
    log.warn({cwd:process.cwd(), match:repoMatch[0]}, "match");
  }
  log.info({cwd:process.cwd(), repoMatch:repoMatch, targetDirectory:options.targetDirectory, repoName:repoName}, "repoMatch");
  _this.gitDir=options.targetDirectory+"/"+repoName;
  log.info({cwd:process.cwd(), cloneCommand:util.format("git %s", ["clone", "https"+repo.match(/(:.*)/)[1], _this.gitDir].join(' ')) }, "cloning");
  // pass env:{"GIT_TERMINAL_PROMPT":"0"} to disable all prompting
	var gc=run('git', ["clone", "https"+repo.match(/(:.*)/)[1], _this.gitDir], {env:{"GIT_TERMINAL_PROMPT":"0"}});
	gc.response="";
  gc.on('error', function onError(msg) {
    log.error({cwd:process.cwd(), err:new Error(msg)}, "error");
    doClonePromise.reject(new Error(msg));
  });
	gc.on('data', function onData(data) {
		gc.response+=data;
	});
	gc.on('end', function onEnd(err) {
    if (err) {
      log.error({cwd:process.cwd(), stderr:stderr, err:err}, "error");
      return doClonePromise.reject(new Error(err));
    }
    log.info({cwd:process.cwd()}, "clone done");
    _this.getCommits=require(_this.xuexi_home+'/lib/git.getCommits');
    _this.deleteRepo=require(_this.xuexi_home+'/lib/git.deleteRepo');

    doClonePromise.resolve("");
  });

	return doClonePromise.promise;
};
