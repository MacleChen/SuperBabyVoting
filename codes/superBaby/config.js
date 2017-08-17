/**
 * 连接NAMI服务端地址
 */
const HOST = "https://my.test.com";

/**
 * 是否需要获取unionid
 * 若此项为true,则登录时候会多做一步服务端完全资料获取(包括获取unionid)
 */
const FULL_LOGIN = true;

module.exports = {
  host: HOST,
  fullLogin: FULL_LOGIN
}