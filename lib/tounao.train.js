var Q=require('q'),
    brain=require('brain'),
    async=require('async');

function doTrain(trainingData, options) {
  var trainingPromise=Q.defer(), trainingResults,
      debug=require('debug')('xuexi:tounao:train:doTrain'),
      _this=this;
  if(!trainingData) {
    async.setImmediate(function() {
      trainingPromise.reject(new Error("missing required training data"));
    });
  } else {
    debug("training");
    async.setImmediate(function() {
      trainingResults=_this.net.train(trainingData, options);
      debug("resolving promise with %j", trainingResults);
      if( trainingResults.error > ( (options && options.errorThresh) || 0.005) ) {
          trainingPromise.reject(new Error("exceeded error threshold"));
      } else {
          this.trained=true;
          trainingPromise.resolve(trainingResults);
      }
    });
  }
  return trainingPromise.promise;
}

module.exports=doTrain;