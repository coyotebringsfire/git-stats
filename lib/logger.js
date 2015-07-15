"use strict";
var bunyan=require('bunyan');

var log=function doLog(module) {
  var logger=bunyan.createLogger({
    name: "xuexi",
    src: true,
    streams: [
      {
        level: "info",
        path: "/tmp/xuexi-logs/"+ (module || "xuexi")
      }
    ]
  });
  logger.fatal.bind(logger);
  logger.error.bind(logger);
  logger.warn.bind(logger);
  logger.info.bind(logger);
  logger.debug.bind(logger);
  logger.trace.bind(logger);
  return logger;
};
module.exports=log;