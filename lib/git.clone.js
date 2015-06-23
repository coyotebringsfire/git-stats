var Q=require('q'),
	debug=require('debug')('xuexi:git:clone'),
	async=require('async'),
	merge=require('merge'),
	child_process=require('child_process'),
	util=require('util');

module.exports=function doClone(repo, _options) {
	var debug=require('debug')('xuexi:git:clone:doClone'),
		defaultOptions = {
			targetDirectory:"/tmp"
		}, doClonePromise=Q.defer(), options = defaultOptions;
	if( _options ) {
		debug("merging options");
		merge(options, _options);
		debug("merged options %j", options);
	}

	debug("repo %s %j", repo, options);

	if(!repo) {
		debug("repo not set");
		setTimeout(function onTimeout() {
			var debug=require('debug')('xuexi:git:clone:doClone:onTimeout');
			debug("rejecting promise");
			doClonePromise.reject(new Error("missing required repo url"));
		}, 0);
		return doClonePromise.promise;
	}
	// apply options
	process.chdir( options.targetDirectory );
	//if targetDirectory ends in a /, remove it
	debug("targetDirectory %s", options.targetDirectory);
	if( options.targetDirectory.match(/\/$/) ) {
		options.targetDirectory=options.targetDirectory.slice(0, options.targetDirectory.length-1);
	}
	debug("matching repo string %s", repo);
	// run git clone
	/*
	var repoMatch=repo.match(/(?:http[s])|(?:git):\/\/(?:[^\/]+)\/(?:[^\/]+)\/(.+)(?:\.git)|$/);
	if( !repoMatch || !repoMatch[1] ) {
		return doClonePromise.reject(new Error("repo string didn't match required format\n(http[s])|(git):\/\/([^\/]+)\/([^\/]+)\/(.+)(\.git)|()"));
	}
	debug("repo match %j", repoMatch);

	var repoName=repoMatch[1];
	*/
	debug("running %s", util.format('git clone %s', repo));
	child_process.exec( util.format('git clone %s', repo) , function onGitCloneExit(err, stderr, stdout) {
		var debug=require('debug')('xuexi:git:clone:doClone:onGitCloneExit');
	    if (err) {
	      debug('exec error: ' + err);
	      doClonePromise.reject(new Error(err));
	    }
	    doClonePromise.resolve({results:"OK", options:options});
	});
	
	return doClonePromise.promise;
};
