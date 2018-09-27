cc.Class({
  extends: cc.Component,

  properties: {
  },

  onLoad() {
    cc.log('RankView loaded');
  },

  back() {
    cc.director.loadScene('game');
  }
});
