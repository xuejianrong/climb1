const Global = require('../Global/Global');
let openDataContext = '';
if (CC_WECHATGAME) {
  openDataContext = wx.getOpenDataContext();
  // openDataContext.enabled = false;
  // openDataContext.update();
}

cc.Class({
  extends: cc.Component,

  properties: {
    isStart: false,
    gameCanvas: cc.Node,
    ctrlViewPrefab: cc.Prefab,
    ctrlView: cc.Node,
    stair: cc.Prefab,
    stairs: [cc.Node],
    player: cc.Node,
    shadow: cc.Node,
    progressBox: cc.Node,
    progress: cc.Node,
    overViewPrefab: cc.Prefab,

    /*
    * stair和player运动参数
    * */
    primaryHeight: 263, // scale为1时stair的高度（包含间距），第一个看不见
    firstEndScaleX: .72,
    firstEndScaleY: .72,
    firstY: 200,
    firstEndY: 0, // firstY = speed * .6 + firstEndY, .6为跳跃一次所需的时间（初始）
    speed: 0, // stair的运动速度 px/s ，作为游戏整体速度（难度的控制）
    initSpeed: 100, // 初始速度
    addSpeed: 20,
    maxSpeed: 200,
    scaleXChange: .09,
    scaleYChange: .09,
    initX: 0,
    initYDistance: 0,  // 偏离stair的距离
    initY: 0,
    jumpHeight: 350,
    moveTime: 0, // player每次起跳之后的时间

    /*
    * 触摸参数
    * */
    isTouch: false,
    prevTouchX: 0,
    x: 0,
    canTouchStart: false,

    /*
    * 分数相关
    * */
    goldContinuousCount: 0, // 连续获得金币次数
    score: 0, // 当前分数
    addCount: 0, // 获得金币时，增加的分数值
    scoreLabel: cc.RichText,
    // 当前第几个阶梯（只算有萝卜的）
    step: 0,
    // 上一个吃金币的阶梯值
    preStep: 0,
    maxStep: 100,
  },

  onLoad() {
    // 首次进入首页判断是不是要跳转到rankView
    if (Global.joinFirst) {
      Global.joinFirst = false;
      this.checkQuery();
    }
    // 设置常驻节点
    // cc.game.addPersistRootNode(this.node);
    this.createCtrlView();
    // 添加stair
    this.createStair();
    this.initPlayer();
    this.speed = this.initSpeed;

    Global.gameView = this;

    if (CC_WECHATGAME) {
      wx.updateShareMenu({
        withShareTicket: true
      });
      wx.onShareAppMessage(function () {
        return {
          title: Global.shareTitle,
          imageUrl: Global.shareImageUrl
        }
      });
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      } else {
        wx.cloud.init();
        Global.db = wx.cloud.database()
      }

      // 获取openid
      if (CC_WECHATGAME) {
        if (!Global.openid) {
          // 调用云函数
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              console.log('[云函数] [login] user openid: ', res.result.openid);
              Global.openid = res.result.openid;
              this.getData();
              openDataContext.postMessage({
                type: 1,
                openid: res.result.openid
              });
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err);
            }
          });
        } else {
          this.getData();
        }
      }
    }
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

      // 影子的变化
      this.shadow.scale = (-0.9 * (this.player.y - this.initY) / (this.jumpHeight - this.initY)) + 1;

      // player触摸运动
      if (this.isTouch && this.isStart) {
        if (this.x > - 375 + 63 && this.x < 375 - 63) {
          this.player.x = this.x;
          this.shadow.x = this.x;
        } else {
          this.x = this.player.x;
        }
      }
    }
  },

  lateUpdate() {
    // stair到了临界位置
    if (this.stairs[0].y <= this.firstEndY) {
      // 处理step
      this.addStep();
      // this.isStart = false; // 用于调试
      // 把stairs中最后一个放到第一个
      const last = this.stairs.pop();
      // 重排stair
      const component = last.getComponent('Stair');
      if (this.step > 50 && this.step <=80) {
        component.barrierNum = 4;
      } else if (this.step > 80) {
        component.barrierNum = 5;
      }
      component.init();
      this.stairs.unshift(last);
      // 重置y坐标和缩放比例
      last.scaleX = 0;
      last.scaleY = 0;
      last.y = this.firstY;

      // 多余的几个台阶隐藏
      if (this.step > this.maxStep - 2) last.runAction(cc.hide());
      // 台阶到达100，结束游戏
      if (this.step > this.maxStep) this.gameOver(true);

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

  createCtrlView() {
    if (!this.ctrlView) {
      this.ctrlView = cc.instantiate(this.ctrlViewPrefab);
      this.ctrlView.getComponent('CtrlView').gameView = this;
    }
    this.gameCanvas.addChild(this.ctrlView);
  },

  createStair() {
    let i = 0;
    while (i < 5) {
      const newStair = cc.instantiate(this.stair);
      const stairComponent = newStair.getComponent('Stair');
      stairComponent.gameView = this.node;
      if (i > 1) stairComponent.noBarrier = true;
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
          this.initY = newStair.y + this.initYDistance;
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
    this.shadow.x = this.initX;
    this.shadow.y = this.initY;
    this.shadow.setSiblingIndex(9);
    this.progressBox.setSiblingIndex(10);
    this.x = this.initX;
  },

  touchStartHandle(e) {
    // 用于复活之后的触摸开始游戏
    if (this.canTouchStart) {
      this.isStart = true;
      this.canTouchStart = false;
    }
    // 设置为触摸中
    this.isTouch = true;
    // 获取触摸初始点坐标
    this.prevTouchX = e.getLocation().x;
  },
  touchMoveHandle(e) {
    // 获取移动点坐标
    const x = e.getLocation().x;
    const diff = x - this.prevTouchX;
    // 在屏幕内才执行下面操作
    if ((this.x > -375 + 63 && this.x < 357 - 63) || (this.x <= -375 + 63 && diff > 0) || (this.x >= 357 - 63 && diff < 0)) {
      // 设置x坐标
      this.x += diff;
      // 更新前一个触摸点的x坐标
      this.prevTouchX = x;
    }

  },
  touchEndHandle(e) {
    // 设置为触摸结束
    this.isTouch = false;
  },

  startGame() {
    this.isStart = true;
    Global.hasReplay = false;
    // 监听touch事件
    this.node.on('touchmove', this.touchMoveHandle, this);
    this.node.on('touchstart', this.touchStartHandle, this);
    this.node.on('touchend', this.touchEndHandle, this);
  },
  gameOver(complete) {
    this.isStart = false;

    if (!Global.hasReplay && !complete && Global.challengeCounters > 0) {
      // 没有复活过，结束后的控制模块显示
      const view = cc.instantiate(this.overViewPrefab);
      const overCtrl = view.getComponent('OverCtrl');
      overCtrl.gameView = this;
      this.scheduleOnce(() => {
        overCtrl.setting();
        this.gameCanvas.addChild(view);
      }, 1.5);
    } else {
      this.updateData();
      Global.rankViewStatus = 1;
      this.scheduleOnce(() => {
        cc.director.loadScene('rank');
      }, 1.5);
    }
  },
  getGold() {
    if (this.step === this.preStep + 1) {
      // 连续  则连续吃金币数+1
      this.goldContinuousCount += 1;
    } else {
      // 不连续  则重置连续吃金币数
      this.goldContinuousCount = 1;
    }
    this.preStep = this.step;

    if (this.goldContinuousCount > 4) {
      this.addCount = 50;
    } else {
      this.addCount = 20 + (this.goldContinuousCount - 1) * 10;
    }
    this.score += this.addCount;
    this.scoreLabel.string = `<color=#19C1A7><b>${this.score}</b><color>`;
  },
  addStep() {
    this.step += 1;
    // 计算progress的高度
    const maxHeight = 430;
    const minHeight = 25;
    const height = (this.step / 100) * maxHeight;
    this.progress.height = height > 25 ? height : 25;

    // 每跳10个加20的速度
    if (this.speed < this.maxSpeed) {
      this.speed = this.initSpeed + parseInt(this.step / 10, 10) * 20;
    } else {
      this.speed = this.maxSpeed;
    }
  },

  // 重置游戏场景
  clearGame(isReplay) {
    // 复活不需要重置的部分
    if (!isReplay) {
      this.score = 0;
      this.step = 0;
      this.progress.height = 25;
    }

    this.stairs.forEach(stair => stair.removeFromParent());
    this.stairs.length = 0;
    this.createStair();
    this.initPlayer();
    this.goldContinuousCount = 0;
    this.addCount = 0;
    this.preStep = 0;
    this.scoreLabel.string = `<color=#19C1A7><b>${this.score}</b><color>`;

    this.moveTime = 0;

    const playerCom = this.player.getComponent('Player');
    playerCom.activeNode.runAction(cc.show());
    playerCom.overNode.runAction(cc.hide());
  },

  getData(openid = Global.openid) {
    Global.queryData(openid, res => {
      console.log('[数据库] [查询记录] 成功: ', res);
      const data = res.data;
      if (data.length === 0) {
        // 不存在则插入数据
        Global.addData({
          counters: Global.challengeCountersAll,
          score: 0,
        });
        Global.challengeCounters = Global.challengeCountersAll;
      } else {
        // 判断上一个数据的时间是否是今天
        const isToday = Global.dateIsToday(data[0].date);
        if (isToday) {
          Global.challengeCounters = data[0].counters;
          Global.counterid = data[0]._id;
        } else {
          Global.updateData({
            counters: Global.challengeCountersAll,
          }, null);
          Global.counterid = data[0]._id;
          Global.challengeCounters = Global.challengeCountersAll;
        }
      }
    });
  },

  // 上报成绩
  updateData() {
    console.log('上报成绩');
    // 上报到云开发服务器，暂时没用
    Global.queryData(Global.openid, res => {
      console.log('上报前查询结果', res);
      const data = res.data[0];
      if (data.score < this.score) {
        Global.updateData({
          score: this.score,
        });
      }
    });
    // 上报到开放数据域
    if (CC_WECHATGAME) {
      openDataContext.postMessage({
        type: 0,
        data: {
          score: this.score,
          update_time: (new Date()).getTime()
        }
      });
    }
  },

  checkQuery() {
    if (CC_WECHATGAME) {
      console.log('getLaunchOptionsSync:', wx.getLaunchOptionsSync());
      const options = wx.getLaunchOptionsSync();
      const shareTicket = options.shareTicket;
      if (shareTicket) {
        openDataContext.postMessage({
          type: 2,
          shareTicket,
        });
      }
      const query = options.query;
      if (query.view === 'rank') {
        Global.rankViewStatus = parseInt(query.status, 10);
        cc.director.loadScene('rank');
      }
    }
  },
});
