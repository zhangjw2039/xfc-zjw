import { queryString } from './utils/api.js'

App({
  // 全局数据
  stroe: {
    token: ''
  },
  
  // 获取token值
  getToken() {
    const urlStr = queryString({
      grant_type: 'client_credentials',
      client_id: 'YBpe4KwCiZgBGzHcHOwaIiod',
      client_secret: '7PvzY1lL3dguEdR3yrKFuZAA4OG6Ttiw'
    })
    console.log(urlStr)
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token' + urlStr,
      success: (res) => {
        this.stroe.token = res.data.access_token
      },
      fail: () => {
        wx.showToast({
          title: '请求 AI 接口失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    this.getToken()
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
  
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
