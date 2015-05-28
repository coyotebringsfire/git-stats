"use strict";

var nodegit=require('nodegit'),
	debug=require('debug')('git:test');

function getStats(callback) {
	var _this=this;
	nodegit.Repository.open(_this.options.repo)
		.then(function(repo) {
			return repo.getMasterCommit();
		})
		.then(function(firstCommitOnMaster) {
			var history = firstCommitOnMaster.history();

		    // Listen for commit events from the history.
		    history.on("commit", function(commit) {
		    	_this.commits.push({ 
		    		sha: commit.sha(),
		    		author: commit.author(),
		    		date: commit.date(),
		    		message: commit.message()
		    	});
		    	
		    	// Show the commit sha.
		    	debug("commit %s", commit.sha());

		    	// Store the author object.
		    	var author = commit.author();

		    	// Display author information.
		    	debug("Author:\t" + author.name() + " <", author.email() + ">");

		    	// Show the commit date.
		    	debug("Date:\t" + commit.date());

		    	// Give some space and show the message.
		    	debug("\n    " + commit.message());
		    	
		    });
		    
		    history.on('end', function() {
		    	console.log("history end");
		    	if( _this.commits.length == 0 ) {
		    		callback(new Error("no commits"));
		    	}
		    	callback();
		    });

		    // Start emitting events.
		    history.start();
		})
		.catch(function(err) {
	    	callback(new Error(err));
	    })
	    .done();
}

function Git(options) {
	this.commits=[];

	if( !options ) {
		throw new Error("missing options");
	}
	if( !options.repo ) {
		throw new Error("missing repo");
	}
	this.options=options;
	this.getStats=getStats;
}
module.exports=Git;