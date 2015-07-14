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
});