cc.Class({
  extends: cc.Component,

  properties: {
    gameView: cc.Node,
    activeNode: cc.Node,
    overNode: cc.Node,
  },

  onLoad () {
    const manager = cc.director.getCollisionManager();
    // 开启碰撞检测系统
    manager.enabled = true;
    // 开启 debug 绘制
    // manager.enabledDebugDraw = true;
    // 显示碰撞组件的包围盒
    // manager.enabledDrawBoundingBox = true;

    this.overNode.runAction(cc.hide());
  },

  onCollisionEnter(collider) {
    const gameView = this.gameView.getComponent('GameView');
    if (this.node.y >= gameView.initY && this.node.y <= (gameView.initY + 120) && gameView.isStart) {
      if (collider.node.name === 'Tree') {
        // 碰撞的是障碍
        console.log('game over');
        this.gameOver();
        gameView.gameOver();
      } else if (collider.node.name === 'Gold'){
        // 碰撞的是金币
        gameView.getGold();

        // gold的处理
        collider.node.runAction(cc.removeSelf());
      }
    }
  },

  gameOver() {
    this.activeNode.runAction(cc.hide());
    this.overNode.runAction(cc.show());
  }
});
