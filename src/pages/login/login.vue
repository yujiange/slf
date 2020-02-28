<template>
  <div class="login">
    <heador v-bind:back="false">
      <a slot="extend" class="mui-btn mui-btn-link mui-pull-right" @tap="gotoNew('loginTel')">短信快捷登录</a>
    </heador>
    <div class="mui-content">
      <div class="title">欢迎来到脸易付</div>
      <div id="loginIn" class="mui-input-group">
        <div class="mui-input-row">
          <label>用户名</label>
          <input type="text" class="lyf-input-clear" placeholder="请输入账号/手机号" v-model="userName" />
          <img src="../../../static/imgs/lyf_clear.png" class="lyf-icon lyf-clear lyf-hidden" />
        </div>
        <div class="mui-input-row">
          <label>密码</label>
          <input
            :type="typeName"
            class="lyf-input-clear lyf-input-password"
            placeholder="请输入密码"
            v-model="passwordName"
          />
          <img
            src="../../../static/imgs/lyf_clear.png"
            class="lyf-icon lyf-clear lyf-clear-offset lyf-hidden"
          />
          <img :src="urlName" class="lyf-icon lyf-password" @tap="eyeSpy" />
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
        <div class="loginBottomLeft" @tap="gotoNew('password')">忘记密码？</div>
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
      typeName: "password",
      userName: "",
      passwordName: "",
      urlName: require("../../../static/imgs/eyeClose.png"),
      loginBool: false,
      showPro:false,
      protocalMsg:''
    };
  },
  components: {
    Heador,protocol
  },
  mounted() {
    api.changInputSpy();
    api.clearInputInit();
    let that = this;
    $("#loginIn input").each(function() {
      let _this = this;
      $.each(
        ["keyup", "change", "input", "focus", "cut", "paste", "blur"],
        function(index, type) {
          (function(type) {
            _this.addEventListener(type, function() {
              if (that.userName && that.passwordName) {
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
        check = true;
      }); //校验通过，继续执行业务逻辑
      if (check) {
        http({
          url: "http://" + prods.javaIP + "/login",
          data: {
            tel: that.userName,
            type: "1",
            pwd: that.passwordName
          }
        })
          .then(res => {
            if (!res.code) {
              localStorage.setItem("token", res.data.token);
              api.gotoIndex("index");
            }
          })
          .catch(err => {});
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
    let that = this
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    if (localStorage.getItem("token")) {
      setTimeout(function () {
        api.gotoIndex('index');
      }, 500)
    };
    mui.plusReady(() => {
      that.userName = plus.webview.currentWebview().tel || '';
    });
  }
};
</script>

<style lang="scss" scoped>
.thisDiv{

}
</style>