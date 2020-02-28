<template>
  <div class="setting">
    <van-nav-bar title="个人设置" fixed left-arrow @click-left="onClickLeft" />
    <van-cell title="基本信息" is-link @click="gotoNew('info')"/>
    <van-cell title="修改密码" is-link  @click="gotoNew('updatePass')"/>
    
    <div class="loginOut" @tap="loginOut">退出登录</div>
  </div>
</template>

<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import Vue from "vue";
import { NavBar, Cell, CellGroup,Toast } from "vant";

Vue.use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(Toast);
window.mui = mui;

export default {
  data() {
    return {};
  },
  components: {},
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
    },
    loginOut(){
      mui.confirm('是否退出登录','提示',['是','否'],function(e){
        if(!e.index){
          api.out_login()
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
.setting {
  .van-cell {
    margin-top: 17px;
    font-size:30px;
    font-family:PingFang SC;
    color:rgba(51,51,51,1);
  }
  .loginOut {
    width: 100%;
    height: 110px;
    background: rgba(255, 255, 255, 1);
    line-height: 110px;
    text-align: center;
    margin-top: 17px;
    font-size:30px;
    font-family:PingFang SC;
    color:rgba(51,51,51,1);
  }
}
</style>