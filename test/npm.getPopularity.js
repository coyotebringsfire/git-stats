var debug=require('debug')('npm:getPopularity:test'),
    should=require('should');

describe("npm:getPopularity", function getPopularity() {
  this.timeout(0);
  var debug=require('debug')('npm:getPopularity:test:getPopularity');
  it("should return a promise", function itResponse(done) {
    var debug=require('debug')('npm:getPopularity:test:getPopularity:itResponse');
    var popularity=require('../lib/npm').getPopularity;
    var promise=popularity();
    promise.then.should.be.type('function');
    done();
  });
  it.only("should resolve the promise with a hash containing all of the NPM modules, and their PageRank value", function itResponse(done) {
    var debug=require('debug')('npm:getPopularity:test:getPopularity:itResponse');
    var popularity=require('../lib/npm').popularity;
    popularity().
      then(function onPopularityPromiseResolve(popularity) {
        var debug=require('debug')('npm:getPopularity:test:popularity:itResponse:onPopularityPromiseResolve');
        popularity.should.be.ok;
        for( k in popularity ) {
          popularity[k].should.be.type('number');
        }
        done();
      }, function onPopularityPromiseRejected(err) {
        var debug=require('debug')('npm:getPopularity:test:getPopularity:itResponse:onPopularityPromiseRejected');
        should.fail("popularity promise was rejected");
      });
  });
});