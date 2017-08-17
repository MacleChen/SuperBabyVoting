var login = require('./login.js')
var http = require('./http.js')

module.exports = {
    login: login.login,
    checkLogin: login.checkLogin,
    getUserInfo: login.getUserInfo,
    request: http.request
}