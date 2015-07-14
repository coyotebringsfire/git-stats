var should=require('should');

describe("#train", function trainFunction() {
  this.timeout(0);
  it("should reject the returned promise if not passed an array of data as the first argument", function doIt(done) {
    var Brain=require("../lib/tounao"), brain=new Brain();
    brain.train()
      .then(function onResolve(msg) {
        should.fail("promise was resolved");
        done(msg);
      }, function onReject(err) {
        err.message.should.match(/missing required training data/);
        done();
      });
  });
  it("should resolve the returned promise if no errors happen during processing", function noErrors(done) { 
    var Brain=require("../lib/tounao"), brain=new Brain(),
        debug=require('debug')('xuexi:tounao:tounaoSuite:trainFunction:noErrors:test');
    brain.train([{input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 }},
         {input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 }},
         {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }}])
      .then(function onResolve(msg) {
        debug("%j", msg);
        msg.error.should.not.be.greaterThan(0.005);
        brain.trained.should.be.ok;
        done();
      }, function onReject(err) {
        should.fail("promise was rejected");
        done(err);
      });
  });
  it("should reject the returned promise if an error happens during processing", function doIt(done) { 
    var Brain=require("../lib/tounao"), brain=new Brain(),
        debug=require('debug')('xuexi:tounao:tounaoSuite:trainFunction:noErrors:test');
    brain.train([{input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 }},
         {input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 }},
         {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }}], { errorThresh:1 })
      .then(function onResolve(msg) {
        debug("%j", msg);
        should.fail;
        done();
      }, function onReject(err) {
        err.message.should.match(/exceeded error threshold/);
        done(err);
      });
  });
  it("should use brain options passed as second argument", function doIt(done) { 
    var Brain=require("../lib/tounao"), brain=new Brain(),
        debug=require('debug')('xuexi:tounao:tounaoSuite:trainFunction:noErrors:test');
    brain.train([{input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 }},
         {input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 }},
         {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }}], {errorThresh:0.006})
      .then(function onResolve(msg) {
        debug("%j", msg);
        msg.error.should.be.within(0.005, 0.006);
        done();
      }, function onReject(err) {
        should.fail("promise was rejected");
        done(err);
      });
  });
});