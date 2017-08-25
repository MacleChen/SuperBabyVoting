//index.js
//获取应用实例
var app = getApp()
var config = require('../../superBaby/config')

/**网络请求接口 */
// 获取首页相关信息
const webInterface_getHomeInfo = `${config.host}subject/getLatest`
// 获取宝宝排行榜列表
const webInterface_getBabyRankList = `${config.host}rank/getRank`

Page({
    data: {
        hostImage: config.hostImage,
        windowHeight: 654,
        maxtime: "",
        isHiddenLoading: true,
        isHiddenToast: true,
        dataTopShowInfo: {}, // 首页相关数据
        dataList: [],        // 宝宝排行榜数据list
        countDownDay: '00',
        countDownHour: '0',
        countDownMinute: '00',
        countDownSecond: '00',
    },

    onLoad: function () {
      this.setData({
        windowHeight: wx.getStorageSync('windowHeight')
      });
    },

    // 页面渲染完成后 调用
    onReady: function () {
      // 首页相关数据请求
      this.webInterfaceGetHomeInfo("");

      // 获取宝宝的排行榜
      this.webInterface_getBabyRankList();

      // console.log("用户信息" + app.data.userInfo.avatarUrl);
    },

    // 设置倒计时
    deadLineTimeSetting: function (e) {
      var currentmillSecond = Date.parse(new Date());
      var totalSecond = e - currentmillSecond / 1000;

      // 判断活动是否开始
      if (this.data.dataTopShowInfo.startTime > currentmillSecond) {
        wx.showToast({
          title: '活动尚未开始',
        });
        return;
      }

      var interval = setInterval(function () {
        // 秒数
        var second = totalSecond;

        // 天数位
        var day = Math.floor(second / 3600 / 24);
        var dayStr = day.toString();
        if (dayStr.length == 1) dayStr = '0' + dayStr;

        // 小时位
        var hr = Math.floor((second - day * 3600 * 24) / 3600);
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;

        // 分钟位
        var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;

        // 秒位
        var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;

        this.setData({
          countDownDay: dayStr,
          countDownHour: hrStr,
          countDownMinute: minStr,
          countDownSecond: secStr,
        });
        totalSecond--;
        if (totalSecond < 0) {
          clearInterval(interval);
          wx.showToast({
            title: '活动已结束',
          });
          this.setData({
            countDownDay: '00',
            countDownHour: '00',
            countDownMinute: '00',
            countDownSecond: '00',
          });
        }
      }.bind(this), 1000);
    },


    //cell事件处理函数
    bindCellViewTap: function (e) {
      var babyId = e.currentTarget.dataset.id;
        wx.navigateTo({
          url: '../babyDetail/babyDetail?id=' + babyId
        });
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
          that.deadLineTimeSetting(that.data.dataTopShowInfo.endTime / 1000);
        },
        fail: function () {
          console.log("失败了");
        }
      });
    },

    // 获取宝宝的排行榜
    webInterface_getBabyRankList: function (e) {
      var that = this;
      //  请求数据
      wx.request({
        url: webInterface_getBabyRankList,
        data: {
          size: "20"
        },
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

          // 获取数据成功
          that.setData({
            dataList: res.data.data,
          });
          
        },
        fail: function () {
          console.log("失败了");
        }
      });
    },
})
