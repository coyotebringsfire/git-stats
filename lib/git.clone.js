var Q=require('q'),
	debug=require('debug')('xuexi:git:clone'),
	async=require('async'),
	merge=require('merge'),
	child_process=require('child_process');

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
		setTimeout(function onTimeout() {
			var debug=require('debug')('xuexi:git:clone:doClone:onTimeout');
			debug("rejecting promise");
			doClonePromise.reject(new Error("missing required repo url"));
		}, 0);
		return doClonePromise.promise;
	}
	// apply options
	process.chdir( options.targetDirectory );
	// run git clone
	child_process.exec('git clone ' + repo, function onGitCloneExit(err, stderr, stdout) {
		var debug=require('debug')('xuexi:git:clone:doClone:onGitCloneExit');
	    if (err) {
	      debug('exec error: ' + err);
	      doClonePromise.reject(new Error(err));
	    }
	    doClonePromise.resolve({results:"OK", options:options});
	});
	
	return doClonePromise.promise;
};
