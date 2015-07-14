var should=require('should'),
    Q=require('q'),
    child_process=require('child_process');

describe("xuesheng", function xueshengSuite() {
  this.timeout(0);
  it("should reject the returned promise, if an invalid module is passed via IPC", function doIt(done) {
    var child;
    if( process.cwd().match(/test$/) ) {
      child=child_process.fork('../lib/xuesheng');
    } else {
      child=child_process.fork('./lib/xuesheng');
    }
    child.send({module:"INVALIDMODULE"});
    child.on("message", function onMessage(response) {
      response.module.should.equal("INVALIDMODULE");
      response.err.should.be.ok;
      done();
    });
  });
  it("should emit an event with module stats for the module that is processed", function doIt(done) {
    var child;
    if( process.cwd().match(/test$/) ) {
      child=child_process.fork('../lib/xuesheng');
    } else {
      child=child_process.fork('./lib/xuesheng');
    }
    var moduleOnePromise=Q.defer(), moduleTwoPromise=Q.defer();
    child.on('message', function(msg) {
      msg.module.should.match(/should/);
      msg.results.should.be.ok;
      should(msg.err).not.be.ok;
      done();
    });
    child.send({module:"should"});
  });
  it("should emit an error event if a module is passed that is invalid", function doIt(done) {
    var child;
    if( process.cwd().match(/test$/) ) {
      child=child_process.fork('../lib/xuesheng');
    } else {
      child=child_process.fork('./lib/xuesheng');
    }
    child.on('message', function(msg) {
      msg.err.should.be.ok;
      done();
    });
    child.send({module:"NONEXISTENTMODULE"});
  });
  it("should emit an error if a message is received in the wrong format", function wrongFormat(done) {
    var debug=require('debug')("xuexi:xuesheng:xueshengSuite:wrongFormat"), child;
    if( process.cwd().match(/test$/) ) {
      child=child_process.fork('../lib/xuesheng');
    } else {
      child=child_process.fork('./lib/xuesheng');
    }
    child.on('message', function(msg) {
      msg.err.should.be.ok;
      done();
    });
    child.send(["MODULEONE"]);
  });
});