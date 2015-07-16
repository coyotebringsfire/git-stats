# 學習
Xuéxí - mandarin for "to learn" because the purpose of this project is to train a machine to predict the popularity of a repo.
### The Theory
 My thinking is that there is a correlation between module popularity and code quality. If I can identify what commonalities in coding practices between the most popular modules in NPM, then I can compare the coding practices of any given repo and predict its popularity (and by extension, quality).
### How does it work?
 It works by gathering static code metrics (whatever we can get from git or npm) and calculating the PageRank for every module in NPM. This data set is used to train the machine. The trained machine can then be given the same set of git statistics for any repo and it should predict what the PageRank would be. 
### Do you read mandarin chinese?
No, I just like how the character for xí in traditional chinese looks.

## Install
```bash
$ npm install xuexi
```

## Usage
the basic usage: this uses the results of noderank-nightly and emits a 'ready' event when it's ready to answer questions'
```javascript
var X=require('xuexi'),
	x=new X();

x.on('error', function onErrorEvent(err) {
	//an error happened
	...
});
x.on('ready', function onReadyEvent() {
	x.question(statistical_representation_of_git_repo);
		.then(function onQuestionResolved(answer) {
			//use answer
			...
		}, function onRejection(err) {
			//an error happened while questioning
			...
		});
});

```
you can export a json representation of the brain
```javascript
var X=require('xuexi'),
	x=new X();

x.on('ready', function onReadyEvent() {
	x.export()
		.then(function onExportResolved(trainedBrain) {
			//write trainedBrain to file, save to DB, transfer over network, etc
			...
		});
});
```
load a trained brain when constructing a 'xuexi' object
```javascript
var X=require('xuexi'), serializedBrain=require('./trainedBrain.json'),
	x=new X(serializedBrain);

x.on('ready', function onReadyEvent() {
	x.question(statistical_representation_of_git_repo);
		.then(function onQuestionResolved(answer) {
			//use answer
			...
		}, function onRejection(err) {
			//an error happened while questioning
			...
		});
});
```

## Tests
```bash
$ DEBUG='' npm test
```

## Debugging
xuexi uses the debug module to log messages to the console that would be helpful in debugging. All of the messages are prepended with 'xuexi', and each closure has a message string uniquely identifying that closure.
log files are also generated at /tmp/xuexi-logs/ using bunyan

## Suggested Reading
##### A Large Scale Study of Programming Languages and Code Quality in Github  
Baishakhi Ray, Daryl Posnett, Vladimir Filkov, Premkumar T Devanbu
[http://macbeth.cs.ucdavis.edu/lang_study.pdf](http://macbeth.cs.ucdavis.edu/lang_study.pdf)
##### Incrementals PageRank for Twiter Data Using Hadoop
Ibrahim Bin Abdullah
[http://homepages.inf.ed.ac.uk/miles/msc-projects/abdullah.pdf](http://homepages.inf.ed.ac.uk/miles/msc-projects/abdullah.pdf)