var Q=require('q'),
	fs=require('fs-plus'),
	git=require('./git'),
	getCommits=git.getCommits,
	processCommits=git.processCommits;

module.exports=function doTrain(options, callback) {
	var debug=require('debug')('xuexi:xuexi:git:train');
	debug("training");
	var trainPromise=Q.defer();
	if( arguments.length === 0 ) {
		debug("rejecting promise: missing options");
		trainPromise.reject(new Error("missing options"));
	} else if( !options.repo ) {
		debug("rejecting promise: missing repo");
		trainPromise.reject(new Error("missing repo"));
		if( typeof callback == "function") {
			callback(new Error("missing repo"));
		}
	} else if( callback && typeof callback != 'function' ) {
		debug("rejecting promise: invalid callback");
		trainPromise.reject(new Error("invalid callback"));
	} else {
		if(	!fs.isDirectorySync(options.repo) ) {
			debug("rejecting promise: invalid repo");
			trainPromise.reject(new Error("invalid callback"));
			if( callback ) {
				callback(new Error("invalid repo"));
			}
		} else {
			//process the repo
			debug("processing repo");
			getCommits( options.repo )
				.then(function onResolveGetCommits(commits) {
					var debug=require('debug')('xuexi:git:train:onResolveGetCommits');
					debug("commits %j", commits);
					return processCommits(commits);
				}, function onRejectGetCommits(err) {
					var debug=require('debug')('xuexi:git:train:onRejectGetCommits');
					if( typeof callback == 'function' ) {
						callback(err);
					}
					trainPromise.reject(err);
				})
				.then(function onResolveProcessCommits(trainedModel) {
					debug=require('debug')('xuexi:git:train:onResolveProcessCommits');
					debug("trainedModel %j", trainedModel);
					trainPromise.resolve(trainedModel);
					if( typeof callback == 'function' ) {
						callback(null, trainedModel);
					}
				}, function onRejectProcessCommits() {
					var debug=require('debug')('xuexi:git:train:onRejectProcessCommits');
					if( typeof callback == 'function' ) {
						callback(err);
					}
					trainPromise.reject(err);
				});
		}
	}
	return trainPromise.promise;
};
