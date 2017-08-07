//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        id: "0213",
        windowHeight: 654,
        maxtime: "",
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
    }
})
