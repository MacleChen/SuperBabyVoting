//index.js
//获取应用实例
var app = getApp()
var config = require('../../superBaby/config')

/**网络请求接口 */
// 获取首页相关信息
const webInterface_getHomeInfo = `${config.host}subject/getLatest`
// 获取宝宝列表
const webInterface_getMoreBabyList = `${config.host}partner/search`
// 获取活动宣传文字和图片
const webInterface_getHomeIntroduce = "getHomeIntroduce"

Page( {
  data: {
    hostImage: config.hostImage,
    windowHeight: 654,
    isHiddenLoading: true,
    isHiddenToast: true,
    dataTopShowInfo: {},  // 首页顶部相关数据
    pageIndex: 1,         // list当前页码-- 页面从1开始
    dataList: [],         // 超级宝宝list
    introduceData: {},    // 活动宣传数据
    countDownDay: '00',
    countDownHour: '0',
    countDownMinute: '00',
    countDownSecond: '00',
    searchInputText: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.setData( {
      windowHeight: wx.getStorageSync( 'windowHeight' ),
    });
  },

  // 页面渲染完成后 调用
  onReady: function () {
    // 首页相关数据请求
    this.webInterfaceGetHomeInfo("");
    
    // 宝宝列表请求
    this.webInterfaceGetMoreBabyListData("");
  },

  // 下拉刷新监测
  onPullDownRefresh: function (){
    wx.stopPullDownRefresh();

    // 首页相关数据请求
    this.webInterfaceGetHomeInfo("");

    // 宝宝列表请求
    this.setData({
      pageIndex: 1,     // 搜索页码归1
    });
    this.webInterfaceGetMoreBabyListData("");
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


  // 搜索框的数值改变时调用
  inputTextChange: function(e) {
  this.setData({
    searchInputText: e.detail.value
  });
  },

  // 搜索按钮的点击响应
  searchButtonClick: function(e) {
    var searchText = this.data.searchInputText;
    if (searchText.length <= 0) {
      this.webInterfaceGetMoreBabyListData("");
      wx.showToast({
        title: "请输入搜索词",
      });
    } else {
        console.log(searchText);
        // 搜索
        this.setData({
          pageIndex: 1,     // 搜索页码归1
        });
        this.webInterfaceGetMoreBabyListData(searchText);
    }
    
  },

  //cell事件处理函数
  bindCellViewTap: function (e) {
    var babyId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../babyDetail/babyDetail?id=' + babyId
    });
  },

  // 投票按钮点击事件
  voteClick: function(e) {
    var babyID = e.currentTarget.dataset.id; 
    console.log("投票=" + babyID);
  },

  // 查看更多
  lookMoreBabyList: function (e) {
    this.setData({
      pageIndex: ++this.data.pageIndex,
    });
    this.webInterfaceGetMoreBabyListData("");
  },

  // 点击图片预览
  imageLongPreViewClick: function (e) {
    var imageUrl = e.currentTarget.dataset.id;
    var imagesArray = [];
    for (var index = 0; index < this.data.dataTopShowInfo.subjectDesImages.length; index++){
      var item = this.data.dataTopShowInfo.subjectDesImages[index];
      imagesArray.push(config.hostImage + item.image);
    }

    wx.previewImage({
      current: imageUrl,
      urls: imagesArray,
    });
  },

  /** 网络接口请求 */
  // 获取首页图片和整理数据
  webInterfaceGetHomeInfo: function(e) {
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
        var qrcode = res.data.data.qrcode;
        res.data.data.subjectDesImages.push({ "image": qrcode});
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

  // 获取更多的宝宝列表
  webInterfaceGetMoreBabyListData: function(e) {
    var pageIndex = this.data.pageIndex;
    var that = this;
    //  请求数据
    wx.request({
      url: webInterface_getMoreBabyList,
      data: {
        keyword: e,
        pageCode: pageIndex,
        pageSize: "20",
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
        
        var successData = res.data.data.beanList;
        if (successData.length == 0) {
          that.setData({
            pageIndex: pageIndex,
          });
          return;
        }

        if (pageIndex == 1) {
          that.setData({
            dataList: successData,
          });
        } else {
          that.setData({
            dataList: that.data.dataList.concat(successData),
          });
        }
      },
      fail: function () {
        console.log("失败了");
      }
    });
  },
})
