<template>
  <div class="serviceDetail">
    <van-nav-bar title="售后详情" fixed left-arrow @click-left="onClickLeft" />
    <van-cell-group>
      <van-field label="商户名称" :value="dataObj.bname" readonly />
      <van-field label="服务类型" :value="dataObj.atype===1?'安装':'维修'" readonly />
      <van-field label="预约时间" :value="dataObj.appointDate" readonly />
      <van-field label="设备" :value="dataObj.dname" readonly />
      <van-field label="服务地区" :value="dataObj.addrName" readonly />
      <van-field label="详细地址" :value="dataObj.address" readonly />
      <van-field label="备注" :value="dataObj.remark" readonly />
    </van-cell-group>
  </div>
</template>

<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import Vue from "vue";
import { NavBar, Cell, CellGroup,Field } from "vant";

Vue.use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(Field)
window.mui = mui;
export default {
  data: function() {
    return {
      id:'',
      dataObj: {}, 
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
        url: "http://" + prods.javaIP + "/device/appoint/detail/"+that.id,
        data: {
        }
      })
        .then(res => {
          if (res.code === 0) {
            switch(res.data.flowStatus){
                case 1:
                  res.data.flowStatusName = '待派单'
                  break
                case 2:
                  res.data.flowStatusName = '已派单'
                  break
                case 3:
                  res.data.flowStatusName = '已接单'
                  break  
                case 4:
                  res.data.flowStatusName = '确认'
                  break       
            }
            that.dataObj = res.data;
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
.serviceDetail {
    
}
</style>