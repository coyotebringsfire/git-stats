var should=require('should');

describe("#export", function exportFunction() {
  this.timeout(0);
  it("should reject the returned promise if the brain hasn't been trained", function untrained(done) { 
    var Brain=require("../lib/tounao"), brain=new Brain(),
        debug=require('debug')('xuexi:tounao:tounaoSuite:exportFunction:untrained:test');
    debug("exporting");
    brain.export()
      .then(function onExportResolve() {
        debug("export resolved");
        should.fail("export promise was resolved");
        done();
      }, function onExportReject(err) {
        debug("export promise rejected %s", err);
        err.message.should.match(/brain is untrained/);
        done();
      });
  });
  it("should return a json object representation of the trained brain", function doIt(done) { 
    var Brain=require("../lib/tounao"), brain=new Brain(),
        debug=require('debug')('xuexi:tounao:tounaoSuite:export:noErrors:test');
    brain.train([{input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 }},
         {input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 }},
         {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }}])
      .then(function onResolve(msg) {
        debug("%j", msg);
        msg.error.should.not.be.greaterThan(0.005);
        console.log("%j", brain);
        brain.export()
          .then(function onExportResolved(trainedBrain) {
            trainedBrain.should.be.ok;
            done();
          });
      }, function onReject(err) {
        should.fail("promise was rejected");
        done(err);
      });
  });
});