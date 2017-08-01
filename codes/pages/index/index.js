//index.js
//获取应用实例
var app = getApp()

// register a page
Page({
  data: {
    motto: 'hello world',
    userInfo: {},
    myTextName: 'chenfan'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  // 更改姓名处理函数
  changMyName: function(e) {
    wx.showToast({
      title: '点我干嘛',
    })
    this.setData({
      myTextName: 'OK!'
    })
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      // 更改头像数据
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
