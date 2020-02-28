<template>
  <div class="aboutUs">
    <van-nav-bar title="关于我们" fixed left-arrow @click-left="onClickLeft" />
    <div class="partOne">
      <img src="../../../static/imgs/aboutus.png">
      <p class="top">脸易付</p>
      <p class="bottom">版本号 V1.1</p>
    </div>
    <div class="partTwo">
      <div class="top mui-clearfix"><div class="topLeft">用户协议</div><div class="topRight">隐私协议</div></div>
      <p class="center">湖南脸易付科技有限公司</p>
      <p class="bottom">Hunan face easy brush Technology Co., Ltd</p>
    </div>
  </div>
</template>

<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import Vue from "vue";
import { NavBar,Dialog } from "vant";

Vue.use(NavBar).use(Dialog)

window.mui = mui;

export default {
  data() {
    return {};
  },
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  mounted() {},
  methods: {
    onClickLeft() {
      mui.back();
    },
    gotoNew(id) {
      mui.openWindow({
        url: "./" + id + ".html",
        id: id,
        show: {
          aniShow: "fade-in",
          duration: 600
        }
      });
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
.aboutUs {
  .partOne{
    margin:198px auto 590px auto;
    text-align: center;
    img{
      width: 140px;
      height: 140px;
      display: block;
      margin:0 auto;
    }
    .top{
      margin:25px 0 0 0;
      
      font-size:44px;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(26,26,26,1);
    }
    .bottom{
      font-size:28px;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(26,26,26,1);
      margin:15px 0 0 0;
    }
  }
  .partTwo{
    text-align: center;
    margin-bottom: 40px;
    .top{
      font-size:28px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(51,51,51,1);
      margin-bottom: 24px;
      .topLeft{
        display: inline-block;
        padding: 0 30px;
        position: relative;
        &::after{
          position: absolute;
          width: 2px;
          height: 24px;
          content: '';
          background-color: #333;
          right: 0;
          top: 12px;
        }
      }
      .topRight{
        display: inline-block;
        padding: 0 30px;
      }
    }
    .center,.bottom{
      font-size:24px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(179,179,179,1);
    }
  }
}
</style>