// app.js
App({
  onLaunch() {
    //获取当前时间的日期
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var signtimeString =String(year)+String(month) + String(strDate-1)
    var checktimeString =String(year)+String(month) + String(strDate)
    var signtime = parseInt(signtimeString)
    var checktime = parseInt(checktimeString)
    this.globalData.signtime = signtime
    this.globalData.checktime = checktime
    console.log("全局的签到时间：",signtime);  //签到时间
    console.log("签到的校验时间：",checktime);  //签到时间
    
    //请先调用 wx.cloud.init() 完成初始化后再调用其他云 API。
    if(!wx.cloud){
      console.error('请使用2.2.3或以上的基础库以使用云能力')
    }else{
      wx.cloud.init({
        traceUser:true
      })
    }
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: '',
    signtime:'',
    checktime:'',
    day: {             //默认展示的用户星座数据
      summary_star:'',
      love_star:'',
      money_star:'',
      work_star:'',
      grxz:'',
      lucky_num:'',
      lucky_time:'',
      lucky_direction:'',
      day_notice:'',
      general_txt:'',
      love_txt:'',
      work_txt:'',
      money_txt:'',
      time:'',
      lucky_color:'',
    },
    tomorrow: {             //默认展示的用户星座数据
      summary_star:'',
      love_star:'',
      money_star:'',
      work_star:'',
      grxz:'',
      lucky_num:'',
      lucky_time:'',
      lucky_direction:'',
      day_notice:'',
      general_txt:'',
      love_txt:'',
      work_txt:'',
      money_txt:'',
      time:'',
      lucky_color:'',
    },
    week: {             //默认展示的用户星座数据
      summary_star:'',
      love_star:'',
      money_star:'',
      work_star:'',
      grxz:'',
      lucky_num:'',
      lucky_time:'',
      lucky_direction:'',
      day_notice:'',
      general_txt:'',
      love_txt:'',
      work_txt:'',
      money_txt:'',
      time:'',
      lucky_color:'',
    },
      dayrow1: "",
      dayrow2: "",
      dayrow3: "",
      dayrow4: "",
      weekrow1: "",
      weekrow2: "",
      weekrow3: "",
      weekrow4: "",
      tomorrowrow1: "",
      tomorrowrow2: "",
      tomorrowrow3: "",
      tomorrowrow4: "",
      showModalStatus: false,  //抽屉默认不展示
  }
})
