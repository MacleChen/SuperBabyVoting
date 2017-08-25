//takePartin.js
//获取应用实例
var app = getApp()

var config = require('../../superBaby/config')

/**网络请求接口 */
// 获取首页相关信息
const webInterface_getHomeInfo = `${config.host}subject/getLatest`

// 上传宝宝图片的接口
const webInterface_uploadBabyImages = `${config.host}partner/uploadPartnerImg`

// 确定参与的请求接口
const webInterface_sureBabyTakePartIn = `${config.host}partner/save`

Page( {
  data: {
    id: "",
    subjectId: "",
    hostImage: config.hostImage,
    windowHeight: 654,
    maxtime: "",
    isHiddenLoading: true,
    isHiddenToast: true,
    selectedImageFilePaths: [],
    coverIndex: 0,  // 封面索引
    inputUserName: '',
    inputPhoneNum:'',
    dataTopShowInfo: {},  // 首页顶部相关数据
    textAreaDeclaration: "", // 宣言
    imageUploadCount: 0,    // 图片上传数统计
    parnter: {},          // 请求成功返回的parnter
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    this.$wuxToast = app.wux(this).$wuxToast;
    this.setData( {
      id: options.id,
      subjectId: options.subjectId,
      windowHeight: wx.getStorageSync( 'windowHeight' ) + 44,
    });
  },

  // 界面渲染完毕后调用
  onReady: function (e) {
    // 网络请求 - 获取首页相关信息
    this.webInterfaceGetHomeInfo();
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

  // 填写宣言
  textareaChange: function (e) {
    this.setData({
      textAreaDeclaration: e.detail.value
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
    if (this.data.inputUserName.length > 20) {
      this.$wuxToast.show({
        type: 'text',
        timer: 1500,
        text: '姓名不能超过20个字符',
      });
      return;
    }

    // 验证手机号
    var mobile = this.data.inputPhoneNum;
    if (mobile.length != 11) {
      this.$wuxToast.show({
        type: 'text',
        timer: 1500,
        text: '手机号长度有误',
      });
      return;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      this.$wuxToast.show({
        type: 'text',
        timer: 1500,
        text: '手机号格式有误',
      });
      return;
    } 

    // 确认报名
    wx.showLoading({
      title: '提交宝宝信息中...',
      mask: true
    });
    // 上传参与者信息
    this.webInterfaceSureBabyTakePartIn();
  },


  /** 网络接口请求 */
  // 获取首页图片和整理数据
  webInterfaceGetHomeInfo: function (e) {
    var that = this;
    //  请求数据
    wx.request({
      url: webInterface_getHomeInfo,
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

        console.log("data:" + res.data.data.createdTime);
        that.setData({
          dataTopShowInfo: res.data.data,
        });
      },
      fail: function () {
        console.log("失败了");
      }
    });
  },


  // 上传宝宝图片的接口
  webInterfaceUploadBabyImages: function (e) {
    var that = this;
    var filePath = e;
    var isShow = "false";
    if (that.data.selectedImageFilePaths.length == 2) {
      for (var i = 0; i < that.data.selectedImageFilePaths.length; i++) {
        var imageLocalPath = that.data.selectedImageFilePaths[i];
        if (imageLocalPath == e && i == that.data.coverIndex){
          isShow = "true";
          break;
        }
      }
    } else {
      isShow = "true";
    }

    //  请求数据
    wx.uploadFile({
      url: webInterface_uploadBabyImages,
      filePath: filePath,
      name: 'file',
      formData: {
        'partnerId': that.data.parnter.id,      //this.data.id
        'subjectId': that.data.parnter.subjectId,
        'isShow': isShow
      },
      success: function (res) {
        if (res.statusCode != 200) {
          wx.hideLoading();
          that.$wuxToast.show({
            type: 'text',
            timer: 1500,
            text: res.data,
          });
          console.log("data:" + res.data);
          return;
        }
        // var status = res.data.status;
        // if (status != 101) {
        //   wx.hideLoading();
        //   that.$wuxToast.show({
        //     type: 'text',
        //     timer: 1500,
        //     text: "请求数据失败",
        //   });
        //   console.log("data123:" + res.data.msg);
        //   return;
        // }ss
        that.setData({
          imageUploadCount: ++that.data.imageUploadCount
        });
        console.log(res.data.data);
        if (that.data.imageUploadCount == that.data.selectedImageFilePaths.length) {
            // 上传图片成功
          console.log(res);
          // 提交宝宝信息成功
          wx.hideLoading();
          wx.showToast({
            title: '已参加成功~',
          });

          // 保存partner
          app.data.userInfo.partner = that.data.parnter;
          var timeOut = setTimeout(function () {
            wx.navigateBack({
              delta: 2,
            });   // 返回上一界面
            clearTimeout(timeOut);
          }.bind(that), 2000);
        // 延时执行
        }
      },
      fail: function (error) {
        wx.hideLoading();
        that.$wuxToast.show({
          type: 'text',
          timer: 1500,
          text: "网络异常s",
        });
      }
    });
  },

  // 确定参与的请求接口
  webInterfaceSureBabyTakePartIn: function (e) {
    var that = this;
    //  请求数据
    wx.request({
      url: webInterface_sureBabyTakePartIn,
      data: {
        subjectId: that.data.subjectId,
        userId: app.data.userInfo.id,
        name: that.data.inputUserName,
        phoneNumber: that.data.inputPhoneNum,
        declaration: that.data.textAreaDeclaration
      },
      method: "GET",
      success: function (res) {
        if (res.statusCode != 200) {
          wx.hideLoading();
          console.log("data:" + res.data);
          return;
        }
        if (res.data.status != 101) {
          wx.hideLoading();
          console.log("data:" + res.data.msg);
          return;
        }

        that.setData({
          parnter: res.data.data,
        });
        // 上传参与者信息之后，再上传图片
        for (var i = 0; i < that.data.selectedImageFilePaths.length; i++) {
          var imageLocalPath = that.data.selectedImageFilePaths[i];
          if (that.data.selectedImageFilePaths.length == 2) {
            that.webInterfaceUploadBabyImages(imageLocalPath);
          } else {
            that.webInterfaceUploadBabyImages(imageLocalPath[0]);
          }
          
        }
      },
      fail: function () {
        wx.hideLoading();
        console.log("失败了");
      }
    });
  },

})
