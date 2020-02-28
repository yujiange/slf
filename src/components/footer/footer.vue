<template>
  <div class="home-tabbar">
        <ul>
            <li v-for="(item,index) in tabList" :key="item.id" @click="tabbarjump(index, item.id)">
                <p class="pic">
                    <img :src="active == index ? item.icon.active : item.icon.inactive">
                </p>
                <p :class="{'blueitem':active == index,'title':active != index}">{{item.text}}</p>
            </li>
        </ul>
        <div class="ipx-saft" v-if="isIphoneX"></div>
    </div>
</template>

<script>
import Vue from "vue";
import api from "src/config/api";
import { Tabbar, TabbarItem, Toast } from "vant";

Vue.use(Toast);
export default {
  props:["active"],
  data() {
    return {
      isIphoneX: false, // 是否是iphonex
      tabList: [
        {
          id: "index",
          text: "首页",
          icon: {
            active: require("../../../static/imgs/index_active.png"),
            inactive: require("../../../static/imgs/index.png")
          }
        },
        // {
        //     id:'ad',
        //     text:'广告',
        //     icon:{
        //         active: require('../../../static/imgs/ad_active.png'),
        //         inactive: require('../../../static/imgs/ad.png')
        //     }
        // },{
        //     id:'service',
        //     text:'售后管理',
        //     icon:{
        //         active: require('../../../static/imgs/service_active.png'),
        //         inactive: require('../../../static/imgs/service.png')
        //     }
        // },
        {
          id: "my",
          text: "我的",
          icon: {
            active: require("../../../static/imgs/my_active.png"),
            inactive: require("../../../static/imgs/my.png")
          }
        }
      ]
    };
  },
  methods: {
    tabbarjump(index, id) {
      if (this.active == index) return;
      api.gotoIndex(id);
    }
  },
  created() {
    // 判断是不是iphonex系列需要留出底部安全区
        mui.plusReady(() => {
            if (mui.os.ios) {
                var isIPhoneX =
                    window.screen.width === 375 && window.screen.height === 812;
                // iPhone XS Max
                var isIPhoneXSMax =
                    window.screen.width === 414 && window.screen.height === 896;
                // iPhone XR
                var isIPhoneXR =
                    window.screen.width === 414 && window.screen.height === 896;

                if (isIPhoneX || isIPhoneXSMax || isIPhoneXR) {
                    this.isIphoneX = true;
                }
            }
        });
  }
};
</script>
<style lang="scss" scoped>
.home-tabbar {
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    z-index: 880;
    bottom: 0;
    left: 0;
    background-color: #fff;
    border-top: 1px solid #f5f5f5;
}
ul {
    // box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
    width: 100%;
    box-sizing: border-box;
    padding-top: 5px;
    // position: fixed;
    // z-index: 880;
    // bottom: 0;
    // left: 0;
    // background-color: #fff;
    // border-top: 1px solid #f5f5f5;
    height: 98px;
    li {
        display: inline-block;
        list-style: none;
        width: 50%;
        height: 98px;
        box-sizing: border-box;
        padding-top: 6px;
        p {
            text-align: center;
        }
        .pic {
            width: 100%;
            height: 50px;
            margin-bottom: 2px;
            img {
                display: block;
                width: 48px;
                height: 46px;
                margin: 0 auto;
            }
        }
        .title {
            width: 100%;
            text-align: center;
            color: #666666;
            font-size: 24px;
            line-height: 24px;
        }
        .blueitem {
            width: 100%;
            text-align: center;
            color: #3cc1ff;
            font-size: 24px;
            line-height: 24px;
        }
    }
}
</style>