var config = require('./config')
var constant = require('./constant')

const LOGIN_URL = `${config.host}/WeixinVote/user/login`;//NAMI登录服务
const FULL_USER_INFO_URL = `${config.host}/WeixinVote/user/getUserInfo`;//获取unionid并保存在服务端
const CHECK_LOGIN_URL = `${config.host}/WeixinVote/user/checkLosgin`;//校验是否登录

/**
 * 校验登录
 */
var checkLogin = (success, fail) => {
    var openId = wx.getStorageSync(constant.OPEN_ID);
    if (!openId) {
        typeof fail == "function" && fail();
    } else {
        wx.checkSession({
            success: function () {
                wx.request({
                    url: CHECK_LOGIN_URL,
                    data: {
                      openId: openId
                    },
                    complete: function (res) {
                      if (res.statusCode == 200 && res.data.data != null) {//成功
                            typeof success == "function" && success();
                      } else {//失败
                            typeof fail == "function" && fail();
                      }
                    }
                })
            },
            fail: function () {
                typeof fail == "function" && fail();
            }
        })
    }
}

/**
 * 登录
 */
var login = (success, fail) => {
    checkLogin(() => {
        //DO NOTHING
        console.log("已登录");
    }, () => {
        remoteLogin(success, fail)
    });
}

/**
 * 服务端请求登录
 */
var remoteLogin = (success, fail) => {
    //调用登录接口
    wx.login({
        success: function (loginRes) {
            console.log("登录获取code", loginRes);
            wx.request({
                url: LOGIN_URL,
                data: {
                    code: loginRes.code
                },
                complete: function (res) {
                    if (res.statusCode != 200) {//失败
                        console.error("登陆失败", res);
                        var data = res.data || { msg: '无法请求服务器' };
                        if (typeof fail == "function") {
                            fail();
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: data.msg,
                                showCancel: false
                            });
                        }
                    } else {//成功
                        console.log("登录成功", res);
                        wx.setStorage({
                            key: constant.OPEN_ID,
                            data: res.data.data.openId
                        })
                        typeof success == "function" && success();
                    }
                }
            })
        }
    })
}

var getUserInfo = (success, fail) => {
    wx.getUserInfo({
        success: function (res) {
            console.log("获取用户信息", res);
            var userInfo = res.userInfo
            if (config.fullLogin) {//需要处理unionID
                wx.request({
                    url: FULL_USER_INFO_URL,
                    data: {
                        openId: wx.getStorageSync(constant.OPEN_ID),
                        encryptedData: res.encryptedData,
                        iv: res.iv
                    }, success: function (requestRes) {
                        typeof success == "function" && success(userInfo);
                    }
                });
            } else {
                typeof success == "function" && success(userInfo);
            }
        }, fail: function () {
            typeof fail == "function" && fail();
        }
    })
}

module.exports = {
    login: login,
    checkLogin: checkLogin,
    getUserInfo: getUserInfo
}