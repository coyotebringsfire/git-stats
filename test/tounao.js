var should=require('should'),
    brain=require('brain');

describe("tounao", function tounaoSuite() {
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
    it("should reject the returned promise if not passed an array of data as the first argument", function doIt(done) { should.fail(); });
    it("should resolve the returned promise if no errors happen during processing", function doIt(done) { should.fail(); });
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