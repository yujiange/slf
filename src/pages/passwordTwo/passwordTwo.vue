<template>
  <div class="login password">
    <heador v-bind:back="!0">设置密码</heador>
    <div class="mui-content">
      <div class="title"></div>
      <div id="loginIn" class="mui-input-group">
        <div class="mui-input-row">
          <label>密码</label>
          <input
            :type="typeName"
            class="lyf-input-clear lyf-input-password"
            placeholder="请设置6-20位的登录密码"
            v-model="passwordName"
          />
          <img
            src="../../../static/imgs/lyf_clear.png"
            class="lyf-icon lyf-clear lyf-clear-offset lyf-hidden"
          />
          <img :src="urlName" class="lyf-icon lyf-password" @tap="eyeSpy" />
        </div>
        <div class="mui-input-row">
          <label>密码</label>
          <input
            :type="typeName"
            class="lyf-input-clear lyf-input-password"
            placeholder="请重新输入密码"
            v-model="passwordNameCon"
          />
          <img
            src="../../../static/imgs/lyf_clear.png"
            class="lyf-icon lyf-clear lyf-clear-offset lyf-hidden"
          />
          <img :src="urlName" class="lyf-icon lyf-password" @tap="eyeSpy" />
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
    </div>
  </div>
</template>

<script>
import Heador from "src/components/header/header.vue";
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import $ from "jquery";
window.mui = mui;
export default {
  data() {
    return {
      typeName: "password",
      passwordNameCon: "",
      passwordName: "",
      urlName: require("../../../static/imgs/eyeClose.png"),
      loginBool: false,
      protocalMsg:""
    };
  },
  components: {
    Heador
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
              if (that.passwordName && that.passwordNameCon) {
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
            code: that.codeName,
            type: "1",
            tel: that.passwordName
          }
        })
          .then(res => {
            if (!res.code) {
              localStorage.setItem("token", res.token);
              mui.toast(res.msg);
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
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    mui.plusReady(() => {});
  }
};
</script>

<style lang="scss" scoped>
.password{
  .mui-button-row{
    margin-top: 40px;
  }
}
</style>