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

    //cell事件处理函数
    bindCellViewTap: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
          url: '../babyDetail/babyDetail?id=' + id
        });
    },
})
