<template>
  <div class="show_list">
    <van-nav-bar title="我的财务" fixed left-arrow @click-left="onClickLeft" />
    <van-tabs v-model="active" title-active-color color="#007ACC" line-height="'2px'">
      <van-tab v-for="(item,index) in tabBarList" v-bind:title="item.name" v-bind:key="index">
        <component v-bind:is="item.comp"></component>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import Vue from "vue";

import Zjls from "./common/zjls.vue";
import Sbfy from "./common/sbfy.vue";
import Lsfy from "./common/lsfy.vue";

import { NavBar, Cell, CellGroup, Tab, Tabs } from "vant";

Vue.use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(Tab)
  .use(Tabs);
window.mui = mui;

export default {
  data() {
    return {
      active: 0,
      tabBarList: []
    };
  },
  methods: {
    onClickLeft() {
      mui.back();
    }
  },
  created(){
    let that = this
    http({
      url: "http://" + prods.javaIP + "/system/user/detail",
      data: {}
    })
      .then(res => {
        that.userType = res.data.userType
        switch(that.userType){
          case '00':
            that.tabBarList = []
            break
          case '01':
            that.tabBarList = [
              { name: "资金流水", comp: Zjls }
            ]
            break
          case '02':
            that.tabBarList = [
              { name: "资金流水", comp: Zjls },
              { name: "流水返佣", comp: Lsfy },
              { name: "设备返佣", comp: Sbfy }
            ]
            break
          case '03':
            that.tabBarList = [
              { name: "资金流水", comp: Zjls }
            ]
            break
          case '04':
            that.tabBarList = []
            break      
        }
      })
      .catch(err => {});
  }
};
</script>

<style lang="scss" scoped>
.show_list{
  height: 100%;
}
</style>