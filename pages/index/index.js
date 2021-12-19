const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ch: 0,
    curTab: 0,
    userInfo: {                 //用户数据
      avatarUrl:"/static/user.png",
      nickName:'未登录用户',
      signstar:0,
    },
    constellation:'tianxie',
    shareImage:'/static/sharebg.png',
    showstar:'天蝎座',  //默认展示的用户星座
    login:false,
    star:'tianxie',    //默认展示的用户星座数据

  },
  /**
   * 获取用户登录信息
   */
  //监听滑块

  // tab切换
  /**
  * 生命周期函数--监听页面加载
  */

  /**
   * 获取用户登录信息
   */
    getUserProfile(){
      var that = this;
      let signstar = 0
      let constellation = that.data.constellation
      console.log('constellation',constellation)
      let signtime = app.globalData.signtime
      let checktime = app.globalData.checktime
      let userInfo = that.data.userInfo
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log('用户资料',res.userInfo);
          this.setData({
            userInfo : res.userInfo,
            signstar : res.userInfo.signstar,
            login:true
          })
          wx.setStorageSync('user', res.userInfo)
          db.collection('user').where({
            nickName:res.userInfo.nickName
          }).get({
            success:res=>{
              console.log('当前数据库查询结果',res.data.length);
              if(res.data.length == 0){
                var userInfo = that.data.userInfo
                console.log('that.data.userInfo',that.data.userInfo);
                db.collection('user').add({
                  data:{
                    checktime:checktime,
                    nickName: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl,
                    time: new Date(),
                    signstar:0,
                    constellation:constellation
                  },success:res=>{
                    wx.showToast({
                      title: '登录成功',
                      icon:'success'
                    })
                    console.log('用户信息已经保存到数据库',res);
                  },fail:err=>{
                    console.log('用户信息保存失败！',err);
                  }
                })
              }else{
                console.log('已经记录过！');
              }
            }
          })
          console.log(res.userInfo);
          this.setData({
            userInfo: res.userInfo,
            avatarUrl:res.userInfo.avatarUrl,
            hasUserInfo: true
          })
        }
      })
      
    },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        //转为rpx
        let ch = (750 / res.screenWidth) * res.windowHeight - 80;
        this.setData({
          ch
        })
      },
    })
    var self = this;
    var unit = 36;
    var star = 'tianxie'
    let day = this.data.day
    var dayrow1 = 0
    var dayrow2 = 0
    var dayrow3 = 0
    var dayrow4 = 0
    var tomorrowrow1 = 0
    var tomorrowrow2 = 0
    var tomorrowrow3 = 0
    var tomorrowrow4 = 0
    var weekrow1 = 0
    var weekrow2 = 0
    var weekrow3 = 0
    var weekrow4 = 0
    var signstar = 0
    wx.request({
      url: 'https://route.showapi.com/872-1',
      data:{
        "star":this.data.star,
        "showapi_appid": 'xxxxxxxxx', //这里需要改成自己的appid
        "showapi_sign": 'xxxxxxxxxxxxxxxx',  //这里需要改成自己的应用的密钥secret
        "needTomorrow":"1",
        "needWeek":"1",
        "needMonth":"0",
        "needYear":"0",
      },
      success:res=>{
        console.log('onload开屏展示的信息是：',res.data);
        console.log('onload开屏展示的星座是：',res.data.showapi_res_body.star);
        console.log('onload开屏展示的运势是：',res.data.showapi_res_body.day);
        dayrow1 = 35 * res.data.showapi_res_body.day.work_star
        dayrow2 = 35 * res.data.showapi_res_body.day.money_star
        dayrow3 = 35 * res.data.showapi_res_body.day.love_star
        dayrow4 = 35 * res.data.showapi_res_body.day.summary_star
        tomorrowrow1 = 35 * res.data.showapi_res_body.tomorrow.work_star
        tomorrowrow2 = 35 * res.data.showapi_res_body.tomorrow.money_star
        tomorrowrow3 = 35 * res.data.showapi_res_body.tomorrow.love_star
        tomorrowrow4 = 35 * res.data.showapi_res_body.tomorrow.summary_star
        weekrow1 = 35 * res.data.showapi_res_body.week.work_star
        weekrow2 = 35 * res.data.showapi_res_body.week.money_star
        weekrow3 = 35 * res.data.showapi_res_body.week.love_star
        weekrow4 = 35 * res.data.showapi_res_body.week.summary_star
        self.setData({
          day:res.data.showapi_res_body.day,
          tomorrow:res.data.showapi_res_body.tomorrow,
          week:res.data.showapi_res_body.week,
          dayrow1:dayrow1,
          dayrow2:dayrow2,
          dayrow3:dayrow3,
          dayrow4:dayrow4,
          tomorrowrow1:tomorrowrow1,
          tomorrowrow2:tomorrowrow2,
          tomorrowrow3:tomorrowrow3,
          tomorrowrow4:tomorrowrow4,
          weekrow1:weekrow1,
          weekrow2:weekrow2,
          weekrow3:weekrow3,
          weekrow4:weekrow4,
        })
        // console.log("self.data.day是：",self.data.day);
        
        console.log('赋值完成的dayrow1是，',dayrow1);//赋值完成的dayrow1
        console.log('dayrow2，',dayrow2);
        console.log('dayrow3，',dayrow3);
        console.log('dayrow4，',dayrow4);
      }
    })
    db.collection('user').where({
      _openid: ""
    }).get().then(res=>{
      console.log(res);
      this.setData({
        formData:res.data
      })
      // console.log('res.data',res.data[0].signstar);
    }).catch(err=>{
      console.log(err);
    })
  },

  /**
   * 签到功能
   */
  sign: function () {
    const userInfo = wx.getStorageSync('user')
    // const signtime = app.globalData.signtime
    // console.log('签到时候的日期：',signtime);
    if(userInfo){
      db.collection('user').where({
        _openid: ""
      }).get({
        success:res=>{
          console.log('有这个人：',res);
          var that=this
          var newsignstar = res.data[0].signstar+1
          var newchecktime = res.data[0].checktime+1
          // console.log('新的签到次数:',newsignstar); //如果签到成功的新的签到次数
          db.collection('user').where({
            checktime:app.globalData.signtime + 1   //数据库签到时间和新的时间数据对比
          }).get({
            success:res=>{
              console.log('查看是否签到结果',res);  //输入是否有重合数据
              if(res.data.length == 0 ){  //如果长度为0，说明没有结果
                wx.showToast({
                  title: '你已经签到过了哦',
                })
              }else{
                //如果今天没有签到过
                db.collection('user').where({
                  _openid:''
                }).update({
                  data:{
                    signstar:newsignstar,
                    checktime:newchecktime
                  }
                }).then(res=>{
                  wx.showToast({
                    title: '签到成功',
                  })
                })
              }
            }
          })
        }
      })
    }else{
      console.log('用户还没有登录呢');
      var that = this;
      let userInfo = that.data.userInfo
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log('用户资料',res.userInfo);
          this.setData({
            userInfo : res.userInfo,
            login:true
          })
          wx.setStorageSync('user', res.userInfo)
          db.collection('user').where({
            nickName:res.userInfo.nickName
          }).get({
            success:res=>{
              if(res.data.length == 0){
                var userInfo = that.data.userInfo
                db.collection('user').add({
                  data:{
                    checktime:checktime,
                    nickName: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl,
                    time: new Date(),
                    signstar:0
                  },success:res=>{
                    wx.showToast({
                      title: '登录成功',
                      icon:'success'
                    })
                    console.log('用户信息已经保存到数据库',res);
                  },fail:err=>{
                    console.log('用户信息保存失败！',err);
                  }
                })
              }else{
                console.log('已经记录过！');
              }
            }
          })
          console.log(res.userInfo);
          this.setData({
            userInfo: res.userInfo,
            avatarUrl:res.userInfo.avatarUrl,
            hasUserInfo: true
          })
        }
      })
    }
    this.onLoad();
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
   * 抽屉效果
   */
    powerDrawer: function (e) {
      var currentStatu = e.currentTarget.dataset.statu;
      this.util(currentStatu)
    },
    util: function(currentStatu){
      /* 动画部分 */
      // 第1步：创建动画实例 
      var animation = wx.createAnimation({
        duration: 200,  //动画时长
        timingFunction: "linear", //线性
        delay: 0.3  //0则不延迟
      });
      // 第2步：这个动画实例赋给当前的动画实例
      this.animation = animation;
      // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
      animation.translateY(240).step();
      // 第4步：导出动画对象赋给数据对象储存
      this.setData({
        animationData: animation.export()
      })
      // 第5步：设置定时器到指定时候后，执行第二组动画
      setTimeout(function () {
        // 执行第二组动画：Y轴不偏移，停
        animation.translateY(0).step()
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
        this.setData({
          animationData: animation
        })
        //关闭抽屉
        if (currentStatu == "close") {
          this.setData(
            {
              showModalStatus: false
            }
          );
        }
      }.bind(this), 200)
      // 显示抽屉
      if (currentStatu == "open") {
        this.setData(
          {
            showModalStatus: true
          }
        );
      }
    },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 切换到白羊座
   */
  changetobaiyang: function () {
    let star = app.globalData.star
    star = 'baiyang'
    let showstar = app.globalData.showstar
    showstar = '白羊座'
    let showModalStatus = app.globalData.showModalStatus
    let day = app.globalData.day
    this.setData({
      showstar:showstar,
      star:star,
      showModalStatus: false,
    })
    var dayrow1 = 0
    var dayrow1 = 0
    var dayrow2 = 0
    var dayrow3 = 0
    var dayrow4 = 0
    var signstar = 0
    wx.request({
      url: 'https://route.showapi.com/872-1',
      data:{
          "star":star,
          "showapi_appid": '863945', //这里需要改成自己的appid
          "showapi_sign": 'e2a93da2650540fc87f1e36a985873ee',  //这里需要改成自己的应用的密钥secret
          "needTomorrow":"1",
          "needWeek":"1",
          "needMonth":"0",
          "needYear":"0",
      },success:res=>{
        console.log(res);
        dayrow1 = 35 * res.data.showapi_res_body.day.work_star
        dayrow2 = 35 * res.data.showapi_res_body.day.money_star
        dayrow3 = 35 * res.data.showapi_res_body.day.love_star
        dayrow4 = 35 * res.data.showapi_res_body.day.summary_star
        day = res.data.showapi_res_body.day
        this.setData({
          day:day,
          dayrow1:dayrow1,
          dayrow2:dayrow2,
          dayrow3:dayrow3,
          dayrow4:dayrow4,
        })
      },fail:err=>{
        console.log('赋值失败了！',err);
      }
    })
  },
  /**
   * 切换到金牛座
   */
  changetojinniu: function () {
    let star = this.data.star
    let showstar = this.data.showstar
    let showModalStatus = this.data.showModalStatus
    console.log('当前的star是：',star);
    console.log('当前的showStar是：',showstar);
    star = 'jinniu'
    showstar='金牛座'
    this.setData({
      star:star,
      showModalStatus: false,
      showstar:showstar
    })
    console.log('change之后的star:',star);
      var that = this;
      var unit = 36;
      let day = that.data.day
      var dayrow1 = 0
      var dayrow2 = 0
      var dayrow3 = 0
      var dayrow4 = 0
      var signstar = 0
      // console.log('旧的day是',day);
      var data=new Date
      wx.request({
        url: 'https://route.showapi.com/872-1',
        data:{
          "star":star,
          "showapi_appid": '863945', //这里需要改成自己的appid
          "showapi_sign": 'e2a93da2650540fc87f1e36a985873ee',  //这里需要改成自己的应用的密钥secret
          "needTomorrow":"1",
          "needWeek":"1",
          "needMonth":"0",
          "needYear":"0",
        },
        success:res=>{
          console.log('当前的星座是：',res.data.showapi_res_body.star);
          console.log("res.data.showapi_res_body.day是：",res.data.showapi_res_body.day); 
          day = res.data.showapi_res_body.day
          star = res.data.showapi_res_body.star
          dayrow1 = 35 * res.data.showapi_res_body.day.work_star
          dayrow2 = 35 * res.data.showapi_res_body.day.money_star
          dayrow3 = 35 * res.data.showapi_res_body.day.love_star
          dayrow4 = 35 * res.data.showapi_res_body.day.summary_star
          // console.log('dayrow1，',dayrow1);
          // console.log('dayrow2，',dayrow2);
          // console.log('dayrow3，',dayrow3);
          // console.log('dayrow4，',dayrow4);
          this.setData({
            day:day,
            star:star,
            dayrow1:dayrow1,
            dayrow2:dayrow2,
            dayrow3:dayrow3,
            dayrow4:dayrow4,
          })
          console.log('最新的day是：',day);
          console.log('最新的星座是：',star);
        }
      })
      db.collection('user').where({
        _openid: ""
      }).get().then(res=>{
        console.log(res);
        this.setData({
          formData:res.data,
          showModalStatus: false,
        })
        wx.showToast({
          title: '切换成功',
        })
        // console.log('res.data',res.data[0].signstar);
      }).catch(err=>{
        console.log(err);
      })

  },
  /**
   * 切换到双子座
   */
  changetoshuangzi: function () {
    let star = this.data.star
    let showstar = this.data.showstar
    let showModalStatus = this.data.showModalStatus
    console.log('当前的star是：',star);
    console.log('当前的showStar是：',showstar);
    star = 'shuangzi'
    showstar='双子座'
    this.setData({
      star:star,
      showModalStatus: false,
      showstar:showstar
    })
    wx.showToast({
      title: '切换成功',
    })
    console.log('change之后的star:',star);
    this.onLoad();
  },
  /**
   * 切换到巨蟹座
   */
  changetojuxie: function () {
    let star = this.data.star
    let showstar = this.data.showstar
    let showModalStatus = this.data.showModalStatus
    console.log('当前的star是：',star);
    console.log('当前的showStar是：',showstar);
    star = 'juxie'
    showstar='巨蟹座'
    this.setData({
      star:star,
      showModalStatus: false,
      showstar:showstar
    })
    wx.showToast({
      title: '切换成功',
    })
    console.log('change之后的star:',star);
    this.onLoad();
  },
  /**
   * 切换到狮子座
   */
  changetoshizi: function () {
    let star = this.data.star
    let showstar = this.data.showstar
    let showModalStatus = this.data.showModalStatus
    console.log('当前的star是：',star);
    console.log('当前的showStar是：',showstar);
    star = 'shizi'
    showstar='狮子座'
    this.setData({
      star:star,
      showModalStatus: false,
      showstar:showstar
    })
    wx.showToast({
      title: '切换成功',
    })
    console.log('change之后的star:',star);
    this.onLoad();
  },
  /**
   * 切换到处女座
   */
  changetochunv: function () {
    let star = this.data.star
    let showstar = this.data.showstar
    let showModalStatus = this.data.showModalStatus
    console.log('当前的star是：',star);
    console.log('当前的showStar是：',showstar);
    star = 'chunv'
    showstar='处女座'
    this.setData({
      star:star,
      showModalStatus: false,
      showstar:showstar
    })
    wx.showToast({
      title: '切换成功',
    })
    console.log('change之后的star:',star);
    this.onLoad();
  },
  /**
   * 切换到天秤座
   */
  changetotiancheng: function () {
    let star = this.data.star
    let showstar = this.data.showstar
    let showModalStatus = this.data.showModalStatus
    console.log('当前的star是：',star);
    console.log('当前的showStar是：',showstar);
    star = 'tiancheng'
    showstar='天秤座'
    this.setData({
      star:star,
      showModalStatus: false,
      showstar:showstar
    })
    wx.showToast({
      title: '切换成功',
    })
    console.log('change之后的star:',star);
    this.onLoad();
  },
  /**
   * 切换到天蝎座
   */
  changetotianxie: function () {
    let star = this.data.star
    let showstar = this.data.showstar
    let showModalStatus = this.data.showModalStatus
    console.log('当前的star是：',star);
    console.log('当前的showStar是：',showstar);
    star = 'tianxie'
    showstar='天蝎座'
    this.setData({
      star:star,
      showModalStatus: false,
      showstar:showstar
    })
    wx.showToast({
      title: '切换成功',
    })
    console.log('change之后的star:',star);
    this.onLoad();
  },
  /**
   * 切换到射手座
   */
  changetosheshou: function () {
    let star = this.data.star
    let showstar = this.data.showstar
    let showModalStatus = this.data.showModalStatus
    console.log('当前的star是：',star);
    console.log('当前的showStar是：',showstar);
    star = 'sheshou'
    showstar='射手座'
    this.setData({
      star:star,
      showModalStatus: false,
      showstar:showstar
    })
    wx.showToast({
      title: '切换成功',
    })
    console.log('change之后的star:',star);
    this.onLoad();
  },
  /**
   * 切换到摩羯座
   */
  changetomojie: function () {
    let star = this.data.star
    let showstar = this.data.showstar
    let showModalStatus = this.data.showModalStatus
    console.log('当前的star是：',star);
    console.log('当前的showStar是：',showstar);
    star = 'mojie'
    showstar='摩羯座'
    this.setData({
      star:star,
      showModalStatus: false,
      showstar:showstar
    })
    wx.showToast({
      title: '切换成功',
    })
    console.log('change之后的star:',star);
    this.onLoad();
  },
  /**
   * 切换到水瓶座
   */
  changetoshuiping: function () {
    let star = this.data.star
    let showstar = this.data.showstar
    let showModalStatus = this.data.showModalStatus
    console.log('当前的star是：',star);
    console.log('当前的showStar是：',showstar);
    star = 'shuiping'
    showstar='水瓶座'
    this.setData({
      star:star,
      showModalStatus: false,
      showstar:showstar
    })
    wx.showToast({
      title: '切换成功',
    })
    console.log('change之后的star:',star);
    this.onLoad();
  },
  /**
   * 切换到双鱼座
   */
  changetoshuangyu: function () {
    let star = this.data.star
    let showstar = this.data.showstar
    let showModalStatus = this.data.showModalStatus
    console.log('当前的star是：',star);
    console.log('当前的showStar是：',showstar);
    star = 'shuangyu'
    showstar='双鱼座'
    this.setData({
      star:star,
      showModalStatus: false,
      showstar:showstar
    })
    wx.showToast({
      title: '切换成功',
    })
    console.log('change之后的star:',star);
    this.onLoad();
  },

  /**
   * 分享海报
   */
  // shareImage为图片网络地址，跳转页面是作为参数传递
  creatPoster(){ // 
    wx.navigateTo({
      url: '../share/s',
    })
  },
})