cc.Class({
  extends: cc.Component,

  properties: {
    // 第几个阶梯
    // No: 0,
    // 障碍物个数
    barrierNum: 0,
    // 可放障碍的位置数
    posiNum: 0,
    // 障碍位置数组
    barrierPositions: [],
    barriers: [cc.Node],
    noBarrier: false,
    barrierPrefab: cc.Prefab,
    goldPrefab: cc.Prefab,
    gold: cc.Node,
    goldPosition: -2,
    // player: cc.Node,
    distance: 75,
  },

  onLoad() {
    if (!this.noBarrier) {
      this.init();
    }
  },

  init() {
    // 随机位置
    this.randomPosition();
    // 根据随机位置添加障碍物
    this.createBarrier();
    // 根据随机位置添加金币
    this.createGold();
  },

  // 随机出现障碍、金币位置
  randomPosition() {
    this.barrierPositions.length = 0;
    let arr = [], i = 0, j = 0, ran = 0;
    // 创建空位置数组 [0, 1, ..., 9]
    while (i < this.posiNum) arr.push(i ++);
    // 随机一个位置作为金币的位置 去掉头尾各2个
    this.goldPosition = parseInt((arr.length - 4) * Math.random() + 2, 10);
    arr.splice(this.goldPosition, 1);
    // 随机剩余的位置作为障碍的位置，并顺序排序
    while (j < this.barrierNum) {
      ran = parseInt(arr.length * Math.random(), 10);
      this.barrierPositions.push(arr[ran]);
      arr.splice(ran, 1);
      j += 1;
    }
    this.barrierPositions.sort((a, b) => (a > b));
  },

  createBarrier() {
    // 如果已经重置stair位置的话，barriers里本来就有一些barrier的，所以得用长度去判断是否需要增加
    // 在setBarrierPosition的时候也需要遍历设置位置，不能在下面的while中设置位置
    while (this.barrierPositions.length !== this.barriers.length) {
      const newBarrier = cc.instantiate(this.barrierPrefab);
      this.barriers.push(newBarrier);
      this.node.addChild(newBarrier);
    }
    // 设置位置
    this.barriers.forEach((barrier, i) => {
      barrier.setPosition(cc.v2((this.barrierPositions[i] * 70) - 350 + 35, this.distance));
    });
  },

  createGold() {
    // 不存在才添加，为了减少节点的添加过程
    if (!this.gold) {
      this.gold = cc.instantiate(this.goldPrefab);
    }
    // 没有父节点（没有add或者remove掉）的才添加
    if (!this.gold._parent) {
      this.node.addChild(this.gold);
    }
    this.gold.setPosition(cc.v2((this.goldPosition * 70) - 350 + 35, this.distance));
  },

  // update (dt) {},
});
