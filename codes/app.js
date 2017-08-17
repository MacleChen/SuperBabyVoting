import superBaby from '/superBaby/index';

//app.js
App({
  data: {
    userInfo: null
  },

    onLaunch: function () {
      var that = this;

        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs);
        wx.getSystemInfo({
            success: function (res) {
                console.log("屏幕高度" + res.windowHeight);
                wx.setStorageSync("windowHeight", res.windowHeight)
            }
        });

      // 登录自己的服务器
        superBaby.login(() => {
          superBaby.getUserInfo((userInfo) => {
            console.log("已获取数据", userInfo);
            that.data.userInfo = userInfo;
          }, () => {
            console.log("用户拒绝提供信息");
          });
        });
    },
})
