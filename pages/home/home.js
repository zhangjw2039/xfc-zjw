// pages/home/home.js
const app = getApp()
import { queryString } from '../../utils/api.js'

const faceMap = {
  emotion: {
    angry: '愤怒',
    disgust: '厌恶',
    fear: '恐惧',
    happy: '高兴',
    sad: '伤心',
    surprise: '惊讶',
    neutral: '无表情',
    pouty: '撅嘴',
    grimace: '鬼脸'
  },
  expression: {
    none: '不笑', smile: '微笑', laugh: '大笑'
  },
  gender: {
    male: '男生', female: '女生'
  },
  glasses: {
    none: '无眼镜', common: '普通眼镜', sun: '墨镜'
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wh: 0,
    isBack: true,
    photoSrc: '',
    face: null,
    isShowPic: false,
    map: faceMap
  },

  // 点击切换摄像头
  reversehandle() {
    console.log(123)
    this.setData({
      isBack: !this.data.isBack
    })
  },

  // 点击拍照函数
  takePhoto() {
    wx.createCameraContext().takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          photoSrc: res.tempImagePath,
          isShowPic: true
        }, () => {
          this.getFaceInfo()
        })
      },
      fail: () => {
        this.setData({
          photoSrc: ''
        })
      }
    })
  },

  // 选择照片
  choosePhoto() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success: (res) => {
        res.tempFilePaths.length && this.setData({
          photoSrc: res.tempFilePaths[0],
          isShowPic: true
        }, () => {
          this.getFaceInfo()
        })
      },
      fail: () => {
        wx.showToast({
          title: '选择相片失败',
          icon: 'none'
        })
        this.setData({
          photoSrc: ''
        })
      }
    })
  },

  // 重新选择照片
  chooseAgin() {
    this.setData({
      photoSrc: '',
      isShowPic: false,
      face: null
    })
  },

  // 测颜值函数
  getFaceInfo() {
    const { token } = app.stroe
    if (token) {
      const fm = wx.getFileSystemManager()
      const photoBase64 = fm.readFileSync(this.data.photoSrc, 'base64')

      wx.showLoading({
        title: '正在获取数据',
      })
      wx.request({
        method: 'POST',
        url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect' + queryString({
          access_token: app.stroe.token
        }),
        data: {
          image: photoBase64,
          image_type: 'BASE64',
          face_field: 'age,beauty,expression,gender,glasses,emotion'
        },
        success: (res) => {
          const { data: { result } } = res
          console.log(result)
          if (result && result.face_list.length) {
            const {
              age,
              beauty,
              emotion: {
                type: emotion
              },
              expression: {
                type: expression
              },
              gender: {
                type: gender
              },
              glasses: {
                type: glasses
              }
            } = result.face_list[0];
            console.log(123)
            // 存储需要的数据。
            this.setData({
              face: {
                age,
                beauty,
                emotion,
                expression,
                gender,
                glasses
              }
            });
            console.log(this.data.face)
          }
        },
        fail() {
          wx.showToast({
            title: '人脸识别失败！',
            icon: 'none'
          })
        },
        complete() {
          wx.hideLoading()
        }
      })
    }else {
      wx.showToast({
        title: '连接 AI 接口失败',
        icon: 'none'
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const windowInfo = wx.getSystemInfoSync()
    this.setData({
      wh: windowInfo.windowHeight
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})