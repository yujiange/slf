<template>
  <div class="dlslist">
    <van-nav-bar title="我的代理商" fixed left-arrow @click-left="onClickLeft" />
    <div class="head">
      <van-search placeholder="请输入代理商名称" v-model="search" @input="onSearch"
    @clear="onCancel"/>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有数据了"
      @load="onLoad"
      :offset="10"
    >
    <div class="item" v-for="(item,index) in datas" :key="index" @tap="gotoDetail(item)">
      <div class="list mui-clearfix" style="margin-bottom:6px">
        <div class="left item_3">
            名称：{{item.agentName}}
        </div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">
            等级：{{item.levelName}}
        </div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">
            上级代理：{{item.parentAgentName}}
        </div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">
          申请时间：{{item.createTime}}
        </div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5">
          有效时间：{{item.startTime}}-{{item.endTime}}
        </div>
      </div>
      <div class="list mui-clearfix">
        <div class="left item_5" v-if="item.status==1">
          状态：已审核
        </div>
        <div class="left item_5" v-if="item.status==2">
          状态：待审核
        </div>
        <div class="left item_5" v-if="item.status==3">
          状态：已签约
        </div>
        <div class="left item_5" v-if="item.status==4">
          状态：已过期
        </div>
        <div class="left item_5" v-if="item.status==5">
          状态：已禁用
        </div>
        <div class="left item_5" v-if="item.status==6">
          状态：已驳回
        </div>
      </div>
    </div>
    <div class="nodata" v-if="datas.length==0">
      <img :src="require('../../../static/imgs/nodata.png')">
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
import { NavBar, Cell, CellGroup, Tab, Tabs,Search,PullRefresh,List } from "vant";

Vue.use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(Tab)
  .use(Tabs)
  .use(Search)
  .use(PullRefresh)
  .use(List)
window.mui = mui;

export default {
  data() {
    return {
      search:'',
      datas:[],
      loading: false,   //是否处于加载状态
      finished: false,  //是否已加载完所有数据
      isLoading: false,   //是否处于下拉刷新状态
      pageSize: 10, // 每页条数
      pageIndex: 1, // 页码
      centerData:[]
    }
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
        _data.agentName = this.search
      }
      _data.pageIndex = this.pageIndex
      http({
          url: "http://" + prods.javaIP + "/agent/agent/list",
          data:_data
      }).then(res => {
              let rows = res.datas
              
              if (rows == null || rows.length === 0) {
                // 加载结束
                that.finished = true
                if(that.pageIndex === 1){
                  console.log("aa："+that.pageIndex)
                  that.datas = []
                }
                return false
              }
              //修改代理商等级
              $.each(rows, function (i, v) {
                switch(v.level){
                  case 0:
                    v.levelName = '一级代理'
                    break
                  case 1:
                    v.levelName = '二级代理'
                    break
                  case 2:
                    v.levelName = '三级代理'
                    break    
                }
              })
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
              console.log("页数："+that.pageIndex)
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
      _data.agentName = val
      this.onLoad(_data)
    },
    onCancel(){
      this.pageIndex = 1
    },
    gotoDetail(item){
      api.gotoIndex('agentDetail',{'aid':item.aid});
    }
    
  },
  created() {
    let that = this;
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    mui.plusReady(() => {});
  }
};
</script>

<style lang="scss" scoped>
.dlslist {
  .item{
    background: #fff;
    color:#333333;
    padding: 30px 20px;
    position: relative;
    &::after{
          position: absolute;
          box-sizing: border-box;
          content: '';
          pointer-events: none;
          right: 0.75rem;
          bottom: 0;
          left: 0.75rem;
          border-bottom: 0.075rem solid #e6e6e6;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
    }
    .list{
      .left{
        float:left;
        
      }
      .right{
        float:right;
        
      }
    }
  }
}
</style>