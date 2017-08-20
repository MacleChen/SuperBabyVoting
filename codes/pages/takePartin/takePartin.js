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
    inputUserName: '',
    inputPhoneNum:'',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.$wuxToast = app.wux(this).$wuxToast;
    this.setData( {
      windowHeight: wx.getStorageSync( 'windowHeight' ) + 44,
    });
  },

  // 输入姓名的响应
  inputUserNameChange: function(e) {
    this.setData({
      inputUserName: e.detail.value
    });
  },

  // 输入手机号的响应
  inputPhoneNumChange: function (e) {
    this.setData({
      inputPhoneNum: e.detail.value
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

  // 删除图片
  deleteImageClick: function (e) {
    var index = e.currentTarget.dataset.id;
    var imagesArray = this.data.selectedImageFilePaths;
    imagesArray.splice(index, 1);
    this.setData({
      selectedImageFilePaths: imagesArray,
    });
  },

  // 已设置成封面点击响应
  selectedCoverClick: function (e) {
    wx.showToast({
      title: '已是封面图片',
    })
  },

  // 设置为封面
  setCoverCLick: function (e) {
    var index = e.currentTarget.dataset.id;
    this.setData({
      coverIndex: index,
    });
  },


  // 确认报名
  sureTakePartinClick: function(e) {
    // 判断姓名是否输入
    if (this.data.inputUserName.length == 0) {
      this.$wuxToast.show({
        type: 'text',
        timer: 1500,
        text: '请输入姓名',
      });
      return;
    }

    // 判断手机号是否输入
    if (this.data.inputPhoneNum.length == 0) {
      this.$wuxToast.show({
        type: 'text',
        timer: 1500,
        text: '请输入手机号',
      });
      return;
    }

    // 判断图片是否输入
    if (this.data.selectedImageFilePaths.length == 0) {
      this.$wuxToast.show({
        type: 'text',
        timer: 1500,
        text: '请上传图片',
      });
      return;
    }

    // 验证姓名
    // 验证手机号

    // 确认报名
    wx.showToast({
      title: '报名信息：' + this.data.inputUserName + this.data.inputPhoneNum + this.data.selectedImageFilePaths,
    })
  },

})
