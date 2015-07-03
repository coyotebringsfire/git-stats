var Q=require('q'),
    async=require('async');

function doQuestion(questionData) {
  var questionPromise=Q.defer(), questionResults,
      debug=require('debug')('xuexi:tounao:train:doQuestion'),
      _this=this;
  if(!questionData) {
    async.setImmediate(function() {
      questionPromise.reject(new Error("missing required question data"));
    });
  } else {
    debug("questioning");
    async.setImmediate(function() {
      questionResults=_this.net.run(questionData, options);
      if( questionResults.error > ( (options && options.errorThresh) || 0.005) ) {
          debug("rejecting promise because %j", err);
          questionPromise.reject(new Error("exceeded error threshold"));
      } else {
          debug("resolving promise with %j", questionResults);
          questionPromise.resolve(questionResults);
      }
    });
  }
  return questionPromise.promise;
}

module.exports=doQuestion;