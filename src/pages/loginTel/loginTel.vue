<template>
  <div class="login">
    <heador v-bind:back="!0">
      <a slot="extend" class="mui-btn mui-btn-link mui-pull-right" @tap="gotoNew('login')">帐号密码登录</a>
    </heador>
    <div class="mui-content">
      <div class="title">欢迎来到脸易付</div>
      <div id="loginIn" class="mui-input-group">
        <div class="mui-input-row">
          <label>手机号</label>
          <input
            type="number"
            class="lyf-input-clear reg_mobile"
            placeholder="请输入手机号"
            v-model="userName"
          />
          <img src="../../../static/imgs/lyf_clear.png" class="lyf-icon lyf-clear lyf-hidden" />
        </div>
        <div class="mui-input-row">
          <label>验证码</label>
          <input
            type="text"
            class="lyf-input-clear lyf-input-code"
            placeholder="请输入短信验证码"
            v-model="codeName"
          />
          <img src="../../../static/imgs/lyf_clear.png" class="lyf-icon lyf-clear lyf-hidden" />
          <button class="btn-code" v-text="btnCode" @tap="getCode"></button>
        </div>
        <div class="mui-text-row">
          登录即代表您同意《
          <span @tap="showAgreement">用户许可协议</span>》
        </div>
        <div class="mui-button-row">
          <button
            type="button"
            class="mui-btn mui-btn-primary"
            :class="loginBool?'lyf-able':''"
            :disabled="!loginBool"
            @tap="loginIn"
          >登录</button>
        </div>
      </div>
      <div class="loginBottom mui-clearfix">
        <div class="loginBottomRight" @tap="gotoNew('register')">注册脸易付</div>
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
      userName: "",
      codeName: "",
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
    $("#loginIn input").each(function() {
      let _this = this;
      $.each(
        ["keyup", "change", "input", "focus", "cut", "paste", "blur"],
        function(index, type) {
          (function(type) {
            _this.addEventListener(type, function() {
              if (that.userName && that.codeName) {
                that.loginBool = true;
              } else {
                that.loginBool = false;
              }
            });
          })(type);
        }
      );
    });
    // 手机号码
    $(".reg_mobile").blur(function() {
      api.verifiyPhone();
    });
    // 验证码输入框
    $(".lyf-input-code").blur(function() {
      api.testVerifyCode();
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
      let check = false;
      let that = this;
      mui("#loginIn input").each(function() {
        //若当前input为空，则alert提醒
        if (!this.value || this.value.trim() == "") {
          var label = this.previousElementSibling;
          mui.alert(label.innerText + "不允许为空");
          check = false;
          return false;
        }
        if($(this).hasClass('lyf-input-code')&&this.value.trim()!==api.getCodeData){
          mui.alert("输入验证码错误");
          return false;
        }else if($(this).hasClass('lyf-input-code')&&this.value.trim()==api.getCodeData){
          check = true;
        }
      }); //校验通过，继续执行业务逻辑

      if (check) {
        http({
            url: "http://" + prods.javaIP + "/login",
            data: {
              "code":that.codeName,
              "type":'2',
              "tel":that.userName
            }
        }).then(res => {
            if(!res.code){
              localStorage.setItem("token", res.data.token);
              api.gotoIndex('index');
            }
        }).catch(err => {
            
        })
      }
    },
    getCode() {
      let that = this;
      if(api.sendMessageIsOk){//防止事件重复执行
        return false;
      }
      api.sendMessageIsOk = true
      // 获取验证码
      $(".btn-code").Countdown({
        CountTime: 60,
        BeforeSend: function() {
          // 判断手机号码
          if (!api.Mobile_Boolean) {
            api.testVerifyCode();
          } else {
            return true;
          }
        },
        Action: function() {
          api.getCheckout(that.userName);
          console.log("flag==============" + api.sendMessageIsOk);
        }
      });
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
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    mui.plusReady(() => {});
  }
};
</script>

<style lang="scss" scoped>
</style>