window.__require=function t(e,i,s){function n(a,r){if(!i[a]){if(!e[a]){var c=a.split("/");if(c=c[c.length-1],!e[c]){var h="function"==typeof __require&&__require;if(!r&&h)return h(c,!0);if(o)return o(c,!0);throw new Error("Cannot find module '"+a+"'")}}var l=i[a]={exports:{}};e[a][0].call(l.exports,function(t){return n(e[a][1][t]||t)},l,l.exports,t,e,i,s)}return i[a].exports}for(var o="function"==typeof __require&&__require,a=0;a<s.length;a++)n(s[a]);return n}({CtrlView:[function(t,e,i){"use strict";cc._RF.push(e,"fc7a1Vco1RLp45w+aBK076Z","CtrlView");var s=t("../Global/Global");cc.Class({extends:cc.Component,properties:{},onLoad:function(){s.ctrlView=this},startGame:function(){this.node.runAction(cc.removeSelf()),this.gameView.startGame()},redirectToRank:function(){s.rankViewStatus=0,cc.director.loadScene("rank")}}),cc._RF.pop()},{"../Global/Global":"Global"}],GameView:[function(t,e,i){"use strict";cc._RF.push(e,"74384f4Pr1Au47VINXpucOD","GameView");var s=t("../Global/Global"),n="";n=wx.getOpenDataContext(),cc.Class({extends:cc.Component,properties:{isStart:!1,gameCanvas:cc.Node,ctrlViewPrefab:cc.Prefab,ctrlView:cc.Node,stair:cc.Prefab,stairs:[cc.Node],player:cc.Node,shadow:cc.Node,progressBox:cc.Node,progress:cc.Node,overViewPrefab:cc.Prefab,primaryHeight:263,firstEndScaleX:.72,firstEndScaleY:.72,firstY:200,firstEndY:0,speed:0,initSpeed:100,addSpeed:20,maxSpeed:200,scaleXChange:.09,scaleYChange:.09,initX:0,initYDistance:0,initY:0,jumpHeight:350,moveTime:0,isTouch:!1,prevTouchX:0,x:0,canTouchStart:!1,goldContinuousCount:0,score:0,addCount:0,scoreLabel:cc.RichText,step:0,preStep:0,maxStep:100},onLoad:function(){var t=this;s.joinFirst&&(s.joinFirst=!1,this.checkQuery()),this.createCtrlView(),this.createStair(),this.initPlayer(),this.speed=this.initSpeed,s.gameView=this,wx.updateShareMenu({withShareTicket:!0}),wx.onShareAppMessage(function(){return{title:s.shareTitle,imageUrl:s.shareImageUrl}}),wx.cloud?(wx.cloud.init(),s.db=wx.cloud.database()):console.error("\u8bf7\u4f7f\u7528 2.2.3 \u6216\u4ee5\u4e0a\u7684\u57fa\u7840\u5e93\u4ee5\u4f7f\u7528\u4e91\u80fd\u529b"),s.openid?this.getData():wx.cloud.callFunction({name:"login",data:{},success:function(e){console.log("[\u4e91\u51fd\u6570] [login] user openid: ",e.result.openid),s.openid=e.result.openid,t.getData(),n.postMessage({type:1,openid:e.result.openid})},fail:function(t){console.error("[\u4e91\u51fd\u6570] [login] \u8c03\u7528\u5931\u8d25",t)}})},update:function(t){var e=this;if(this.isStart){var i=(this.firstY-this.firstEndY)/this.speed;this.stairs.forEach(function(s,n){if(0===n)s.y-=e.speed*t,s.scaleX+=e.firstEndScaleX/i*t,s.scaleY+=e.firstEndScaleY/i*t;else{s.scaleX+=e.scaleXChange/i*t,s.scaleY+=e.scaleYChange/i*t;var o=e.stairs[n-1],a=e.primaryHeight/2*o.scaleY,r=e.primaryHeight/2*s.scaleY;s.y=o.y-a-r}}),this.moveTime+=t;var s=i/2,n=2*this.jumpHeight/(s*s),o=n*s-n*this.moveTime;this.player.y+=o*t,this.shadow.scale=-.8*(this.player.y-this.initY)/(this.jumpHeight-this.initY)+.8,this.isTouch&&this.isStart&&(this.x>-312&&this.x<312?(this.player.x=this.x,this.shadow.x=this.x):this.x=this.player.x)}},lateUpdate:function(){if(this.stairs[0].y<=this.firstEndY){this.addStep();var t=this.stairs.pop(),e=t.getComponent("Stair");this.step>50&&this.step<=80?e.barrierNum=4:this.step>80&&(e.barrierNum=5),e.init(),this.stairs.unshift(t),t.scaleX=0,t.scaleY=0,t.y=this.firstY,this.step>this.maxStep-2&&t.runAction(cc.hide()),this.step>this.maxStep&&this.gameOver(!0),this.player.y=this.initY,this.moveTime=0}this.player.y>=this.initY+this.jumpHeight&&(this.player.y=this.initY+this.jumpHeight)},createCtrlView:function(){this.ctrlView||(this.ctrlView=cc.instantiate(this.ctrlViewPrefab),this.ctrlView.getComponent("CtrlView").gameView=this),this.gameCanvas.addChild(this.ctrlView)},createStair:function(){for(var t=0;t<5;){var e=cc.instantiate(this.stair),i=e.getComponent("Stair");if(i.gameView=this.node,t>1&&(i.noBarrier=!0),this.stairs[t]=e,this.node.addChild(e),0===t)e.scaleX=0,e.scaleY=0,e.setPosition(cc.v2(0,this.firstY));else{e.scaleX=this.firstEndScaleX+(t-1)*this.scaleXChange,e.scaleY=this.firstEndScaleY+(t-1)*this.scaleYChange;var s=this.stairs[t-1],n=this.primaryHeight/2*s.scaleY,o=this.primaryHeight/2*e.scaleY;e.setPosition(cc.v2(0,s.y-n-o)),1===t&&(this.firstEndY=e.y),3===t&&(this.initY=e.y+this.initYDistance),this.player.y=this.initY}t+=1}},initPlayer:function(){this.player.x=this.initX,this.player.y=this.initY,this.player.setSiblingIndex(10),this.shadow.x=this.initX,this.shadow.y=this.initY,this.shadow.setSiblingIndex(9),this.progressBox.setSiblingIndex(10),this.x=this.initX},touchStartHandle:function(t){this.canTouchStart&&(this.isStart=!0,this.canTouchStart=!1),this.isTouch=!0,this.prevTouchX=t.getLocation().x},touchMoveHandle:function(t){var e=t.getLocation().x,i=e-this.prevTouchX;(this.x>-312&&this.x<294||this.x<=-312&&i>0||this.x>=294&&i<0)&&(this.x+=i,this.prevTouchX=e)},touchEndHandle:function(t){this.isTouch=!1},startGame:function(){this.isStart=!0,s.hasReplay=!1,this.node.on("touchmove",this.touchMoveHandle,this),this.node.on("touchstart",this.touchStartHandle,this),this.node.on("touchend",this.touchEndHandle,this)},gameOver:function(t){var e=this;if(this.isStart=!1,!s.hasReplay&&!t&&s.challengeCounters>0){var i=cc.instantiate(this.overViewPrefab),n=i.getComponent("OverCtrl");n.gameView=this,this.scheduleOnce(function(){n.setting(),e.gameCanvas.addChild(i)},1.5)}else this.updateData(),s.rankViewStatus=1,this.scheduleOnce(function(){cc.director.loadScene("rank")},1.5)},getGold:function(){this.addCount=5*this.step,this.score+=this.addCount,this.scoreLabel.string="<color=#19C1A7><b>"+this.score+"</b><color>"},addStep:function(){this.step+=1;var t=this.step/100*430;this.progress.height=t>25?t:25,this.speed<this.maxSpeed?this.speed=this.initSpeed+20*parseInt(this.step/10,10):this.speed=this.maxSpeed},clearGame:function(t){t||(this.score=0,this.step=0,this.progress.height=25),this.stairs.forEach(function(t){return t.removeFromParent()}),this.stairs.length=0,this.createStair(),this.initPlayer(),this.goldContinuousCount=0,this.addCount=0,this.preStep=0,this.scoreLabel.string="<color=#19C1A7><b>"+this.score+"</b><color>",this.moveTime=0;var e=this.player.getComponent("Player");e.activeNode.runAction(cc.show()),e.overNode.runAction(cc.hide())},getData:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s.openid;s.queryData(t,function(t){console.log("[\u6570\u636e\u5e93] [\u67e5\u8be2\u8bb0\u5f55] \u6210\u529f: ",t);var e=t.data;0===e.length?(s.addData({counters:s.challengeCountersAll,score:0}),s.challengeCounters=s.challengeCountersAll):s.dateIsToday(e[0].date)?(s.challengeCounters=e[0].counters,s.counterid=e[0]._id):(s.updateData({counters:s.challengeCountersAll},null),s.counterid=e[0]._id,s.challengeCounters=s.challengeCountersAll)})},updateData:function(){var t=this;console.log("\u4e0a\u62a5\u6210\u7ee9"),s.queryData(s.openid,function(e){console.log("\u4e0a\u62a5\u524d\u67e5\u8be2\u7ed3\u679c",e),e.data[0].score<t.score&&s.updateData({score:t.score})}),n.postMessage({type:0,data:{score:this.score,update_time:(new Date).getTime()}})},checkQuery:function(){console.log("getLaunchOptionsSync:",wx.getLaunchOptionsSync());var t=wx.getLaunchOptionsSync(),e=t.shareTicket;e&&n.postMessage({type:2,shareTicket:e});var i=t.query;"rank"===i.view&&(s.rankViewStatus=parseInt(i.status,10),cc.director.loadScene("rank"))}}),cc._RF.pop()},{"../Global/Global":"Global"}],Global:[function(t,e,i){"use strict";cc._RF.push(e,"cddabeYMPRAybU78zrtQXz3","Global"),e.exports={rankViewStatus:0,shareTitle:"\u5206\u4eab\u6807\u9898",shareImageUrl:"http://static.live.nagezan.net/live/42057568-13a6-403c-84ec-d899dddbc6ab.jpg",openid:"",challengeCountersAll:5,challengeCounters:0,db:"",counterid:"",queryData:function(t,e){this.db.collection("challengeCounters").where({_openid:t}).get({success:e,fail:function(t){console.error("[\u6570\u636e\u5e93] [\u67e5\u8be2\u8bb0\u5f55] \u5931\u8d25\uff1a",t)}})},addData:function(t){var e=this;this.db.collection("challengeCounters").add({data:Object.assign({date:new Date},t),success:function(t){console.log("[\u6570\u636e\u5e93] [\u65b0\u589e\u8bb0\u5f55] \u6210\u529f\uff0c\u8bb0\u5f55 _id: ",t._id),e.counterid=t._id},fail:function(t){console.error("[\u6570\u636e\u5e93] [\u65b0\u589e\u8bb0\u5f55] \u5931\u8d25\uff1a",t)}})},updateData:function(t,e){this.db.collection("challengeCounters").doc(this.counterid).update({data:Object.assign({date:new Date},t),success:e,fail:function(t){console.error("[\u6570\u636e\u5e93] [\u66f4\u65b0\u8bb0\u5f55] \u5931\u8d25\uff1a",t)}})},hasReplay:!1,joinFirst:!0,dateIsToday:function(t){var e=new Date,i=e.getFullYear(),s=e.getMonth(),n=e.getDate(),o=new Date(i,s,n);return t.getTime()>=o.getTime()}},cc._RF.pop()},{}],Gold:[function(t,e,i){"use strict";cc._RF.push(e,"62214Tsa/xKdIA8zkb3FWxZ","Gold"),cc.Class({extends:cc.Component,properties:{radish:cc.Node,add:cc.Node,circle:cc.Node,score:cc.Node,scoreLabel:cc.Label,star:cc.Node,anim1:"",anim2:"",anim3:""},start:function(){this.init()},init:function(){this.anim1=this.circle.getComponent(cc.Animation),this.anim2=this.score.getComponent(cc.Animation),this.anim3=this.star.getComponent(cc.Animation),this.showRadish(),this.hideAdd()},getGoldHandle:function(){this.hideRadish(),this.showAdd(),this.play(),this.scoreLabel.string="+"+this.gameView.getComponent("GameView").addCount},hideRadish:function(){this.radish.runAction(cc.hide())},showRadish:function(){this.radish.runAction(cc.show())},hideAdd:function(){this.add.runAction(cc.hide())},showAdd:function(){this.add.runAction(cc.show())},play:function(){this.anim1.play(),this.anim2.play(),this.anim3.play()},stop:function(){this.anim1.stop(),this.anim2.stop(),this.anim3.stop()}}),cc._RF.pop()},{}],OverCtrl:[function(t,e,i){"use strict";cc._RF.push(e,"ad19cEPgGpNio7PxiYaBZOj","OverCtrl");var s=t("../Global/Global");cc.Class({extends:cc.Component,properties:{score:cc.RichText,desc:cc.Label},onLoad:function(){},setting:function(){this.score.string="\u672c\u6b21\u5f97\u5206<br/>"+this.gameView.score,this.desc.string="\u6bcf\u59295\u6b21\u590d\u6d3b\u673a\u4f1a\uff0c\u4eca\u65e5\u5269\u4f59\uff1a"+s.challengeCounters+"\u6b21"},skip:function(){this.gameView.updateData(),s.rankViewStatus=1,cc.director.loadScene("rank")},share:function(){var t=this;console.log("onShare"),wx.shareAppMessage({title:s.shareTitle,imageUrl:s.shareImageUrl,query:"view=rank&status=2",success:function(e){console.log("\u5206\u4eab\u6210\u529f",e),s.challengeCounters>0&&!s.hasReplay&&s.updateData({counters:s.challengeCounters-1},function(e){console.log("\u590d\u6d3b\u6210\u529f"),s.hasReplay=!0,t.node.removeFromParent(),t.gameView.clearGame(!0),t.gameView.canTouchStart=!0})},fail:function(t){console.log("\u5206\u4eab\u5931\u8d25",t),wx.showToast({title:"\u53d6\u6d88\u5206\u4eab",icon:"none"})}})}}),cc._RF.pop()},{"../Global/Global":"Global"}],Player:[function(t,e,i){"use strict";cc._RF.push(e,"77cadpxUZRO2ql+MLV+ZuIs","Player"),cc.Class({extends:cc.Component,properties:{gameView:cc.Node,activeNode:cc.Node,overNode:cc.Node},onLoad:function(){cc.director.getCollisionManager().enabled=!0,this.overNode.runAction(cc.hide())},onCollisionEnter:function(t){var e=this.gameView.getComponent("GameView");if(this.node.y>=e.initY&&this.node.y<=e.initY+100&&e.isStart)if("Tree"===t.node.name)console.log("game over"),this.gameOver(),e.gameOver();else if("Gold"===t.node.name){e.getGold(),t.node._parent.getComponent("Gold").getGoldHandle()}},gameOver:function(){this.activeNode.runAction(cc.hide()),this.overNode.runAction(cc.show())}}),cc._RF.pop()},{}],RankView:[function(t,e,i){"use strict";cc._RF.push(e,"e9620nXcKBMDo+6QzBkQkh6","RankView");var s=t("../Global/Global");cc.Class({extends:cc.Component,properties:{btnBack:cc.Node,btnGroupRank:cc.Node,btnHome:cc.Node,btnHome2:cc.Node,btnPlayAgain:cc.Node,btnChallenge:cc.Node,btnStart:cc.Node},onLoad:function(){0===s.rankViewStatus?(this.btnHome.removeFromParent(),this.btnHome2.removeFromParent(),this.btnPlayAgain.removeFromParent(),this.btnChallenge.removeFromParent(),this.btnStart.removeFromParent()):1===s.rankViewStatus?(this.btnHome2.removeFromParent(),this.btnBack.removeFromParent(),this.btnGroupRank.removeFromParent(),this.btnStart.removeFromParent()):(this.btnHome.removeFromParent(),this.btnBack.removeFromParent(),this.btnGroupRank.removeFromParent(),this.btnPlayAgain.removeFromParent(),this.btnChallenge.removeFromParent())},back:function(){cc.director.loadScene("game")},directToGameView:function(){cc.director.loadScene("game")},share:function(){console.log("onShare"),wx.shareAppMessage({title:s.shareTitle,imageUrl:s.shareImageUrl,query:"view=rank&status=2",success:function(t){console.log("\u5206\u4eab\u6210\u529f",t)},fail:function(t){console.log("\u5206\u4eab\u5931\u8d25",t)}})},startGame:function(){cc.director.loadScene("game",function(t){s.ctrlView.startGame()})}}),cc._RF.pop()},{"../Global/Global":"Global"}],Stair:[function(t,e,i){"use strict";cc._RF.push(e,"b408awkSpRBPri4LoPCjvhR","Stair"),cc.Class({extends:cc.Component,properties:{barrierNum:0,posiNum:0,barrierPositions:[],barriers:[cc.Node],noBarrier:!1,barrierPrefab:cc.Prefab,goldPrefab:cc.Prefab,gold:cc.Node,goldPosition:-2,distance:75},onLoad:function(){this.noBarrier||this.init()},init:function(){this.randomPosition(),this.createBarrier(),this.createGold()},randomPosition:function(){this.barrierPositions.length=0;for(var t=[],e=0,i=0,s=0;e<this.posiNum;)t.push(e++);for(this.goldPosition=parseInt((t.length-4)*Math.random()+2,10),t.splice(this.goldPosition,1);i<this.barrierNum;)s=parseInt(t.length*Math.random(),10),this.barrierPositions.push(t[s]),t.splice(s,1),i+=1;this.barrierPositions.sort(function(t,e){return t>e})},createBarrier:function(){for(var t=this;this.barrierPositions.length!==this.barriers.length;){var e=cc.instantiate(this.barrierPrefab);this.barriers.push(e),this.node.addChild(e)}this.barriers.forEach(function(e,i){e.setPosition(cc.v2(70*t.barrierPositions[i]-350+35,t.distance))})},createGold:function(){this.gold||(this.gold=cc.instantiate(this.goldPrefab),this.gold.getComponent("Gold").gameView=this.gameView),this.gold._parent||this.node.addChild(this.gold),this.gold.setPosition(cc.v2(70*this.goldPosition-350+35,this.distance)),this.gold.getComponent("Gold").init()}}),cc._RF.pop()},{}]},{},["Global","CtrlView","GameView","Gold","OverCtrl","Player","RankView","Stair"]);