//index.js
//获取应用实例
var app = getApp()
var config = require('../../superBaby/config')

/**网络请求接口 */
// 获取宝贝的详情数据
const webInterface_getBabyDetailInfo = `${config.host}partner/detail`

// 投票请求接口
const webInterface_voteToUser = `${config.host}partner/vote`

// 获取指定宝宝的礼物列表
const webInterface_getBabyGiftsList = `${config.host}partner/getGiftLogPage`

Page({
    data: {
        id: "",
        hostImage: config.hostImage,
        windowHeight: 654,
        maxtime: "",
        currentSwiperIndex: 0,
        isHiddenLoading: true,
        isHiddenToast: true,
        animationMiddleHeaderItem: '',
        babyDetial: {},     // 宝宝详情数据
        dataList: [],       // 礼物列表数据  
        pageIndex: 1,       // 礼物列表的页码索引
        isHasPartner: false
    },
    //获取列表残过来的参数 id   (页面初始化方法)
    onLoad: function (options) {
      
      this.setData({
        id: options.id,
        isHasPartner: app.data.userInfo.partner == null ? false : true,
        windowHeight: wx.getStorageSync('windowHeight')
      });
    },

    // 页面渲染完成
    onReady: function () {
      var circleCount = 0;
      // 心跳的外框动画
      this.animationMiddleHeaderItem = wx.createAnimation({
        duration:1000,    // 以毫秒为单位
        /**
       * http://cubic-bezier.com/#0,0,.58,1  
       *  linear  动画一直较为均匀
       *  ease    从匀速到加速在到匀速
       *  ease-in 缓慢到匀速
       *  ease-in-out 从缓慢到匀速再到缓慢
       * 
       *  http://www.tuicool.com/articles/neqMVr
       *  step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
       *  step-end   保持 0% 的样式直到动画持续时间结束        一闪而过
       */
        timingFunction: 'linear',
        delay: 100,
        transformOrigin: '50% 50%',
        success: function (res) {
        }
      });
      
      var interval = setInterval(function() {
        if (circleCount % 2 == 0) {
          this.animationMiddleHeaderItem.scale(1.15).step();
        } else {
          this.animationMiddleHeaderItem.scale(1.0).step();
        }
        
        this.setData({
          animationMiddleHeaderItem: this.animationMiddleHeaderItem.export()
        });
        
        circleCount++;
        if (circleCount == 1000) {
          circleCount = 0;
        }
      }.bind(this), 1000);
      

      // 网络请求 - 获取宝宝详情数据
      this.webInterfaceGetBabyDetailInfo();

      // 网络请求 - 获取宝宝的礼物列表
      this.webInterfaceGetBabyGiftsList();
    },



    // swiper change
    swiperBindChange: function (e) {
      this.setData({
        currentSwiperIndex:e.detail.current
      });
    },

    // swiper 上一页
    swiperPrevPageClick: function (e) {
      var allCount = e.currentTarget.dataset.id;
      var current = this.data.currentSwiperIndex;
      if (current <= 0) {
        this.setData({
          currentSwiperIndex: allCount - 1,
        });
      } else {
        this.setData({
          currentSwiperIndex: current-1,
        });
      }
    },

    // swiper 下一页
    swiperNextPageClick: function (e) {
      var allCount = e.currentTarget.dataset.id;
      var current = this.data.currentSwiperIndex;
      if (current >= allCount-1) {
        this.setData({
          currentSwiperIndex: 0,
        });
      } else {
        this.setData({
          currentSwiperIndex: current + 1,
        });
      }
    },

    // 图片轮播点击
    toDetailPage: function (e) {
      var imagesArray = [];
      for (var index = 0; index < e.currentTarget.dataset.array.length; index++) {
        var item = e.currentTarget.dataset.array[index];
        imagesArray.push(config.hostImage + item);
      }

      wx.previewImage({
        urls: imagesArray,
        current: e.currentTarget.dataset.id,
      })
    },

    // 我也要参加
    iWantToPartIn: function(e) {
      console.log("i want to partin");
      wx.navigateTo({
        url: '../takePartin/takePartin?id=' + this.data.babyDetial.id + '&subjectId=' + this.data.babyDetial.subjectId
      });
    },

    //返回首页
    returnHomeBack: function(e) {
      console.log("返回首页");   // 关闭所有非tab 界面，直接舔砖tab界面
      wx.switchTab({
        url: '../index/index'
      })
    },

    // 投票按钮点击
    voteClick: function (e) {
      var that = this;
      // 每个用户每天只能投票一次


      //  请求数据
      wx.request({
        url: webInterface_voteToUser,
        data: {
          partnerId: that.data.id,
          userId: app.data.userInfo.id,
        },
        method: "GET",
        success: function (res) {
          if (res.statusCode != 200) {
            console.log("data:" + res.data);
            return;
          }
          if (res.data.status != 101) {
            console.log("data:" + res.data.msg);
            return;
          }

          wx.showToast({
            title: '投票成功~',
          })
        },
        fail: function () {
          console.log("失败了");
        }
      });
    },

    // 送礼物
    sendBabyGift: function(e) {
      wx.navigateTo({
        url: '../babyGift/babyGift?id=' + this.data.id
      });
    },

    // 查看更多
    lookMoreBabyList: function (e) {
      this.setData({
        pageIndex: ++this.data.pageIndex,
      });
      this.webInterfaceGetBabyGiftsList();
    },


    /** 网络接口请求 */
    // 获取宝贝的详情数据
    webInterfaceGetBabyDetailInfo: function (e) {
      var that = this;
      //  请求数据
      wx.request({
        url: webInterface_getBabyDetailInfo,
        data: {
          partnerId: that.data.id,
          userId: app.data.userInfo.id,
        },
        method: "GET",
        success: function (res) {
          if (res.statusCode != 200) {
            console.log("data:" + res.data);
            return;
          }
          if (res.data.status != 101) {
            console.log("data:" + res.data.msg);
            return;
          }

          // 整理数据
          var babyDetailTemp = res.data.data;
          if (babyDetailTemp.partnerImages.length == 0) {
            babyDetailTemp.partnerImages.push(babyDetailTemp.showImage);
          } else {
            var showImagesArray = [];
            for (var i = 0; i < babyDetailTemp.partnerImages.length; i++) {
              var imagObject = babyDetailTemp.partnerImages[i];
              showImagesArray.push(imagObject.image);
              
            }
            babyDetailTemp.partnerImages = showImagesArray;
          }
          that.setData({
            babyDetial: babyDetailTemp
          });
        },
        fail: function () {
          console.log("失败了");
        }
      });
    },

    // 获取指定宝宝的礼物列表
    webInterfaceGetBabyGiftsList: function (e) {
      var pageIndex = this.data.pageIndex;
      var that = this;
      //  请求数据
      wx.request({
        url: webInterface_getBabyGiftsList,
        data: {
          partnerId: that.data.id,
          pageSize: "20",
          pageCode: pageIndex,
        },
        method: "GET",
        success: function (res) {
          if (res.statusCode != 200) {
            console.log("data:" + res.data);
            return;
          }
          if (res.data.status != 101) {
            console.log("data:" + res.data.msg);
            return;
          }


          var successData = [{
            "userIcon": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1503311471481&di=407d225bd25a0f2e6a32a0c70369783b&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F55%2F50%2F300001062059134724500366252_950.jpg",
            "userName": "张小宝",
            "giftName": "熊二",
            "time": "1503390916"
          },

            {
              "userIcon": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1503397738264&di=98249593a8da62cc5cd5420801f32a41&imgtype=0&src=http%3A%2F%2Fwww.sinaimg.cn%2Fdy%2Fslidenews%2F51_img%2F2017_11%2F39335_5601977_985964.jpg",
              "userName": "保罗骑士《17792540123》",
              "giftName": "宝马M4",
              "time": "1503317510"
            },

            {
              "userIcon": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1503397738814&di=e02d0a55939b6b9f96a319926a6ec0fa&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201307%2F06%2F20130706143248_KCuxU.jpeg",
              "userName": "阿里巴巴与四十大盗",
              "giftName": "氢气球",
              "time": "1503087510"
            },

            {
              "userIcon": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1503397738814&di=86b5c0488b6159c977c1fe7e21a7007a&imgtype=0&src=http%3A%2F%2Fp15.qhimg.com%2Ft011ff6aade1191a7f4.png",
              "userName": "汉堡牛哥",
              "giftName": "冰棒",
              "time": "1501387510"
            }

          ];

          // 修改json值
          for (var i = 0; i < successData.length; i++) {
            var item = successData[i];

            var dateTimeStamp = new Date();
            dateTimeStamp.setTime(item.time * 1000);

            var result;
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var now = new Date().getTime();
            var diffValue = now - dateTimeStamp;
            if (diffValue < 0) {
              return;
            }
            var monthC = diffValue / month;
            var weekC = diffValue / (7 * day);
            var dayC = diffValue / day;
            var hourC = diffValue / hour;
            var minC = diffValue / minute;
            if (monthC >= 1) {
              if (monthC <= 12)
                result = "" + parseInt(monthC) + "月前";
              else {
                result = "" + parseInt(monthC / 12) + "年前";
              }
            }
            else if (weekC >= 1) {
              result = "" + parseInt(weekC) + "周前";
            }
            else if (dayC >= 1) {
              result = "" + parseInt(dayC) + "天前";
            }
            else if (hourC >= 1) {
              result = "" + parseInt(hourC) + "小时前";
            }
            else if (minC >= 1) {
              result = "" + parseInt(minC) + "分钟前";
            } else {
              result = "刚刚";
            }

            // 转化时间戳
            item.time = result;
          }

          if (pageIndex == 1) {
            that.setData({
              dataList: successData,
            });
          } else {
            that.setData({
              dataList: that.data.dataList.concat(successData),
            });
          }
        },
        fail: function () {
          console.log("失败了");
        }
      });
    },

})
