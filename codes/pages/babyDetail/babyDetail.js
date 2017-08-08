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
        dataList: {}
    },
    //获取列表残过来的参数 id
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
    }
})
