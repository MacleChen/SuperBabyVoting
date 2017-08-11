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
        dataList: {}
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

    // 投票按钮点击
    voteClick: function (e) {
      
    },
})
