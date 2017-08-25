//index.js
//获取应用实例
var app = getApp()
var config = require('../../superBaby/config')

/**网络请求接口 */
// 获取奖品的相关信息接口
const webInterface_getAwardsInfo = `${config.host}award/getAwardList`

Page({
    data: {
        hostImage: config.hostImage,
        windowHeight: 654,
        isHiddenLoading: true,
        isHiddenToast: true,
        introduceData: [],
    },
    onLoad: function () {
        this.setData({
            windowHeight: wx.getStorageSync('windowHeight')
        });
    },

    // 视图渲染完毕后响应的方法
    onReady: function (e) {

      // 获取奖品的相关信息接口
      this.webInterfaceGetAwardsInfo();
    },

    // 长按图片预览
    imageLongPreViewClick: function (e) {
      var imageUrl = e.currentTarget.dataset.id;

      var imagesArray = [];
      for (var index = 0; index < this.data.introduceData.length; index++) {
        var item = this.data.introduceData[index];
        imagesArray.push(config.hostImage + item.image);
      }

      wx.previewImage({
        current: imageUrl,
        urls: imagesArray,
      });
    },

    
    /** 网络请求 */
    // 获取奖品的相关信息接口
    webInterfaceGetAwardsInfo: function (e) {
      var that = this;
      //  请求数据
      wx.request({
        url: webInterface_getAwardsInfo,
        method: "GET",
        success: function (res) {
          if (res.statusCode != 200) {
            console.log("data:" + res.data);
            return;
          }
          if (res.data.status != 101) {
            console.log("data123:" + res.data.msg);
            return;
          }

          console.log("data:" + res.data.data);
          that.setData({
            introduceData: res.data.data,
          });
        },
        fail: function () {
          console.log("失败了");
        }
      });
    },
})
