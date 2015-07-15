"use strict";
var Q=require('q'),
	async=require('async'),
	debug=require('debug')('npm'),
	npmNodeRank=require('noderank');

function popularity() {
	var debug=require('debug')('npm:popularity');

	return npmNodeRank.NodeRank();
}

module.exports={
	popularity: popularity
};