//index.js
//获取应用实例
var app = getApp()

var config = require('../../superBaby/config')

/**网络请求接口 */
// 获取宝贝的详情数据
const webInterface_getBabyDetailInfo = `${config.host}partner/detail`

// 获取赠送的礼物列表数据
const webInterface_getSendBabyGiftList = `${config.host}gift/getGiftList`

// 微信支付- 统一下单
const webInterface_getSendBabyPrepay = `${config.host}user/prePay`

// 送礼完成后记录
const webInterface_sendBabyGiftLog = `${config.host}partner/giftLog`

Page({
    data: {
        id: "",
        hostImage: config.hostImage,
        windowHeight: 654,
        maxtime: "",
        isHiddenLoading: true,
        isHiddenToast: true,
        babyDetial: {},       // 宝宝详情数据
        dataList: {},         // 赠送的礼物列表数据
        selectedGiftIndex: 0,
    },
    onLoad: function (options) {
        this.setData({
          id: options.id,
          windowHeight: wx.getStorageSync('windowHeight') + 44,
        });
    },

    // 视图渲染完响应
    onReady: function (e) {
      // 网络请求 -  获取宝宝的详情数据
      this.webInterfaceGetBabyDetailInfo();

      // 网络请求 - 获取赠送的礼物列表数据
      this.webInterfaceGetSendBabyGiftList();
    },

    // 选中礼物cell
    bindCellViewTap: function(e) {
      var giftIndex = e.currentTarget.dataset.id;
      this.setData({
        selectedGiftIndex: giftIndex,
      });
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


    // 获取赠送的礼物列表数据
    webInterfaceGetSendBabyGiftList: function (e) {
      var that = this;
      //  请求数据
      wx.request({
        url: webInterface_getSendBabyGiftList,
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

          that.setData({
            dataList: res.data.data,
          });
        },
        fail: function () {
          console.log("失败了");
        }
      });
    },

    // 微信支付 - 统一下单接口
    weiXinPayBtnClick: function (e) {
      // 1. 向服务器发送支付请求
      wx.showLoading({
        title: '获取支付信息...',
        mask: true,
      });
      
      var that = this;
      // 获取选择的礼物对象
      var giftObject = that.data.dataList[that.data.selectedGiftIndex];
      
      //  请求数据
      wx.request({
        url: webInterface_getSendBabyPrepay,
        data: {
          totalFee: giftObject.price,
          openId: app.data.userInfo.openId
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

          // 隐藏加载状态
          wx.hideLoading();
          // 2. 如请求成功后，获取服务器返回的数据进行微信支付
          // 2.1 获取当前时间戳
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;    // s
          console.log(timestamp);  
          wx.requestPayment({
            timeStamp: timestamp,
            nonceStr: '',
            package: '',
            signType: 'MD5',
            paySign: '',
            success: function (res) {
              if (res.errMsg.requestPayment == "ok") {
                console.log("支付成功");
                // 支付完成后 送礼完成后记录
                that.webInterfaceSendBabyGiftLog();
              }
              
            },
            fail: function (res) {
              if (res.errMsg.requestPayment == "cancel") {
                console.log("支付取消");
              } else {
                console.log("支付失败");
              }
              
            }
          })
        },
        fail: function () {
          console.log("失败了");
        }
      });
    },


    // 送礼完成后记录
    webInterfaceSendBabyGiftLog: function (e) {
      var that = this;
      //  请求数据
      // 获取选择的礼物对象
      var giftObject = that.data.dataList[that.data.selectedGiftIndex];
      wx.request({
        url: webInterface_sendBabyGiftLog,
        data: {
          partnerId: that.data.id,
          userId: app.data.userInfo.id,
          giftId: giftObject.id,
          giftName: giftObject.name
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

})
