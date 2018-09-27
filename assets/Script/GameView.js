cc.Class({
  extends: cc.Component,

  properties: {
    isStart: false,
    ctrlViewPrefab: cc.Prefab,
    ctrlView: cc.Node,
    stair: cc.Prefab,
    stairs: [cc.Node],
    primaryHeight: 0, // scale为1时stair的高度（包含间距），第一个看不见
    firstEndScaleX: .8,
    firstEndScaleY: .5,
    firstY: 200,
    firstEndY: 0, // 113.75  ,  speed = (firstY - firstEndY) / .6, .6为跳跃一次所需的时间（初始）
    speed: 143.75, // px/s
    scaleXChange: .13,
    scaleYChange: .18,
  },

  onLoad() {
    // 设置常驻节点
    // cc.game.addPersistRootNode(this.node);
    this.createStair();
  },

  update(dt) {
    if (this.isStart) {
      this.stairs.forEach((stair, index) => {
        const dur = (this.firstY - this.firstEndY) / this.speed;
        if (index === 0) {
          stair.y -= this.speed * dt;
          stair.scaleX += (this.firstEndScaleX / dur) * dt;
          stair.scaleY += (this.firstEndScaleY / dur) * dt;
        } else {
          stair.scaleX += (this.scaleXChange / dur) * dt;
          stair.scaleY += (this.scaleYChange / dur) * dt;
          const prevStair = this.stairs[index - 1];
          const prevHalf = (this.primaryHeight / 2) * prevStair.scaleY;
          const half = (this.primaryHeight / 2) * stair.scaleY;
          stair.y = prevStair.y - prevHalf - half;
        }
      });
      if (this.stairs[0].y <= this.firstEndY) {
        // this.isStart = false;
        // 把stairs中最后一个放到第一个
        const last = this.stairs.pop();
        this.stairs.unshift(last);
        // 重置y坐标和缩放比例
        last.scaleX = 0;
        last.scaleY = 0;
        last.y = this.firstY;
      }
    }
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
        newStair.setPosition(cc.v2(0, this.firstY));
      } else {
        newStair.scaleX = this.firstEndScaleX + ((i - 1) * this.scaleXChange);
        newStair.scaleY = this.firstEndScaleY + ((i - 1) * this.scaleYChange);
        const prevStair = this.stairs[i - 1];
        const prevHalf = (this.primaryHeight / 2) * prevStair.scaleY;
        const half = (this.primaryHeight / 2) * newStair.scaleY;
        newStair.setPosition(cc.v2(0, prevStair.y - prevHalf - half));
        if (i === 1) {
          this.firstEndY = newStair.y;
        }
      }
      i += 1;
    }
  },

  startGame() {

  }
});
