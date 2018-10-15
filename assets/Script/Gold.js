cc.Class({
  extends: cc.Component,

  properties: {
    radish: cc.Node,
    add: cc.Node,
    circle: cc.Node,
    score: cc.Node,
    scoreLabel: cc.Label,
    star: cc.Node,
    anim1: '',
    anim2: '',
    anim3: '',
  },

  start() {
    this.init();
    // console.log(this.gameView);
  },

  init() {
    this.anim1 = this.circle.getComponent(cc.Animation);
    this.anim2 = this.score.getComponent(cc.Animation);
    this.anim3 = this.star.getComponent(cc.Animation);
    this.showRadish();
    this.hideAdd();
  },

  getGoldHandle() {
    this.hideRadish();
    this.showAdd();
    this.play();
    this.scoreLabel.string = `+${this.gameView.getComponent('GameView').addCount}`;
  },

  hideRadish() {
    this.radish.runAction(cc.hide());
  },

  showRadish() {
    this.radish.runAction(cc.show());
  },

  hideAdd() {
    this.add.runAction(cc.hide());
  },

  showAdd() {
    this.add.runAction(cc.show());
  },

  play() {
    this.anim1.play();
    this.anim2.play();
    this.anim3.play();
  },

  stop() {
    this.anim1.stop();
    this.anim2.stop();
    this.anim3.stop();
  }
});
