cc.Class({
  extends: cc.Component,

  properties: {
    ctrlViewPrefab: cc.Prefab,
    ctrlView: cc.Node,
    stair: cc.Prefab,
    stairs: [cc.Node],
    primaryHeight: 0,
  },

  onLoad() {
    // 设置常驻节点
    // cc.game.addPersistRootNode(this.node);
    this.createStair();
  },

  createStair() {
    let i = 0;
    while (i < 5) {
      const newStair = cc.instantiate(this.stair);
      this.stairs[i] = newStair;
      this.node.addChild(newStair);
      if (i === 0) {
        newStair.scaleX = 0;
        newStair.scaleY = 0;
        newStair.setPosition(cc.v2(0, 200));
      } else {
        newStair.scaleX = .8 + ((i - 1) * .13);
        newStair.scaleY = .5 + ((i - 1) * .18);
        const prevStair = this.stairs[i - 1];
        const prevHalf = (this.primaryHeight / 2) * prevStair.scaleY;
        const half = (this.primaryHeight / 2) * newStair.scaleY;
        newStair.setPosition(cc.v2(0, prevStair.y - prevHalf - half));
      }
      i += 1;
    }
  },

  startGame() {

  }
});
