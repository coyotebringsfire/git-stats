var Q=require('q'),
	debug=require('debug')('xuexi:git:clone'),
	async=require('async'),
	merge=require('merge'),
	child_process=require('child_process'),
	util=require('util');

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

	// apply options
	//process.chdir( options.targetDirectory );
	//if targetDirectory ends in a /, remove it
	debug("targetDirectory %s", options.targetDirectory);
	if( options.targetDirectory.match(/\/$/) ) {
		options.targetDirectory=options.targetDirectory.slice(0, options.targetDirectory.length-1);
	}
	// run git clone

	_this.gitDir=util.format("%s/%s", options.targetDirectory, repo.match(/.*\/(.*)$/)[1]);
	debug("running %s", util.format('git clone --single-branch -q %s %s', repo, _this.gitDir));
	
	child_process.exec( util.format('git clone --single-branch -q %s %s',repo, _this.gitDir), function onGitCloneExit(err, stderr, stdout) {
		var debug=require('debug')('xuexi:git:clone:doClone:onGitCloneExit');
    if (err) {
      debug('exec error: %j\n%j', err, stderr);
      return doClonePromise.reject(new Error(err));
    }
    debug("clone done %s", _this.gitDir);
    doClonePromise.resolve(_this.gitDir);
	});
	
	return doClonePromise.promise;
};
