//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        windowHeight: 654,
        maxtime: "",
        isHiddenLoading: true,
        isHiddenToast: true,
        dataList: {},
        selectedGiftIndex: 0,
    },
    onLoad: function () {
        this.setData({
            windowHeight: wx.getStorageSync('windowHeight') + 44,
        });
    },

    // 选中礼物cell
    bindCellViewTap: function(e) {
      var giftIndex = e.currentTarget.dataset.id;
      this.setData({
        selectedGiftIndex: giftIndex,
      });
    },

    // 微信支付
    weiXinPayBtnClick: function(e) {
      // 1. 向服务器发送支付请求
      wx.showLoading({
        title: '获取支付信息...',
        mask: true,
      });

      // 2. 如请求成功后，获取服务器返回的数据进行微信支付
      wx.requestPayment({
        timeStamp: '',
        nonceStr: '',
        package: '',
        signType: '',
        paySign: '',
      })
    },
})
