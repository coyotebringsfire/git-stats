學習
Xuéxí - mandarin for "to learn" because the purpose of this repo is to predict whether a repo is more or less likely than the most popular repositories according to their npm star count and the number of other modules which use it as a dependency. I like how the character for xí in traditional chinese looks.

Install
```
$ npm install xuexi
```

Usage
```
var xuexi=require('xuexi');
xuexi.predict({repo:"/path/to/repo/to/analize"});
```