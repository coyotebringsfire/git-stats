process.on('message', function(module) {
	// Do work
	console.log("CHILD: MESSAGE %j", module);
	// Pass results back to parent process
	process.send({module:0-module});
});	

