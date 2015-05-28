"use strict";

var nodegit=require('nodegit'),
	debug=require('debug')('git:test');

function getCommits(callback) {
	var _this=this;
	nodegit.Repository.open(_this.options.repo)
		.then(function(repo) {
			return repo.getMasterCommit();
		})
		.then(function(firstCommitOnMaster) {
			var history = firstCommitOnMaster.history();

		    // Listen for commit events from the history.
		    history.on("commit", function(commit) {
		    	// Show the commit sha.
		    	debug("commit %s", commit.sha());

		    	// Store the author object.
		    	var author = commit.author();

		    	// Display author information.
		    	debug("Author:\t" + author.name() + " <", author.email() + ">");

		    	// Show the commit date.
		    	debug("Date:\t" + commit.date());

		    	_this.commits.push({ 
		    		sha: commit.sha(),
		    		author: {
		    			name:author.name(), 
		    			email:author.email()
		    		},
		    		date: commit.date()
		    	});
		    });
		    
		    history.on('end', function() {
		    	debug("history end");
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
	this.getCommits=getCommits;
}
module.exports=Git;