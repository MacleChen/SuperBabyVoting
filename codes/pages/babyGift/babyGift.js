//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        windowHeight: 654,
        maxtime: "",
        isHiddenLoading: true,
        isHiddenToast: true,
        dataList: {}
    },
    onLoad: function () {
        this.setData({
            windowHeight: wx.getStorageSync('windowHeight') + 44,
        });
    },
})
