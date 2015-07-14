var should=require('should');

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