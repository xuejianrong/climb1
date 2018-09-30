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
    this.gameView.updateData();
    Global.rankViewStatus = 1;
    cc.director.loadScene('rank');
  },

  share() {
    console.log('onShare');
    wx.shareAppMessage({
      title: Global.shareTitle,
      imageUrl: Global.shareImageUrl,
      query: 'view=rank&status=2',
      success: (res) => {
        console.log('分享成功', res);
      }
    });

    // 大于零而且没有复活过才能复活
    if (Global.challengeCounters > 0 && !Global.hasReplay) {
      Global.updateData({
        counters: Global.challengeCounters - 1,
      }, res => {
        console.log('复活成功');
        Global.hasReplay = true;
        this.node.removeFromParent();
        this.gameView.clearGame(true);
        this.gameView.canTouchStart = true;
      });
    }
  }
});
