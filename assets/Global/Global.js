module.exports = {
  /*
  * 排行榜相关
  * */
  rankViewStatus: 0, // 0 首页点击排行榜，1 游戏结束后的排行榜显示，2 好友点击分享的小程序卡进入的游戏结果

  /*
  * 分享相关
  * */
  shareTitle: '分享标题',
  shareImageUrl: 'http://static.live.nagezan.net/live/19cc06e0-3a5f-48d5-93f9-d0414cd21f51.jpg',

  /*
  * 用户相关
  * */
  openid: '',
  challengeCountersAll: 5,
  challengeCounters: 0,
  db: '',
  counterid: '',
  queryData(openid) {
    // 这里输出不能使用cc.log，具体不知道什么原因
    this.db.collection('challengeCounters').where({
      _openid: openid,
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res);
        const data = res.data;
        if (data.length === 0) {
          // 不存在则插入数据
          this.addData({
            counters: this.challengeCountersAll,
            score: 0,
          });
          this.challengeCounters = this.challengeCountersAll;
        } else {
          this.challengeCounters = data[0].counters;
          this.counterid = data[0]._id;
        }
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err);
      }
    });
  },
  addData(data) {
    this.db.collection('challengeCounters').add({
      data: Object.assign({
        date: new Date(),
      }, data),
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
        this.counterid = res._id;
      },
      fail: err => {
        console.error('[数据库] [新增记录] 失败：', err);
      }
    })
  },
  updateData(data, cb) {
    this.db.collection('challengeCounters').doc(this.counterid).update({
      data: Object.assign({
        date: new Date(),
      }, data),
      success: cb,
      fail: err => {
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  hasReplay: false,
};
