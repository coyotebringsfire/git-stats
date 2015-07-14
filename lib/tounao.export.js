var Q=require('q'),
    debug=require("debug")('xuexi:tounao:doExport'),
    async=require('async');

function doExport() {
  var exportPromise=Q.defer();
  debug("this.trained %s", this.trained);
  if( this.trained === false ) {
    async.setImmediate(function() {
      exportPromise.reject(new Error("brain is untrained"));
    });
  } else {
    debug("calling toJSON");
    var trainedBrain=this.net.toJSON();
    exportPromise.resolve(trainedBrain);
  }
  return exportPromise.promise;
}

module.exports=doExport;