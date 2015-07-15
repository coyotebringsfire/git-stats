"use strict";
var Q=require('q'),
	gitShow=require('git-show'),
	ss=require('simple-statistics'),
	async=require('async');

module.exports=function processCommits() {
	var _this=this;
	var log = require('./logger')(_this.module);
	var processPromise=Q.defer(), commits=_this.commits;

	log.info({cwd:process.cwd(), commits:commits}, "commits to be proccessed");

	if(!commits) {
		async.setImmediate(function rejectingPromise() {
			log.error({cwd:process.cwd(), err:new Error("missing commits argument")}, "error");
			processPromise.reject(new Error("missing argument"));
		});
		return processPromise.promise;
	}

	if( (!(commits instanceof Object)) || commits instanceof Array) {
		async.setImmediate(function rejectingPromise() {
			log.error({cwd:process.cwd(), err:new Error("first argument must be a hash")}, "error");
			processPromise.reject(new Error("first argument must be a hash"));
		});
		return processPromise.promise;
	}
	commits.commitAuthors=[];
	log.info({cwd:process.cwd(), commits:Object.keys(commits)}, "processing commits");

	async.eachLimit(Object.keys(commits), 1, function forEachCommit(commit,done) {
		var _commit=commit;
		log.info({ cwd:process.cwd(), commit:commits[_commit] }, "processing commit");

		if( _commit === "commitAuthors" ) {
			log.info({cwd:process.cwd(), authors:commits["commitAuthors"]}, "commit authors");
			return done();
		}

		var author=commits[_commit].author, 
			sha=_commit;
		
		if( author === undefined ) {
			log.info({cwd:process.cwd(), author:commits[_commit]}, "author");
		} else {
			log.info({cwd:process.cwd(), authors:commits["commitAuthors"]}, "adding author");
			if( commits["commitAuthors"].indexOf(author.email) === -1 ) {
				commits["commitAuthors"].push(author.email);
			}
		}
		log.info({cwd:process.cwd(), authors:commits["commitAuthors"]}, "commit authors");

		//process.chdir(_this.gitDir);
		gitShow({cwd:_this.gitDir, commit:sha})
			.then( function onGitShowSuccess(output) {
				log.info({cwd:process.cwd(), output: output}, "git show success");
				if( !output ) {
					delete commits[_commit];
				} else {
					commits[_commit].showStats=output;
				}
				done();
			}, function onGitShowError(err) {
				log.error({cwd:process.cwd(), err:err}, "error");
				done(err);
			});
	}, function afterAllCommitsGotten(err) {
		var authors=[], response;
		log.info({cwd:process.cwd(), commits:commits}, "calculating stats");
		if(err) {
			log.error({cwd:process.cwd(), err:err}, "error");
			return processPromise.reject(err.message);
		}
		var totalAverageLinesChanged=0, totalAverageLinesAdded=0, totalAverageLinesDeleted=0,
			totalVarianceLinesChanged=0, totalVarianceLinesAdded=0, totalVarianceLinesDeleted=0,
			totalStandardDeviationLinesChanged=0, totalStandardDeviationLinesAdded=0, totalStandardDeviationLinesDeleted=0;
		var linesChanged=[], linesDeleted=[], linesAdded=[], 
				varianceLinesChanged=[], varianceLinesDeleted=[], varianceLinesAdded=[],
				standardDeviationLinesChanged=[], standardDeviationLinesDeleted=[], standardDeviationLinesAdded=[], c;
		for( c in commits ) {
			if( "commitAuthors" === c ) continue;
			log.info({cwd:process.cwd(), hash:c, stats:commits[c].showStats}, "commit");
			linesChanged.push( commits[c].showStats.averageLinesChanged );
			linesDeleted.push( commits[c].showStats.averageLinesDeleted );
			linesAdded.push( commits[c].showStats.averageLinesAdded );

			varianceLinesChanged.push( commits[c].showStats.varianceLinesChanged );
			varianceLinesDeleted.push( commits[c].showStats.varianceLinesDeleted );
			varianceLinesAdded.push( commits[c].showStats.varianceLinesAdded );

			standardDeviationLinesChanged.push( commits[c].showStats.standardDeviationLinesChanged );
			standardDeviationLinesDeleted.push( commits[c].showStats.standardDeviationLinesDeleted );
			standardDeviationLinesAdded.push( commits[c].showStats.standardDeviationLinesAdded );
		}
		log.info({cwd:process.cwd(), lines:linesChanged}, "linesChanged");
		log.info({cwd:process.cwd(), lines:linesDeleted}, "linesDeleted");
		log.info({cwd:process.cwd(), lines:linesAdded}, "linesAdded");
		totalAverageLinesChanged=ss.mean(linesChanged);
		totalAverageLinesDeleted=ss.mean(linesDeleted);
		totalAverageLinesAdded=ss.mean(linesAdded);

		totalVarianceLinesChanged=ss.mean(varianceLinesChanged);
		totalVarianceLinesDeleted=ss.mean(varianceLinesDeleted);
		totalVarianceLinesAdded=ss.mean(varianceLinesAdded);

		totalStandardDeviationLinesChanged=ss.mean(standardDeviationLinesChanged);
		totalStandardDeviationLinesDeleted=ss.mean(standardDeviationLinesDeleted);
		totalStandardDeviationLinesAdded=ss.mean(standardDeviationLinesAdded);
		
		log.info({cwd:process.cwd(), commits:commits}, "commits");
		log.info({cwd:process.cwd(), authors:commits.commitAuthors}, "authors");
		commits.averageLinesChanged=totalAverageLinesChanged/commits.commitAuthors.length;
		commits.averageLinesDeleted=totalAverageLinesDeleted/commits.commitAuthors.length;
		commits.averageLinesAdded=totalAverageLinesAdded/commits.commitAuthors.length;
		
		commits.varianceLinesChanged=totalVarianceLinesChanged/commits.commitAuthors.length;
		commits.varianceLinesDeleted=totalVarianceLinesDeleted/commits.commitAuthors.length;
		commits.varianceLinesAdded=totalVarianceLinesAdded/commits.commitAuthors.length;
		
		commits.standardDeviationLinesChanged=totalStandardDeviationLinesChanged/commits.commitAuthors.length;
		commits.standardDeviationLinesDeleted=totalStandardDeviationLinesDeleted/commits.commitAuthors.length;
		commits.standardDeviationLinesAdded=totalStandardDeviationLinesAdded/commits.commitAuthors.length;
		response={
			"averageLinesChanged":1/commits.averageLinesChanged || 0,
			"averageLinesDeleted":1/commits.averageLinesDeleted || 0,
			"averageLinesAdded":1/commits.averageLinesAdded || 0,
			"standardDeviationLinesChanged":1/commits.standardDeviationLinesChanged || 0,
			"standardDeviationLinesDeleted":1/commits.standardDeviationLinesDeleted || 0,
			"standardDeviationLinesAdded":1/commits.standardDeviationLinesAdded || 0, 
			"varianceLinesChanged":1/commits.varianceLinesChanged || 0,
			"varianceLinesDeleted":1/commits.varianceLinesDeleted || 0,
			"varianceLinesAdded":1/commits.varianceLinesAdded || 0, 
			"numAuthors":commits.commitAuthors.length
		};

		log.info({cwd:process.cwd(), response:response}, "resolving promise");
		_this.processedCommits=response;
		log.info({cwd:process.cwd(), response:_this.processedCommits}, "resolving promise");
		processPromise.resolve("");
	});

	return processPromise.promise;
};