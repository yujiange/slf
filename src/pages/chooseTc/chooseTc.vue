<template>
  <div class="chooseTc">
    <heador v-bind:back="!0">选择套餐</heador>
    <van-row class="personal">
      <van-col span="3" class="img">
        <img :src="avatar" />
      </van-col>
      <van-col span="8" class="content" v-if="userType=='02'">
        <h3 v-text="userName"></h3> <span class="userTypeName" v-text="userTypeName"></span>
        <div>{{comboLable}}{{endTime}}到期 ></div>
      </van-col>
      <van-col span="8" class="content" v-if="userType!=='02'">
        <h3 v-text="userName"></h3> <span class="userTypeName" v-text="userTypeName"></span>
        <div>未申请代理商</div>
      </van-col>
    </van-row>
    <div class="theTc">
      <div class="mui-scroll-wrapper">
        <div class="mui-scroll mui-clearfix">
          <div
            class="itemTc"
            v-for="(item,index) in taocanList"
            :class="!item.active?'':'active'"
            :key="index"
            @tap="choosed(item)"
          >
            <p class="itemTc_1">{{item.lable}}</p>
            <p class="itemTc_2">{{!item.price?'免费':('￥'+item.price)}}</p>
            <p class="itemTc_3" v-text="'补贴'+item.rebate+'%'" v-if="item.rebate!==0"></p>
            <img v-if="index=='0'" class="tjsq" src="../../../static/imgs/tjsq.png" />
          </div>
        </div>
      </div>
    </div>
    <div class="getApply" :class="auditShow?'':'active'" @tap="getApply" v-text="btnText"></div>
    <div class="intro">
      <h3>{{introduceType}}说明：</h3>
      <div>{{introduce}}</div>
    </div>
  </div>
</template>

<script>
import Heador from "src/components/header/header.vue";
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import Vue from "vue";
// import { setGlobalData, getGlobalData } from "src/config/global_data.js";
import { Row, Col } from "vant";
Vue.use(Row).use(Col);
window.mui = mui;

export default {
  data() {
    return {
      agentDetail: {}, //代理商详情
      auditStatus: null, //审核状态
      auditShow:true,
      introduceType: "",
      introduce: "",
      tcObj: "",
      userName: "",
      avatar: "",
      userType:'',
      userTypeName: "",
      comboLable:'',
      endTime:'',
      comboLevel:'',
      gotoObj: {},
      btnText:'立即申请',
      taocanList: [],
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
    Heador
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
    choosed(item) {
      this.introduceType = item.lable;
      this.introduce = item.remark;
      $.each(this.taocanList, function(index, val) {
        val.active = 0;
        if (val.id == item.id) {
          val.active = 1;
        }
      });
      this.gotoObj = {
        'lable':item.lable,
        'price':item.price,
        'comboId':item.id
      };
    },
    getApply() {
      if(!this.auditShow){
        return false
      }else{
        api.gotoIndex("applydls", this.gotoObj);
      }
    },
    jumpDetail() {
      api.gotoIndex("show_list");
    }
  },

  created() {
    let that = this
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    //用户类型分类
    http({
      url: "http://" + prods.javaIP + "/system/user/detail",
      data: {}
    })
      .then(res => {
        that.userName = res.data.userName;
        that.sex = res.data.sex;
        that.avatar = res.data.avatar?("http://" + prods.imgIP + res.data.avatar):require('../../../static/imgs/default.png')
        that.userType = res.data.userType;
        that.userTypeName = that.typeObj[res.data.userType];
        if(res.data.userType=='02'){
          //代理商等级获取
          http({
            url: "http://" + prods.javaIP + "/agent/agent/detail",
            data: {}
          })
            .then(res => {
              
              if (res.code === 0) {
                that.comboLable = res.data.comboLable
                that.comboLevel = res.data.comboLevel
                that.endTime = res.data.endTime
                that.agentDetail = res.data
                that.auditStatus = res.data.status
                $.each(that.taocanList, function(index, val) {
                  let _index
                  val.active = 0
                  switch(that.comboLevel){
                    case 'A':
                      _index = 0
                      break
                    case 'B':
                      _index = 1
                      break
                    case 'C':
                      _index = 2
                      break
                    case 'D':
                      _index = 3
                      break      
                  }
                  if (index==_index) {
                    val.active = 1
                    that.introduceType = val.lable;
                    that.introduce = val.remark;
                  }
                })
                if(that.auditStatus==6){
                    that.auditShow = true
                }else{
                  that.auditShow = false
                  switch(that.auditStatus){
                    case 1:
                      that.btnText = '审核通过'
                      break
                    case 2:
                      that.btnText = '审核中'
                      break
                    case 3:
                      that.btnText = '已签约'
                      break
                    case 4:
                      that.btnText = '已过期'
                      break
                    case 5:
                      that.btnText = '已禁用'
                      break      
                  }
                }
              }
            })
            .catch(err => {});  
        }
      })
      .catch(err => {});
    //套餐列表
    http({
          url: "http://" + prods.javaIP + "/agent/agent/comboList",
          data: {}
        })
          .then(res => {
            if (res.code === 0) {
              that.taocanList = res.data
              $.each(that.taocanList, function(index, val) {
                val.active = 0
                if (index==0) {
                  val.active = 1
                  that.introduceType = val.lable;
                  that.introduce = val.remark;
                }
              })
              that.gotoObj = res.data[0]
            }
          })
          .catch(err => {});  
    mui.plusReady(() => {});
  }
};
</script>

<style lang="scss" scoped>
.mui-bar {
  border-bottom: 2px solid #e6e6e6;
}
.auditStatus-text {
  font-size: 15px;
  display: block;
  text-align: center;
  padding: 10px 0;
  border-radius: 5px;
  background-color:#FF562D;
  color:#fff;
}
.chooseTc {
  .personal {
    line-height: 1;
    margin-top: 110px;
    padding: 30px;
    border-bottom: 2px solid #ffd5b3;
    .img {
      img {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 1);
        border-radius: 50%;
        border:2px solid #ccc;
      }
    }
    .content {
      margin-left: 10px;
      margin-top: 4px;
      width: auto;
      margin-right: 15px;
      h3 {
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        margin: 0 30px 13px 0;
        display: inline-block;
        // vertical-align: top;
      }
      div {
        font-size:24px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(153,153,153,1);
      }
      span{
        display: inline-block;
        background:rgba(239,93,61,1);
        border-radius:6px;
        font-size:24px;
        font-family:PingFang SC;
        font-weight:bold;
        color:rgba(255,255,255,1);
        padding: 5px 10px;
        vertical-align: top;
        margin-top: -2px;
      }
    }
  }
  .theTc {
    height: 340px;
    position: relative;
    ::-webkit-scrollbar {
      display: none !important;
    }
    .mui-scroll-wrapper {
      padding: 50px 0 50px 50px;
      position: relative;
      bottom: auto;
      width: 100%;
      border: 0;
      border-radius: 0;
      height: 340px;
      overflow-x: auto;
      .mui-scroll {
        width: auto;
        height: 240px;
        white-space: nowrap;
        padding-right: 30px;
      }
      .itemTc {
        vertical-align:top;
        position: relative;
        display: inline-block;
        width: 190px;
        height: 240px;
        box-sizing: border-box;
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        margin-right: 10px;
        text-align: center;
        border: 2px solid transparent;
        &.active {
          background: rgba(253, 250, 243, 1);
          border: 2px solid rgba(196, 68, 46, 1);
        }
        .tjsq {
          position: absolute;
          top: -20px;
          left: 0;
          width: 128px;
          height: 40px;
        }
        .itemTc_1 {
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(111, 83, 62, 1);
          margin: 38px 0 28px 0;
        }
        .itemTc_2 {
          font-size: 45px;
          font-family: HeadLineA;
          font-weight: 400;
          color: rgba(239, 93, 61, 1);
          margin:0 0 23px 0;
          letter-spacing: -2px;
        }
        .itemTc_3 {
          width: 166px;
          height: 44px;
          line-height: 44px;
          background: rgba(252, 240, 228, 1);
          border-radius: 4px;
          margin: 0 auto;
          font-size: 22px;
          font-family: PingFang SC;
          color: rgba(111, 83, 62, 1);
          text-align: center;
        }
      }
    }
  }
  .getApply {
    width: 690px;
    height: 80px;
    line-height: 80px;
    background: rgba(0, 114, 255, 1);
    border-radius: 40px;
    margin: 0 auto;
    text-align: center;
    color: #fff;
    font-size: 34px;
    font-family: PingFang SC;
    &.active{
      background:#B2D5FF;
    }
  }
  .intro {
    font-family: PingFang SC;
    color: rgba(111, 83, 62, 1);
    line-height: 42px;
    padding: 60px 30px;
    h3 {
      font-weight: bold;
      font-size: 30px;
      line-height: 36px;
      margin-bottom: 40px;
    }
    div {
      font-weight: 500;
      font-size: 28px;
    }
  }
}
</style>