var Q=require('q'),
	async=require('async');

function getPopularity() {
	var registry=require('npm-stats')(),
		popularityPromise=Q.defer();
	registry.list({}, function listCallback(modules) {
		async.each(modules, function eachModule(module, nextModule) {
			registry.module(module).info();
			registry.module(module).stars();
			registry.module(module).dependents();
		}, function afterAllModulesHaveBeenProcessed(err) {})
	});
	return popularityPromise.promise;
}

function getStars() {}

module.exports={
	getPopularity: getPopularity,
	getStars: getStars
};