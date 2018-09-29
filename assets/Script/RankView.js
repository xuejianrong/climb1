const Global = require('../Global/Global');

cc.Class({
  extends: cc.Component,

  properties: {
    btnBack: cc.Node,
    btnGroupRank: cc.Node,
    btnHome: cc.Node,
    btnHome2: cc.Node,
    btnPlayAgain: cc.Node,
    btnChallenge: cc.Node,
    btnStart: cc.Node,
  },

  onLoad() {
    if (Global.rankViewStatus === 0) {
      this.btnHome.removeFromParent();
      this.btnHome2.removeFromParent();
      this.btnPlayAgain.removeFromParent();
      this.btnChallenge.removeFromParent();
      this.btnStart.removeFromParent();
    } else if (Global.rankViewStatus === 1) {
      this.btnHome2.removeFromParent();
      this.btnBack.removeFromParent();
      this.btnGroupRank.removeFromParent();
      this.btnStart.removeFromParent();
    } else {
      this.btnHome.removeFromParent();
      this.btnBack.removeFromParent();
      this.btnGroupRank.removeFromParent();
      this.btnPlayAgain.removeFromParent();
      this.btnChallenge.removeFromParent();
    }
  },

  back() {
    cc.director.loadScene('game');
  },

  directToGameView() {
    cc.director.loadScene('game');
  },

  share() {
    console.log('onShare');
    wx.shareAppMessage({
      title: Global.shareTitle,
      imageUrl: Global.shareImageUrl,
      query: 'view=rank&status=2',
    });
  },

  startGame() {
    cc.director.loadScene('game', _ => {
      Global.ctrlView.startGame();
    });
  },
});
