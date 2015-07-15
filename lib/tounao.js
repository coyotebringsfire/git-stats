"use strict";
var brain=require('brain');

function tounao(trainedBrain) {
  this.net = new brain.NeuralNetwork();
  this.trained=false;
  if(trainedBrain) {
    this.net.fromJSON(trainedBrain);
    this.trained=true;
  }
}

tounao.prototype.train=require('./tounao.train');
tounao.prototype.export=require('./tounao.export');
tounao.prototype.question=require('./tounao.question');

module.exports=tounao;