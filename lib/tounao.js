function tounao(trainedBrain) {
  if(trainedBrain) {
    this.brain=trainedBrain;
  }
}

tounao.prototype.train=function() {};
tounao.prototype.export=function() {};
tounao.prototype.question=function() {};

module.exports=tounao;