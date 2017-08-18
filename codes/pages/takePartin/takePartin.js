//takePartin.js
//获取应用实例
var app = getApp()
Page( {
  data: {
    windowHeight: 654,
    maxtime: "",
    isHiddenLoading: true,
    isHiddenToast: true,
    selectedImageFilePaths: [],
    coverIndex: 0,  // 封面索引
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.setData( {
      windowHeight: wx.getStorageSync( 'windowHeight' ) + 44,
    });
  },


  // 添加图片
  addImageBtnCLick: function(e) {
    var that = this;
    var imagesArray = that.data.selectedImageFilePaths;
    if (imagesArray.length >= 2) {
      wx.setTopBarText({
        Text: '最多选择2张图片',
      });
    } else {
      wx.chooseImage({
        count: 2 - imagesArray.length,
        success: function (res) {
          if (res.tempFilePaths.length == 2) {
            imagesArray = res.tempFilePaths;
          } else {
            imagesArray.push(res.tempFilePaths);
          }
          console.log(res);
          that.setData({
            selectedImageFilePaths: imagesArray,
          });
        },
      });
    }
  },

})
