const Global = require('../Global/Global');

cc.Class({
  extends: cc.Component,

  properties: {
    score: cc.RichText,
    desc: cc.Label,
  },

  onLoad () {
  },

  setting() {
    this.score.string = `本次得分<br/>${this.gameView.score}`;
    this.desc.string = `每天5次复活机会，今日剩余：${Global.challengeCounters}次`;
  },

  skip() {
    // this.node.runAction(cc.removeSelf());
    // this.gameView.createCtrlView();
    // this.gameView.clearGame();
    Global.rankViewStatus = 1;
    cc.director.loadScene('rank');
  },

  share() {
    cc.log('onShare');
    wx.shareAppMessage({
      title: Global.shareTitle,
      imageUrl: Global.shareImageUrl,
    });
  }
});
