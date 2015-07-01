var child_process=require('child_process');

var children=[
	child_process.fork('./child'),
	child_process.fork('./child'),
	child_process.fork('./child'),
	child_process.fork('./child')
];

children[0].on('message', function(msg) {
	console.log("%d done %j", 0, msg);
});
children[1].on('message', function(msg) {
	console.log("%d done %j", 1, msg);
});
children[2].on('message', function(msg) {
	console.log("%d done %j", 2, msg);
});
children[3].on('message', function(msg) {
	console.log("%d done %j", 3, msg);
});

children[0].send(0);
children[1].send(1);
children[2].send(2);
children[3].send(3);

children[0].on('exit', function() {});
