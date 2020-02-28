<template>
  <div class="my">
    <div class="header" v-lazy:background-image="require('../../../static/imgs/my_1.png')">
      <img src="../../../static/imgs/my_0.png" class="setting" @tap="gotoNew('setting')" />
      <van-row class="personal">
        <van-col span="6" class="img" @click="showAvatarRight">
          <img :src="avatar" />
        </van-col>
        <van-col span="8" class="content">
          <h3 v-text="userName"></h3>
          <div v-text="sexName"></div>
        </van-col>
        <van-col span="4" class="type" v-text="userTypeName"></van-col>
      </van-row>
    </div>
    <van-row class="agent" v-if="userType!=='02'" @click="gotoNew('chooseTc')">
      <van-col span="5" class="agentLeft">
        <img src="../../../static/imgs/my_2_1.png" />
      </van-col>
      <van-col span="14" class="agentCen">
        <img src="../../../static/imgs/my_2_2.png" />
      </van-col>
      <van-col span="4" class="agentRig">
        <img src="../../../static/imgs/my_2_3.png" />
      </van-col>
    </van-row>
    <div class="agentLevel" v-if="userType=='02'" @click="gotoNew('chooseTc')">
        <div class="agentLevelBg">
          <img src="../../../static/imgs/dls_bg.png">
          <van-row class="agentLevelText">
            <van-col span="6">
              <img src="../../../static/imgs/dls_normal.png" v-if="comboLevel=='D'"><img src="../../../static/imgs/dls_silver.png" v-else-if="comboLevel=='C'">
              <img src="../../../static/imgs/dls_gold.png" v-else-if="comboLevel=='B'"><img src="../../../static/imgs/dls_diamond.png" v-else>
            </van-col>
            <van-col span="18">
              <div class="top">代理商权益{{endTime}}到期</div>
              <div class="bottom">升级套餐获取更多权益<span>→</span></div>
            </van-col>
          </van-row>
        </div>
        
    </div>
    <div class="thelist">
      <div
        role="button"
        tabindex="0"
        class="van-cell van-cell--clickable"
        v-for="(item,index) in reallist"
        :key="index"
        @tap="gotoNew(item.id)"
      >
        <div class="van-cell__title">
          <span>{{item.name}}</span>
        </div>
        <img :src="item.icon" class="theIcon" />
        <i class="van-icon van-icon-arrow van-cell__right-icon"></i>
      </div>
    </div>
    <footor :active="1"></footor>
    <van-action-sheet
        v-model="showAvatar"
        :actions="actions"
        cancel-text="取消"
        @cancel="onCancelAvatar"
        @select="onSelect" />
  </div>
</template>

<script>
import footor from "src/components/footer/footer.vue";
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import photoByCamera from 'src/util/photoByCamera.js';
import photoByGallery from 'src/util/photoByGallery.js';
import Vue from "vue";
import { Swipe, Row, Col, Lazyload,ActionSheet,Toast } from "vant";

Vue.use(Swipe)
  .use(Row)
  .use(Col)
  .use(Lazyload)
  .use(ActionSheet)
  .use(Toast)

window.mui = mui;
export default {
  data() {
    return {
      sexName: "",
      userName: "",
      avatar: "",
      userType: "",
      userTypeName: "",
      endTime:'',
      comboLevel:'',
      perlist: [
        {
          name: "我的财务",
          id: "mycw",
          icon: require("../../../static/imgs/my_3_1.png")
        },
        {
          name: "我的代理商",
          id: "dlslist",
          icon: require("../../../static/imgs/my_3_2.png")
        },
        {
          name: "我的商家",
          id: "sjlist",
          icon: require("../../../static/imgs/my_3_3.png")
        },
        {
          name: "广告管理",
          id: "adList",
          icon: require("../../../static/imgs/my_3_6.png")
        },
        {
          name: "售后管理",
          id: "serviceList",
          icon: require("../../../static/imgs/my_3_7.png")
        },
        {
          name: "我的认证",
          id: "show_list",
          icon: require("../../../static/imgs/my_3_4.png")
        },
        {
          name: "关于我们",
          id: "aboutUs",
          icon: require("../../../static/imgs/my_3_5.png")
        },
      ],
      showAvatar:false,
      actions: [
        { name: '拍摄' },
        { name: '从手机相册选择' },
        { name: '保存图片' }
      ],
      reallist:[],
      typeObj: {
        "00": "游客",
        "01": "业务员",
        "02": "代理商",
        "03": "商户",
        "04": "售后人员"
      }
    };
  },
  components: {
    footor
  },
  mounted() {},
  methods: {
    gotoNew(id) {
      mui.openWindow({
        url: "./" + id + ".html",
        id: id,
        show: {
          aniShow: "fade-in",
          duration: 600
        }
      });
    },
    showAvatarRight(){
      this.showAvatar = true;
    },
    onCancelAvatar() {
      this.showAvatar = false;
    },
    onSelect(item) {
      let that = this
      this.showAvatar = false;
      if(item.name=='拍摄'){
        photoByCamera(
          imgSrc => {
            plus.nativeUI.showWaiting('图片上传中');
              // 第一步：创建上传对象
              let task = plus.uploader.createUpload(
                "http://" + prods.javaIP + "/common/upload",   // 请求接口
                { method:"POST"}, // 请求类型
                function ( t, status ) { // 上传结束回调
                // console.log(status)
                // console.log(JSON.stringify(t))
                  plus.nativeUI.closeWaiting(); // 关闭loading动画
                  if ( status == 200) {  // 上传成功
                    Toast('上传成功') // 给个小提示
                    // 之后的业务逻辑写在这里
                    // 如果后台有返回值，则这样取 t.responseText 这是个字符串，需转为json对象
                    http({
                      url:"http://" + prods.javaIP + "/system/user/edit",
                      data:{
                        avatar:JSON.parse(t.responseText).url
                      }
                    }).then(res=>{
                      that.avatar = "http://"+prods.imgIP + JSON.parse(t.responseText).url
                    });
                  } else { // 失败处理
                    Toast('网络连接异常');
                  }
                }
              );
              // 第二步：添加上传图片路径以及其他要传给后台的参数
              // 注意，参数只能为字符串！！！
              var img = plus.io.convertAbsoluteFileSystem(imgSrc);
                // 添加图片参数
              task.addFile(img, {key: 'file'});

              // 第三步： 开始上传
              task.start();
          },
          err => {
          
          }
        )
      }else if(item.name=='从手机相册选择'){
        photoByGallery(
          imgSrcList => {
              plus.nativeUI.showWaiting('图片上传中');
              // 第一步：创建上传对象
              let task = plus.uploader.createUpload(
                "http://" + prods.javaIP + "/common/upload",   // 请求接口
                { method:"POST"}, // 请求类型
                function ( t, status ) { // 上传结束回调
                // console.log(status)
                // console.log(JSON.stringify(t))
                  plus.nativeUI.closeWaiting(); // 关闭loading动画
                  if ( status == 200) {  // 上传成功
                    Toast('上传成功') // 给个小提示
                    // 之后的业务逻辑写在这里
                    // 如果后台有返回值，则这样取 t.responseText 这是个字符串，需转为json对象
                    http({
                      url:"http://" + prods.javaIP + "/system/user/edit",
                      data:{
                        avatar:JSON.parse(t.responseText).url
                      }
                    }).then(res=>{
                      that.avatar = "http://"+prods.imgIP + JSON.parse(t.responseText).url
                    });
                    // console.log(JSON.stringify(t))
                    // console.log(t.responseText)
                  } else { // 失败处理
                    Toast('网络连接异常');
                  }
                }
              );
              // 第二步：添加上传图片路径以及其他要传给后台的参数
              // 注意，参数只能为字符串！！！
              var img = plus.io.convertAbsoluteFileSystem(imgSrcList);
                // 添加图片参数
              task.addFile(img, {key: 'file'});

              // 第三步： 开始上传
              task.start();
          },
          err => {
            
          })
      }else if(item.name=='保存图片'){
        console.log(that.avatar);
            if(that.avatar.indexOf('./')!==-1){
               Toast('请先上传图片')
            }else if(that.avatar){
                let imgDtask = plus.downloader.createDownload(that.avatar,{method:'GET'}, function (d,status) {
                        if(status == 200){
                            plus.gallery.save(d.filename, function () {//保存到相册
                                plus.io.resolveLocalFileSystemURL(d.filename, function (enpty) {
                                // 关闭弹框
                                    Toast('保存成功')
                                });

                            })
                        }else{
                            Toast('保存失败')
                        }
                });
                imgDtask.start()
            }
      }
    },
    dataInit(){
      let that = this;
      http({
        url: "http://" + prods.javaIP + "/system/user/detail",
        data: {}
      })
        .then(res => {
          // console.log(JSON.stringify(res.data))
          that.userName = res.data.userName;
          that.sexName = res.data.sex=='0'?'男':'女'
          that.avatar = res.data.avatar?("http://"+prods.imgIP + res.data.avatar):require('../../../static/imgs/default.png')
          console.log(that.avatar)
          that.userType = res.data.userType;
          that.reallist = [] //防止dataInit多次被调用后产生的数据累计
          switch(that.userType){//帐号权限分配
            case '00':
              $.each(that.perlist, function (i, v) {
                if(v.id=='aboutUs'){
                  that.reallist.push(v)
                }
              });
              break
            case '01':
              $.each(that.perlist, function (i, v) {
                if(v.id=='mycw'||v.id=='dlslist'||v.id=='sjlist'||v.id=='serviceList'||v.id=='aboutUs'){
                  that.reallist.push(v)
                }
              });
              break
            case '02':
              $.each(that.perlist, function (i, v) {
                if(v.id!=='adList'&&v.id!=='serviceList'){
                  that.reallist.push(v)
                }
              });
              break
            case '03':
              $.each(that.perlist, function (i, v) {
              if(v.id=='mycw'||v.id=='sjlist'||v.id=='adList'||v.id=='serviceList'||v.id=='aboutUs'){
                  that.reallist.push(v)
                }
              });
              break
            case '04':
              $.each(that.perlist, function (i, v) {
              if(v.id=='serviceList'||v.id=='aboutUs'){
                  that.reallist.push(v)
                }
              });
              break        
          }
          that.userTypeName = that.typeObj[res.data.userType];
          localStorage.setItem("userName", that.userName);
          localStorage.setItem("avatar", that.avatar);
          localStorage.setItem("userType", res.data.userType);
          localStorage.setItem("userTypeName", that.userTypeName);
          if(res.data.userType=='02'){
            http({
              url: "http://" + prods.javaIP + "/agent/agent/detail",
              data: {}
            })
              .then(res => {
                that.endTime = res.data.endTime;
                that.comboLevel = res.data.comboLevel;
              })
              .catch(err => {});  
          }
        })
        .catch(err => {});
    }
  },
  created() {
    let that = this;
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    this.dataInit()
    
    mui.plusReady(() => {
      window.addEventListener("refleshPage", (e) => {
        that.dataInit()
      });
    });
  }
};
</script>

<style lang="scss" scoped>
.my {
  background-color: #f6f7f8;
  padding-bottom: 50px;
  .header {
    width: 100%;
    height: 350px;
    background-size: cover;
    overflow: hidden;
    position: relative;
    z-index: 5;
    .setting {
      width: 44px;
      height: 44px;
      position: absolute;
      right: 30px;
      top: 30px;
      padding: 0;
    }
    .personal {
      padding: 100px 30px 54px 30px;
      .img {
        img {
          width: 150px;
          height: 150px;
          background: rgba(255, 255, 255, 1);
          border-radius: 50%;
        }
      }
      .content {
        padding-top: 30px;
        width: auto;
        margin-right: 15px;
        h3 {
          font-size: 30px;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          margin-bottom: 10px;
        }
        div {
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }
      }
      .type {
        margin-top: 30px;
        height: 40px;
        background: rgba(0, 114, 255, 1);
        border-radius: 6px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        text-align: center;
        line-height: 40px;
      }
    }
  }
  .agent {
    width: 710px;
    height: 152px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 8px 20px 0px rgba(219, 228, 238, 0.8);
    border-radius: 20px;
    margin: -50px auto 30px auto;
    position: relative;
    z-index: 10;
    .agentLeft {
      img {
        width: 78px;
        height: 56px;
        margin: 48px 0 0 30px;
      }
    }
    .agentCen {
      img {
        margin-top: 60px;
        width: 358px;
        height: 31px;
      }
    }
    .agentRig {
      img {
        margin-top: 50px;
        width: 120px;
        height: 50px;
      }
    }
  }
  .agentLevel{
    .agentLevelBg{
      width: 750px;
      height: 191px;
      border-radius: 20px;
      margin: -50px auto 0;
      position: relative;
      z-index: 10;
      >img{
        width: 750px;
        height: 191px;
      }
      .agentLevelText{
        position: absolute;
        width: 750px;
        height: 191px;
        top: 0;
        left: 0;
        .van-col--6{
          width: 202px;
          padding: 10px 0 0 50px;
          position: relative;
          img{
            width: 118px;
            height: 131px;
          }
          &::after{
            width: 2px;
            height: 62px;
            position: absolute;
            content:'';
            background-color:#DED282;
            right: 0;
            top: 58px;
          }
        }
        .van-col--18{
          width: 548px;
          font-family:PingFang SC;
          font-weight:500;
          padding: 40px 0 0 30px;
          .top{
            font-size:30px;
            color:rgba(139,73,30,1);
            margin-bottom: 10px;
            img{
              width: 22px;
              height: 22px;
              margin-left: 10px;
            }
          }
          .bottom{
            font-size:24px;
            color:rgba(241,114,44,1);
            >span{
              vertical-align: top;
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
  .thelist {
    width: 710px;
    margin: 0 auto 100px;
    min-height: 759px;
    background: #fff;
    border-radius: 10px;
    .van-cell {
      padding: 35px 30px;
      position: relative;
      .van-cell__title {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        padding-left: 70px;
      }
      .theIcon {
        position: absolute;
        left: 30px;
        top: 42px;
        width: 42px;
        height: 42px;
      }
      &::after {
        position: absolute;
        box-sizing: border-box;
        content: "";
        pointer-events: none;
        right: 30px;
        bottom: 0;
        left: 30px;
        border-bottom: 3px solid rgba(230, 230, 230, 1);
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
  }
}
</style>