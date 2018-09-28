cc.Class({
  extends: cc.Component,

  properties: {
  },

  onLoad () {
    cc.director.preloadScene('rank', null);
  },

  startGame() {
    // 移除CtrlView
    this.node.runAction(cc.removeSelf());
    // 触发gameView的gameStart方式
    this.gameView.startGame();
  },

  redirectToRank() {
    cc.director.loadScene('rank');
  }
});
