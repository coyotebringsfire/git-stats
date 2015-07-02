var debug=require('debug')('xuexi:git:Commit');

function Commit(commit) {
	var author = commit.author,
		commitTree, parentTree, commitTrees={};
    this.sha=commit.sha;
    this.author={
    	name: author.name,
    	email: author.email,
    }
	this.date = commit.date;
	this.message=commit.message;

	// Show the commit sha.
	debug("commit %s", this.sha);

	// Display author information.
	debug("Author:\t" + this.author.name + " <", this.author.email + ">");

	// Show the commit date.
	debug("Date:\t" + this.date);
}
module.exports=Commit;