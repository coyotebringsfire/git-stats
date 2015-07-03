function tounao(trainedBrain) {
  if(trainedBrain) {
    this.brain=trainedBrain;
  }
}

tounao.prototype.train=require('./tounao.train');
tounao.prototype.export=require('./tounao.export');
tounao.prototype.question=require('./tounao.question');

module.exports=tounao;