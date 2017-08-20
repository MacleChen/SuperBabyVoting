//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        id: "0213",
        windowHeight: 654,
        maxtime: "",
        currentSwiperIndex: 0,
        isHiddenLoading: true,
        isHiddenToast: true,
        animationMiddleHeaderItem: '',
        dataList: {},
        dataUserImagesList: ["https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502600177235&di=c41b5668d323d6e9f01c831dade59443&imgtype=0&src=http%3A%2F%2Fa1.att.hudong.com%2F02%2F70%2F19300001203917131453704070758.jpg", "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502600209447&di=b7743b31dba38d5a289abf308e1f6a72&imgtype=0&src=http%3A%2F%2Fclubfiles.liba.com%2F2007%2F07%2F26%2F17%2F8918980.jpg", "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502600209446&di=9c52e7a1f89f035412dc7f9638f9ac6e&imgtype=0&src=http%3A%2F%2Fwww.51kids.com%2FDS_ModelVote%2FImage%2F201006%2F1410552614.jpg"],
    },
    //获取列表残过来的参数 id   (页面初始化方法)
    onLoad: function (options) {
      var id = options.id;
      wx.showToast({
        title: 'id ='+id,
      });

      this.setData({
        id: options.id,
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
      wx.previewImage({
        urls: e.currentTarget.dataset.array,
        current: e.currentTarget.dataset.id,
      })
    },

    // 我也要参加
    iWantToPartIn: function(e) {
      console.log("i want to partin");
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../takePartin/takePartin?id=' + id
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
      wx.showToast({
        title: '投票成功~',
      })
    },

    // 送礼物
    sendBabyGift: function(e) {
      console.log("送礼物");
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../babyGift/babyGift?id=' + id
      });
    }

})
