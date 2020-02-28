<template>
  <div class="adDetail">
    <van-nav-bar title="广告详情" fixed left-arrow @click-left="onClickLeft" />
    <van-cell-group>
      <van-field label="跳转地址" :value="advertDto.targetUrl" readonly />
      <van-field label="开始时间" :value="advertDto.startTime" readonly />
      <van-field label="结束时间" :value="advertDto.endTime" readonly />
      <van-field label="设备" :value="advertDto.dnames" readonly />
      <van-cell>
        <div slot="title">
          <span class="custom-title">广告图</span>
          <div class="img"><van-image :src="advertDto.advertUrl" /></div>
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
  .use(Image)
window.mui = mui;
export default {
  data: function() {
    return {
      id:'',
      advertDto: {}, 
      auditStatus: null, 
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
        url: "http://" + prods.javaIP + "/advert/advert/detail/"+that.id,
        data: {
        }
      })
        .then(res => {
          if (res.code === 0) {
            switch(res.data.status){
                case 0:
                  res.data.statusName = '待审核'
                  break
                case 1:
                  res.data.statusName = '审核通过'
                  break
                case 2:
                  res.data.statusName = '启用'
                  break  
                case 3:
                  res.data.statusName = '失效'
                  break
                case 4:
                  res.data.statusName = '驳回'
                  break      
              }
            that.advertDto = res.data;
            that.advertDto.advertUrl = "http://"+prods.imgIP + res.data.advertUrl
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
.adDetail {
  .van-hairline--top-bottom::after{
    border-width: 0;
  }
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