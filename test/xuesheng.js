var should=require('should'),
    Q=require('q'),
    child_process=require('child_process');

describe("xuesheng", function xueshengSuite() {
  it("should reject the returned promise, if an invalid module is passed via IPC", function doIt(done) {
    var child=child_process.fork('../lib/xuesheng');
    child.send("INVALIDMODULE");
    child.on("message", function onMessage(response) {
      response.module.should.equal("INVALIDMODULE");
      response.err.should.be.ok;
      done();
    });
  });
  it("should emit an event with module stats the module that is processed", function doIt(done) {
    var child=child_process.fork('../lib/xuesheng'), moduleOnePromise=Q.defer(), moduleTwoPromise=Q.defer();
    child.on('message', function(msg) {
      msg.module.should.match(/MODULEONE/);
      done();
    });
    child.send("MODULEONE");
  });
  it("should emit an error event if a module is passed that is invalid", function doIt(done) {
    var child=child_process.fork('../lib/xuesheng');
    child.on('message', function(msg) {
      msg.err.should.be.ok;
      done();
    });
    child.send("MODULEONE");
  });
  it("should emit an error if a message is received in the wrong format", function wrongFormat(done) {
    var child=child_process.fork('../lib/xuesheng'),
        debug=require('debug')("xuexi:xuesheng:xueshengSuite:wrongFormat");
    child.on('message', function(msg) {
      msg.err.should.be.ok;
      done();
    });
    child.send(["MODULEONE"]);
  });
});