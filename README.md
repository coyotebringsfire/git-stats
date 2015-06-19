# 學習
Xuéxí - mandarin for "to learn" because the purpose of this project is to train a machine to predict the popularity of a repo.
### The Theory
 My thinking is that there is a correlation between module popularity and code quality. If I can identify what commonalities in coding practices between the most popular modules in NPM, then I can compare the coding practices of any given repo and predict its popularity (and by extension, quality).
### How does it work?
 It works by gathering static code metrics (whatever we can get from git or npm) and calculating the PageRank for every module in NPM. This data set is used to train the machine. The trained machine can then be given the same set of git statistics for any repo and it should predict what the PageRank would be. 
### Do you read mandarin chinese?
No, I just like how the character for xí in traditional chinese looks.

## Install
```
$ npm install xuexi
```

## Usage
```
var xuexi=require('xuexi');
xuexi.predict({repo:"/path/to/repo/to/analize"});
```

## Tests
```
$ DEBUG='xuexi*' npm test
```

## Debugging
xuexi uses the debug module to log messages to the console that would be helpful in debugging. All of the messages are prepended with 'xuexi', and each closure has a message string uniquely identifying that closure