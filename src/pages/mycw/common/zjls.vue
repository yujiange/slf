<template>
  <div class="zjls">
    <div class="head">
      <van-search placeholder="请输入订单号" v-model="search" @input="onSearch"
    @clear="onCancel"/>
      <van-row class="total">
        <van-col span="8"><div class="top">总订单量</div><div class="bottom">{{totalOrder}}</div></van-col>
        <van-col span="8"><div class="top">成功订单量</div><div class="bottom">{{totalOrderSuccess}}</div></van-col>
        <van-col span="8"><div class="top">失败订单量</div><div class="bottom">{{totalRefundOrder}}</div></van-col>
      </van-row>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有数据了"
      @load="onLoad"
      :offset="10"
    >      
    <div class="item" v-for="(item,index) in datas" :key="index">
      <div class="list mui-clearfix">
        <div class="left item_3">订单号：{{item.orderId}}</div>
        <div class="right item_4">￥{{item.money}}</div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">设备号：{{item.dcode}}</div>
        <div class="right item_5">{{item.status==1?'成功':'退款'}}</div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">所属代理商：{{item.agentName}}</div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">来源商户：{{item.bname}}</div>
        <div class="right item_5">{{item.createTime}}</div>
      </div>
      
    </div>
    <div class="nodata" v-if="datas.length==0">
      <img :src="require('../../../../static/imgs/nodata.png')">
    </div>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import Vue from "vue";

import { Row, Col,NavBar, Cell, CellGroup, Tab, Tabs,Search,PullRefresh,List } from "vant";

Vue.use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(Tab)
  .use(Tabs)
  .use(Search)
  .use(Row)
  .use(Col)
  .use(PullRefresh)
  .use(List)  
window.mui = mui;

export default {
  data() {
    return {
      search:'',
      totalOrder:0,
      totalOrderSuccess:0,
      totalRefundOrder:0,
      datas: [],
      loading: false,   //是否处于加载状态
      finished: false,  //是否已加载完所有数据
      isLoading: false,   //是否处于下拉刷新状态
      pageSize: 10, // 每页条数
      pageIndex: 1, // 页码      
      centerData:[]
    };
  },
  components: {},
  mounted() {},
  methods: {
    onClickLeft() {
      mui.back();
    },
    // 获取数据列表
    getList(obj) {
      let that = this
      let _data = obj || {}
      if(this.search!==''||this.search!==null){
        _data.orderId = this.search
      }
      _data.pageIndex = this.pageIndex
      http({
          url: "http://" + prods.javaIP + "/order/order/list",
          data:_data
      }).then(res => {
              let rows = res.datas
              
              if (rows == null || rows.length === 0) {
                // 加载结束
                that.finished = true
                if(that.pageIndex === 1){
                  that.datas = []
                }
                return false
              }
              if (rows.length < that.pageSize) {
                // 最后一页不足10条的情况
                that.finished = true
              }
              // 处理数据
              if (that.pageIndex === 1) {
                that.datas = rows
              } else {
                that.datas = that.datas.concat(rows)
              }
              this.pageIndex++
      }).catch(error => {
        
      }).finally(()=>{
        that.loading = false
        that.isLoading = false
      })
    },
    onLoad(_data) {   //上拉加载
      this.getList(_data)
    },
    onRefresh() { //下拉刷新
      this.finished = false  
      this.isLoading = false     
      this.pageIndex = 1
    },
    onSearch(val){
      let _data = {}
      this.pageIndex = 1
      _data.orderId = val
      this.onLoad(_data)
    },
    onCancel(){
      this.pageIndex = 1
    }
  },
  created() {
    let that = this;
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    //统计数据
    http({
      url: "http://" + prods.javaIP + "/order/order/dataCount",
      data: {
      }
    })
      .then(res => {
        that.totalOrder = res.data.totalOrder
        that.totalRefundOrder = res.data.totalRefundOrder
        that.totalOrderSuccess = res.data.totalOrder - res.data.totalRefundOrder
      })
      .catch(err => {});
    mui.plusReady(() => {});
  }
};
</script>

<style lang="scss" scoped>
.zjls {
  height: 100%;
  .item {
    background: #fff;
    color: #333333;
    padding: 30px 20px;
    position: relative;
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: "";
      pointer-events: none;
      right: 0.75rem;
      bottom: 0;
      left: 0.75rem;
      border-bottom: 0.075rem solid #e6e6e6;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .list {
      .left {
        float: left;
      }

      .right {
        float: right;
      }
      
    }
  }
}
</style>