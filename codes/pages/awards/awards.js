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
            windowHeight: wx.getStorageSync('windowHeight')
        });
    },
    // 下拉刷新
    upper: function (e) {
        console.log("下拉刷新了");
    },
    // 加载 
    lower: function (e) {
        console.log("加载更多了");
    },
    closeToast: function (e) {
        this.setData({
            isHiddenToast: true
        });
    }
})
