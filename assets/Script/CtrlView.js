const Global = require('../Global/Global');

cc.Class({
  extends: cc.Component,

  properties: {
  },

  onLoad () {
    Global.ctrlView = this;
  },

  startGame() {
    // 移除CtrlView
    this.node.runAction(cc.removeSelf());
    // 触发gameView的gameStart方式
    this.gameView.startGame();
  },

  redirectToRank() {
    Global.rankViewStatus = 0;
    cc.director.loadScene('rank');
  },
});
