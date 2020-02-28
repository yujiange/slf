<template>
  <div class="sbfy">
    <div class="head">
      <van-search placeholder="请输入设备号" v-model="search" @input="onSearch"
    @clear="onCancel"/>
      <van-row class="total">
        <van-col span="8"><div class="top">奖励总额</div><div class="bottom">{{sbTotal}}</div></van-col>
        <van-col span="8"><div class="top">已结算金额</div><div class="bottom">{{sbSettled}}</div></van-col>
        <van-col span="8"><div class="top">未结算金额</div><div class="bottom">{{sbNotSettle}}</div></van-col>
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
        <div class="left item_3">设备号：{{item.dcode}}</div>
        <div class="right item_4">￥{{item.totalSettleMoney}}</div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">所属代理商：{{item.agentName}}</div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">来源商户：{{item.bname}}</div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">入货时间：2019-12-12 08:26:56</div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">激活时间：{{item.activeTime}}</div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">交易人次：{{item.total}}</div>
        <div class="right item_5">有效人次：{{item.validTotal}}</div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">设备类型：{{item.dtype=='1'?'青蛙':'蜻蜓'}}</div>
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
      sbTotal:0,
      sbSettled: 0,
      sbNotSettle: 0,
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
        _data.dcode = this.search
      }
      _data.pageIndex = this.pageIndex
      http({
          url: "http://" + prods.javaIP + "/order/settle/sbfyList",
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
    onRefresh() {       //下拉刷新
      this.finished = false  
      this.isLoading = false     
      this.pageIndex = 1
    },
    onSearch(val){
      let _data = {}
      this.pageIndex = 1
      _data.dcode = val
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
      url: "http://" + prods.javaIP + "/order/settle/dataCount",
      data: {
      }
    })
      .then(res => {
        that.sbTotal = res.data.sbTotal;
        that.sbSettled = res.data.sbSettled;
        that.sbNotSettle = res.data.sbNotSettle;
      })
      .catch(err => {});
    mui.plusReady(() => {});
  }
};
</script>

<style lang="scss" scoped>
.sbfy {
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
      .item_1 {
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
      .item_3 {
        font-size:30px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
      }
      .right {
        float: right;
      }
      .item_2 {
        font-size: 28px; //32px;
        font-family: PingFang SC; //Lantinghei SC;
        font-weight: 500; //600;
        color: rgba(51, 51, 51, 1); //rgba(245, 176, 67, 1);
      }
    }
  }
}
</style>