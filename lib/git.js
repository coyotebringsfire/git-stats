"use strict";
var debug=require('debug')('xuexi:git');

function Git(repo, module) {
	debug("repo: %s", repo);
	if(repo===undefined) {
		debug("throwing error");
		throw new Error("missing required repo");
	} else {
		this.repo=repo;
	}
  if(module) {
    this.module=module;
  }
  debug("cwd %s", process.cwd());
  this.xuexi_home=process.cwd();
}
Git.prototype.clone=require('./git.clone');

module.exports=Git;
