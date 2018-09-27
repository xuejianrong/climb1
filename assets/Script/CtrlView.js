cc.Class({
  extends: cc.Component,

  properties: {
    gameView: cc.Node,
  },

  onLoad () {
    cc.director.preloadScene('rank', function () {
      cc.log('Rank scene preloaded');
    });
  },

  startGame() {
    // 移除CtrlView
    this.node.runAction(cc.removeSelf());
    // 触发gameView的gameStart方式
    this.gameView.getComponent('GameView').startGame();
  },

  redirectToRank() {
    cc.director.loadScene('rank');
  }
});
