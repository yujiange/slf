<template>
  <div class="login">
    <heador v-bind:back="!0">设置密码</heador>
    <div class="mui-content">
      <div id="loginUp" class="mui-input-group">
        <div class="mui-input-row">
            <label>密码</label>
            <input :type="typeName" class="lyf-input-clear lyf-input-password" placeholder="请设置6-20位的登录密码" v-model="passwordName">
            <img src="../../../static/imgs/lyf_clear.png" class="lyf-icon lyf-clear lyf-clear-offset lyf-hidden">
            <img :src="urlName" class="lyf-icon lyf-password" @tap="eyeSpy">
        </div>
        <div class="mui-text-row">
          点击完成即代表您同意《
          <span @tap="showAgreement">脸易付注册协议</span>》
        </div>
        <div class="mui-button-row">
          <button
            type="button"
            class="mui-btn mui-btn-primary"
            :class="loginBool?'lyf-able':''"
            :disabled="!loginBool"
            @tap="loginIn"
          >完成</button>
        </div>
      </div>
    </div>
    <van-dialog
      v-model="showPro"
      title="用户协议"
    >
      <div class="thisDiv"><protocol></protocol></div>
    </van-dialog>
  </div>
</template>

<script>
import Heador from "src/components/header/header.vue";
import protocol from "src/components/protocal/protocal.vue";
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import $ from "jquery";
import Vue from "vue";
import { Dialog } from "vant";

Vue.use(Dialog)
window.mui = mui;

export default {
  data() {
    return {
      typeName:'password',
      passwordName: "",
      tel:'',
      code:'',
      btnCode: "获取验证码",
      urlName: require("../../../static/imgs/eyeClose.png"),
      loginBool: false,
      showPro:false,
      protocalMsg:""
    };
  },
  components: {
    Heador,protocol
  },
  mounted() {
    api.changInputSpy();
    api.clearInputInit(this);
    let that = this;
    $("#loginUp input").each(function() {
      let _this = this;
      $.each(
        ["keyup", "change", "input", "focus", "cut", "paste", "blur"],
        function(index, type) {
          (function(type) {
            _this.addEventListener(type, function() {
              if (that.passwordName) {
                that.loginBool = true;
              } else {
                that.loginBool = false;
              }
            });
          })(type);
        }
      );
    });
    
  },
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
    showAgreement() {
      this.showPro = true
    },
    loginIn() {
      let that = this;
      if(!api.password_Boolean){//校验密码
        api.verifiyPassword();
      }
      if(api.password_Boolean){//通过密码校验，提交注册
        http({
            url: "http://" + prods.javaIP + "/register",
            data:{
              "pwd":that.passwordName,
              "tel":that.tel,
              "code":that.code
            }
        }).then(res => {
            mui.toast(res.msg);
            api.gotoIndex('login',{'tel':that.tel});
        }).catch(err => {
            
        })
      }
    },
    eyeSpy() {
      if (this.typeName == "text") {
        this.typeName = "password";
        this.urlName = require("../../../static/imgs/eyeClose.png");
      } else {
        this.typeName = "text";
        this.urlName = require("../../../static/imgs/eyeOpen.png");
      }
    }
  },
  created() {
    let that = this;
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    mui.plusReady(function(){
      that.tel = plus.webview.currentWebview().tel
      that.code = plus.webview.currentWebview().code
      // console.log("that.tel:"+that.tel);
      // console.log("that.code:"+that.code);
    });
  }
};
</script>

<style lang="scss" scoped>
</style>