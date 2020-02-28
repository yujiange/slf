<template>
  <div class="grrz">
    <van-nav-bar title="商家详情" fixed left-arrow @click-left="onClickLeft" />
    <van-cell-group>
      <van-field label="归属代理商" disabled v-model="sjDetail.agentName" />
      <van-field label="商家名称" disabled v-model="sjDetail.bname" />
      <van-field label="联系人" disabled v-model="sjDetail.linkName" />
      <van-field label="所在区域" disabled v-model="sjDetail.addId" />
      <van-field label="详细地址" disabled v-model="sjDetail.address" />
      <van-cell>
        <div slot="title">
          <span class="custom-title">法人身份证正面照</span>
          <div class="img"><van-image :src="sjDetail.authPositive" /></div>
        </div>
      </van-cell>
      <van-cell>
        <div slot="title">
          <span class="custom-title">法人身份证反面照</span>
          <div class="img"><van-image :src="sjDetail.authNegative" /></div>
        </div>
      </van-cell>
      <van-cell>
        <div slot="title">
          <span class="custom-title">营业执照</span>
          <div class="img"><van-image :src="sjDetail.codeUrl" /></div>
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
      sjDetail: {}, //代理商详情
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
      that.id = plus.webview.currentWebview().bid;
      http({
        url: "http://" + prods.javaIP + "/app/business/detail/"+that.id,
        data: {
        }
      })
        .then(res => {
          console.log(res);
          if (res.code === 0) {
            that.sjDetail = res.data;
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