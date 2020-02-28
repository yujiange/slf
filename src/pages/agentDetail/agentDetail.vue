<template>
  <div class="grrz">
    <van-nav-bar title="代理商详情" fixed left-arrow @click-left="onClickLeft" />
    <van-cell-group>
      <van-field label="套餐名称" disabled v-model="agentDetail.comboLable" />
      <van-field label="套餐费用" disabled v-model="agentDetail.comboPrice" />
      <van-field label="代理商名称" disabled v-model="agentDetail.agentName" />
      <van-field label="联系人" disabled v-model="agentDetail.linkName" />
      <van-field label="所在区域" disabled v-model="agentDetail.addId" />
      <van-field label="详细地址" disabled v-model="agentDetail.linkAddr" />
      <van-cell>
        <div slot="title">
          <span class="custom-title">法人身份证正面照</span>
          <div class="img"><van-image :src="agentDetail.authPositive" /></div>
        </div>
      </van-cell>
      <van-cell>
        <div slot="title">
          <span class="custom-title">法人身份证反面照</span>
          <div class="img"><van-image :src="agentDetail.authNegative" /></div>
        </div>
      </van-cell>
      <van-cell>
        <div slot="title">
          <span class="custom-title">营业执照</span>
          <div class="img"><van-image :src="agentDetail.codeUrl" /></div>
        </div>
      </van-cell>
    </van-cell-group>
  </div>
</template>


<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import Vue from "vue";
import { NavBar, Cell, CellGroup,Field,Image } from "vant";

Vue.use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(Field)
  .use(Image);
window.mui = mui;
export default {
  data: function() {
    return {
      id:'',
      agentDetail: {}, //代理商详情
      auditStatus: null, //审核状态
      showActive: false
    };
  },
  methods:{
    onClickLeft(){
      mui.back();
    }
  },
  created(){
    let that = this
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    mui.plusReady(() => {
      that.id = plus.webview.currentWebview().aid;
      http({
        url: "http://" + prods.javaIP + "/agent/agent/detail/"+that.id,
        data: {
        }
      })
        .then(res => {
          console.log(res);
          if (res.code === 0) {
            that.agentDetail = res.data;
            that.agentDetail.authPositive = prods.imgIP + that.agentDetail.authPositive
            that.agentDetail.authNegative = prods.imgIP + that.agentDetail.authNegative
            that.agentDetail.codeUrl = prods.imgIP + that.agentDetail.codeUrl
          }
        })
        .catch(err => {
          console.log(err);
        });
    });

  }
};
</script>


<style lang="scss">
.grrz {
  .img{
    display: block;
    margin: 0 auto;
    .van-image{
        display: block;
        min-width: 200px;
        min-height: 80px;
        margin: 0 auto;
        background: #fff;
        .van-image__error{
          background-color:#fff;
        }
    }
    
  }
}
</style>