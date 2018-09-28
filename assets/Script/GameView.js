cc.Class({
  extends: cc.Component,

  properties: {
    isStart: false,
    ctrlViewPrefab: cc.Prefab,
    ctrlView: cc.Node,
    stair: cc.Prefab,
    stairs: [cc.Node],
    player: cc.Node,

    /*
    * stair和player运动参数
    * */
    primaryHeight: 0, // scale为1时stair的高度（包含间距），第一个看不见
    firstEndScaleX: .8,
    firstEndScaleY: .5,
    firstY: 200,
    firstEndY: 0, // 113.75  ,  firstY = speed * .6 + firstEndY, .6为跳跃一次所需的时间（初始）
    speed: 143.75, // stair的运动速度 px/s ，作为游戏整体速度（难度的控制）
    scaleXChange: .13,
    scaleYChange: .18,
    initX: 0,
    initY: 0, // 初始值为偏离stair的距离，这个值运行后会根据初始值计算成坐标
    jumpHeight: 350,
    moveTime: 0, // player每次起跳之后的时间

    /*
    * 触摸参数
    * */
    isTouch: false,
    prevTouchX: 0,
    x: 0,
  },

  onLoad() {
    // 设置常驻节点
    // cc.game.addPersistRootNode(this.node);
    // 添加stair
    this.createStair();
    // this.startGame();
  },

  update(dt) {
    if (this.isStart) {
      // 上下一趟的时间
      const dur = (this.firstY - this.firstEndY) / this.speed;

      this.stairs.forEach((stair, index) => {
        // stair运动
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

      // player运动
      this.moveTime += dt;
      const t = dur / 2;
      const a = (this.jumpHeight * 2) / (t * t); // 加速度，反向
      const v = a * t; // 初始速度（最大速度，正向）
      const vt = v - (a * this.moveTime); // 瞬时速度（向量）
      this.player.y += vt * dt;

      // player触摸运动
      if (this.isTouch && this.isStart) {
        this.player.x = this.x;
      }
    }
  },

  lateUpdate() {
    // stair到了临界位置
    if (this.stairs[0].y <= this.firstEndY) {
      // this.isStart = false; // 用于调试
      // 把stairs中最后一个放到第一个
      const last = this.stairs.pop();
      this.stairs.unshift(last);
      // 重置y坐标和缩放比例
      last.scaleX = 0;
      last.scaleY = 0;
      last.y = this.firstY;

      // 调整player位置
      this.player.y = this.initY;
      // 清零运动时间
      this.moveTime = 0;
    }

    // player到了顶点
    if (this.player.y >= this.initY + this.jumpHeight) {
      // 调整player位置
      this.player.y = this.initY + this.jumpHeight;
    }
  },

  createStair() {
    let i = 0;
    while (i < 5) {
      const newStair = cc.instantiate(this.stair);
      newStair.getComponent('Stair').gameView = this;
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
        if (i === 3) {
          this.initY += newStair.y;
        }
        this.player.y = this.initY;
      }
      i += 1;
    }
  },

  initPlayer() {
    this.player.x = this.initX;
    this.player.y = this.initY;
    this.player.setSiblingIndex(10);
    this.x = this.initX;
  },

  touchStartHandle(e) {
    // 设置为触摸中
    this.isTouch = true;
    // 获取触摸初始点坐标
    this.prevTouchX = e.getLocation().x;
  },
  touchMoveHandle(e) {
    // 获取移动点坐标
    const x = e.getLocation().x;
    // 设置x坐标
    this.x += x - this.prevTouchX;
    // 更新前一个触摸点的x坐标
    this.prevTouchX = x;
  },
  touchEndHandle(e) {
    // 设置为触摸结束
    this.isTouch = false;
  },

  startGame() {
    this.isStart = true;
    this.initPlayer();
    // 监听touch事件
    this.node.on('touchmove', this.touchMoveHandle, this);
    this.node.on('touchstart', this.touchStartHandle, this);
    this.node.on('touchend', this.touchEndHandle, this);
  }
});
