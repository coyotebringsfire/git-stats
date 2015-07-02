//"use strict";

var debug=require('debug')('xuexi:git');

function predict() {

}

function Git(repo) {
	debug("repo: %s", repo);
	if(repo===undefined) {
		debug("throwing error");
		throw new Error("missing required repo");
	} else {
		this.repo=repo;
	}
}
Git.prototype.clone=require('./git.clone');
Git.prototype.getCommits=require('./git.getCommits');
Git.prototype.processCommits=require('./git.processCommits');
Git.prototype.train=require('./git.train');
Git.prototype.deleteRepo=require('./git.deleteRepo');
Git.prototype.predict=function() {

};
module.exports=Git;
