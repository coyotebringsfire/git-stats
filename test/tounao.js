var should=require('should'),
    brain=require('brain');

describe("tounao", function tounaoSuite() {
  this.timeout(0);
  it("should accept a trained brain as the first argument", function doIt(done) {
    var trainedBrain={ layers: [ { '0': {}, '1': {} },
                       { '0': [Object],
                         '1': [Object],
                         '2': [Object] },
                       { '0': [Object] } ],
                    outputLookup: false,
                    inputLookup: false };
    var Brain=require("../lib/tounao"), brain=new Brain();
    brain.question([1,0])
      .then(function onQuestionResolve(QE) {
        QE.should.eql([0.987]);
        brain.trained.should.be.true;
        done();
      }, function onQuestionRejected(err) {
        should.fail("question promise was rejected");
        done();
      });
    done();
  });
  it("should have a train function", function doIt(done) {
    var Brain=require("../lib/tounao"), brain=new Brain();
    brain.train.should.be.a.Function;
    brain.trained.should.be.false;
    done();
  });
  it("should have a question function", function doIt(done) {
    var Brain=require("../lib/tounao"), brain=new Brain();
    brain.question.should.be.a.Function;
    brain.trained.should.be.false;
    done();
  });
  it("should have an export function", function doIt(done) {
    var Brain=require("../lib/tounao"), brain=new Brain();
    brain.export.should.be.a.Function;
    brain.trained.should.be.false;
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
  describe("#question", function questionFunction() {
    it("should reject the returned promise if a data point isn't passed as the first argument", function doIt(done) { 
      var Brain=require("../lib/tounao"), brain=new Brain();
      brain.train([{input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 }},
                   {input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 }},
                   {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }}])
        .then(function onTrainResolve(msg) {
          brain.question()
            .then(function onQuestionResolve() {
              should.fail("question promise was resolved");
              done("question promise was resolved");
            }, function onQuestionReject(err) {
              err.message.should.match(/missing required question data/);
              done();
            });
        }, function onTrainReject(err) {
          should.fail("train promise was rejected");
          done("train promise was rejected");
        });
    });
    it.skip("should reject the returned promise if an error happens during processing", function doIt(done) { 
      // TODO I don't know how to do this
    });
    it("should resolve the returned promise with the EQ score if no errors happen", function doIt(done) { 
      var Brain=require("../lib/tounao"), brain=new Brain(),
          debug=require('debug')('xuexi:tounao:tounaoSuite:questionFunction:noErrors:test');
      brain.train([{input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 }},
           {input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 }},
           {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }}], {errorThresh:0.006})
        .then(function onTrainResolve(msg) {
          brain.question({ r: 1, g: 0.4, b: 0 })
            .then(function onQuestionResolve(EQ) {
              EQ.should.eql({ white: 0.99, black: 0.002 });
              done();
            }, function onQuestionRejected() {
              should.fail("question promise was rejected");
              done("question promise was rejected");
            });
          done();
        }, function onTrainReject(err) {
          should.fail("train promise was rejected");
          done(err);
        });
    });
  });
  describe("#export", function exportFunction() {
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
    it("should return a json representation of the trained brain", function doIt(done) { should.fail(); });
  });
});