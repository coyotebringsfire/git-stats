var Q=require('q'),
	debug=require('debug')('xuexi:git:clone'),
	async=require('async'),
	merge=require('merge'),
	child_process=require('child_process'),
	run=require('comandante');

module.exports=function doClone(repo, _options) {
	var debug=require('debug')('xuexi:git:clone:doClone'),
		defaultOptions = {
			targetDirectory:"/tmp/"
		}, doClonePromise=Q.defer(), options = defaultOptions;
	if( _options ) {
		debug("merging options");
		merge(options, _options);
		debug("merged options %j", options);
	}

	debug("repo %s", repo);

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
	process.chdir( options.targetDirectory );
	//if targetDirectory ends in a /, remove it
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
		var debug=require('debug')('xuexi:git:clone:doClone:onGitCloneExit');
	    if (err) {
	      debug('exec error: ' + err);
	      doClonePromise.reject(new Error(err));
	    }
	    doClonePromise.resolve({results:"OK", options:options});
	});
	*/
	return doClonePromise.promise;
};
