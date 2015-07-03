var should=require('should'),
    brain=require('brain');

describe("tounao", function tounaoSuite() {
  this.timeout(0);
  it("should accept a trained brain as the first argument", function doIt(done) {
    var Brain=require("../lib/tounao"), brain=new Brain({test:"test"});
    brain.brain.should.eql({test:"test"});
    done();
  });
  it("should have a train function", function doIt(done) {
    var Brain=require("../lib/tounao"), brain=new Brain({test:"test"});
    brain.train.should.be.a.Function;
    done();
  });
  it("should have a question function", function doIt(done) {
    var Brain=require("../lib/tounao"), brain=new Brain({test:"test"});
    brain.question.should.be.a.Function;
    done();
  });
  it("should have an export function", function doIt(done) {
    var Brain=require("../lib/tounao"), brain=new Brain({test:"test"});
    brain.export.should.be.a.Function;
    done();
  });
  describe("#train", function trainFunction() {
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
          done();
        }, function onReject(err) {
          should.fail("promise was rejected");
          done(err);
        });
    });
    it("should reject the returned promise if an error happens during processing", function doIt(done) { should.fail(); });
    it("should use brain options passed as second argument", function doIt(done) { should.fail(); });
  });
  describe("#question", function trainFunction() {
    it("should reject the returned promise if a data point isn't passed as the first argument", function doIt(done) { should.fail(); });
    it("should reject the returned promise if an error happens during processing", function doIt(done) { should.fail(); });
    it("should resolve the returned promise with the EQ score if no errors happen", function doIt(done) { should.fail(); });
  });
  describe("#export", function trainFunction() {
    it("should not be available if the brain hasn't been trained", function doIt(done) { should.fail(); });
    it("should return a json representation of the trained brain", function doIt(done) { should.fail(); });
  });
});