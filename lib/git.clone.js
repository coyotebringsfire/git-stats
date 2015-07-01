var Q=require('q'),
	debug=require('debug')('xuexi:git:clone'),
	async=require('async'),
	merge=require('merge'),
	child_process=require('child_process'),
	run=require('comandante');

(function() {
    var childProcess = require("child_process");
    oldExec = childProcess.exec;
    function myExec() {
        debug('exec called');
        debug(arguments);
        var result = oldExec.apply(this, arguments);
        return result;
    }
    childProcess.exec = myExec;
})();

module.exports=function doClone(_options) {
	var debug=require('debug')('xuexi:git:clone:doClone'),
		defaultOptions = {
			targetDirectory:"/tmp"
		}, doClonePromise=Q.defer(), options = defaultOptions, repo=this.repo, _this=this;

	if( _options ) {
		debug("merging options");
		merge(options, _options);
		debug("merged options %j", options);
	}

	debug("repo %s %j", repo, options);


	if(!repo) {
		debug("repo not set");
		async.setImmediate(function onError() {
			var debug=require('debug')('xuexi:git:clone:doClone:onTimeout');
			debug("rejecting promise");
			doClonePromise.reject(new Error("missing required repo url"));
		});
		return doClonePromise.promise;
	}
	// apply options
	//process.chdir( options.targetDirectory );
	//if targetDirectory ends in a /, remove it
	debug("targetDirectory %s", options.targetDirectory);
	if( options.targetDirectory.match(/\/$/) ) {
		options.targetDirectory=options.targetDirectory.slice(0, options.targetDirectory.length-1);
	}
	// run git clone
	var repoMatch=repo.match(/(?:http[s])|(?:git):\/\/(?:[^\/]+)\/(?:[^\/]+)\/(.+)(?:\.git)|$/);
	if( !repoMatch ) {
		return doClonePromise.reject(new Error("repo string didn't match required format\n(http[s])|(git):\/\/([^\/]+)\/([^\/]+)\/(.+)(\.git)|()"));
	}
	var repoName=repoMatch[1];
	var gc=run('git', ["clone", repo], {cwd:options.targetDirectory});
	gc.response="";
	gc.on('data', function onData(data) {
		var debug=require('debug')('xuexi:git:clone:doClone:onGitCloneData');
		gc.response+=data;
	});
	gc.on('end', function onEnd(err) {
		var debug=require('debug')('xuexi:git:clone:doClone:onGitCloneEnd');
	    if (err) {
	      debug('exec error: ' + err);
	      doClonePromise.reject(new Error(err));
	    }
	    doClonePromise.resolve({results:"OK", options:options});
	});
	/*
	child_process.exec( util.format('git clone %s %s/%s', repo, options.targetDirectory, repoMatch) , function onGitCloneExit(err, stderr, stdout) {
>>>>>>> b106c46b6b73e6c3719a2860393c978603bb4d79
		var debug=require('debug')('xuexi:git:clone:doClone:onGitCloneExit');
    if (err) {
      debug('exec error: %j\n%j', err, stderr);
      return doClonePromise.reject(new Error(err));
    }
    debug("clone done %s", _this.gitDir);
    doClonePromise.resolve(_this.gitDir);
	});
	*/
	return doClonePromise.promise;
};
