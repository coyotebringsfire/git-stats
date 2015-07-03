var Q=require('q'),
    brain=require('brain'),
    async=require('async');

function doTrain(trainingData, options) {
  var trainingPromise=Q.defer(), trainingResults,
      debug=require('debug')('xuexi:tounao:train:doTrain');
  if(!trainingData) {
    async.setImmediate(function() {
      trainingPromise.reject(new Error("missing required training data"));
    });
  } else {
    debug("training");
    trainingResults=this.net.train(trainingData, options);
    debug("resolving promise with %j", trainingResults);
    trainingPromise.resolve(trainingResults);
  }
  return trainingPromise.promise;
}

module.exports=doTrain;