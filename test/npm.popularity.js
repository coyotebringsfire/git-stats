var debug=require('debug')('npm:popularity:test'),
    should=require('should');

describe("npm:popularity", function getPopularity() {
  this.timeout(0);
  var debug=require('debug')('npm:popularity:test:getPopularity');
  it("should return a promise", function itResponse(done) {
    var debug=require('debug')('npm:popularity:test:getPopularity:itResponse');
    var popularity=require('../lib/npm').popularity;
    var promise=popularity();
    promise.then.should.be.type('function');
    done();
  });
  it("should resolve the promise with a hash containing all of the NPM modules, and their PageRank value", function itResponse(done) {
    var debug=require('debug')('npm:popularity:test:getPopularity:itResponse');
    var npm=require('../lib/npm');
    debug("npm %j", npm);
    var popularity=npm.popularity;
    debug("npm.popularity %j", npm.popularity);
    popularity().
      then(function onPopularityPromiseResolve(popularity) {
        var debug=require('debug')('npm:popularity:test:popularity:itResponse:onPopularityPromiseResolve');
        popularity.should.be.ok;
        for( k in popularity ) {
          popularity[k].should.be.type('number');
        }
        done();
      }, function onPopularityPromiseRejected(err) {
        var debug=require('debug')('npm:popularity:test:getPopularity:itResponse:onPopularityPromiseRejected');
        should.fail("popularity promise was rejected");
      });
  });
});