var Q=require('q'),
	async=require('async'),
	debug=require('debug')('npm'),
	npmPageRank=require('pagerank-js');

function popularity() {
	var debug=require('debug')('npm:popularity');

	return npmPageRank();
}

module.exports={
	popularity: popularity
};