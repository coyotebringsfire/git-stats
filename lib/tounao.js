var brain=require('brain');

function tounao(trainedBrain) {
  if(trainedBrain) {
    this.brain=trainedBrain;
  }
  this.net = new brain.NeuralNetwork();
}

tounao.prototype.train=require('./tounao.train');
tounao.prototype.export=require('./tounao.export');
tounao.prototype.question=require('./tounao.question');

module.exports=tounao;