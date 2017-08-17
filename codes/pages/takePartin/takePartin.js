//takePartin.js
//获取应用实例
var app = getApp()
Page( {
  data: {
    windowHeight: 654,
    maxtime: "",
    isHiddenLoading: true,
    isHiddenToast: true,
    dataList: {},
    countDownDay: 0,
    countDownHour: 0,
    countDownMinute: 0,
    countDownSecond: 0,
    searchInputText: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.setData( {
      windowHeight: wx.getStorageSync( 'windowHeight' ),
    });
  },

})
