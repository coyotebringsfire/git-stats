"use strict";
var should=require('should'),
    EventEmitter = require('events').EventEmitter,
    child_process=require('child_process'),
    debug=require('debug')('xuexi:gitHistoryHelper');

describe("gitHistoryHelper", function gitHistoryHelperSuite() {
  it("should start getting history when sent a start message and send a message with the results", function doIt(done) {
    var helper=child_process.fork('./lib/gitHistoryHelper');
    helper.on('message', function(msg) {
      debug("response %j", msg);
      msg.should.be.ok;
    });
    helper.on('exit', function() {
      done();
    });
    helper.send({repo:process.cwd()});
  });
});