<template>
  <div class="adList">
    <van-nav-bar title="广告管理" fixed left-arrow @click-left="onClickLeft" @click-right="gotoPage('ad')">
      <van-icon name="plus" slot="right" v-show="userType=='03'"/>
    </van-nav-bar>
    <div class="updown">
      <van-button type="primary" size="mini" @click="gotoPage('upDown')">去上/下架</van-button>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有数据了"
      @load="onLoad"
      :offset="10"
    >
    <div class="item mui-clearfix" v-for="(item,index) in datas" :key="index" >
      <div class="img"><img :src="item.thumbnailUrl"></div>
      <div class="content">
        <div class="list mui-clearfix" style="margin-bottom:6px">
          <div class="left item_5">
              开始时间：{{item.startTime}}
          </div>
          <div class="right item_5" @click="gotoPage('adDetail',item.advertId)">查看详情></div>
        </div>
        <div class="list mui-clearfix" style="margin-bottom:6px">
          <div class="left item_5">
              结束时间：{{item.endTime}}
          </div>
        </div>
        <div class="list mui-clearfix" style="margin-bottom:6px">
          <div class="left item_5">
              状态：{{item.statusName}}
          </div>
        </div>
        <div class="right item_btn" v-show="(item.status==0||item.status==4)&&userType=='03'">
          <van-button type="info" size="mini" @click="gotoPage('ad',item.advertId)">修改</van-button>
        </div>
      </div>
    </div>
    <div class="nodata" v-if="datas.length==0">
      <img :src="require('../../../static/imgs/nodata.png')">
    </div>
    </van-list>
    </van-pull-refresh>
    <!-- <van-dialog
        v-model="showSb"
        title="设备列表"
        show-cancel-button
        @open="openSb"
        @cancel="cancelSb"
        @confirm="confirmSb"
      >
        <van-checkbox-group v-model="result" class="device">
          <van-checkbox :name="item.did" v-for="(item,index) in sbList" :key="index">{{item.dname}}</van-checkbox>
        </van-checkbox-group>
      </van-dialog> -->
  </div>
</template>

<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import Vue from "vue";
import { NavBar, Cell, CellGroup, Tab, Tabs,Search,PullRefresh,List,Icon,Button,Dialog,Checkbox, CheckboxGroup,Toast } from "vant";

Vue.use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(Tab)
  .use(Tabs)
  .use(Search)
  .use(PullRefresh)
  .use(List)
  .use(Icon)
  .use(Button)
  .use(Dialog)
  .use(Toast)
  .use(Checkbox)
  .use(CheckboxGroup)
window.mui = mui;

export default {
  data() {
    return {
      search:'',
      userType:'',
      datas:[],
      loading: false,   //是否处于加载状态
      finished: false,  //是否已加载完所有数据
      isLoading: false,   //是否处于下拉刷新状态
      pageSize: 10, // 每页条数
      pageIndex: 1, // 页码
      result:[],
      sbList:[],
      showSb:false,
      centerData:[]
    }
  },
  components: {},
  mounted() {},
  methods: {
    onClickLeft() {
      mui.back();
    },
    gotoPage(id,aid){
      console.log(aid)
      api.gotoIndex(id,{'aid':aid});
    },
    // 获取数据列表
    getList(obj) {
      let that = this
      let _data = obj || {}
      _data.pageIndex = this.pageIndex
      http({
          url: "http://" + prods.javaIP + "/advert/advert/list",
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
              //修改服务状态
              $.each(rows, function (i, v) {
                v.advertUrl = v.advertUrl?("http://" + prods.imgIP + v.advertUrl):require('../../../static/imgs/default.png')
                v.thumbnailUrl = v.thumbnailUrl?("http://" + prods.imgIP + v.thumbnailUrl):require('../../../static/imgs/default.png')
                switch(v.status){
                  case 0:
                    v.statusName = '待审核'
                    break
                  case 1:
                    v.statusName = '审核通过'
                    break
                  case 2:
                    v.statusName = '启用'
                    break  
                  case 3:
                    v.statusName = '失效'
                    break
                  case 4:
                    v.statusName = '驳回'
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
      api.gotoIndex('adDetail',{'aid':item.aid});
    },
    cancelAd(aid){
      let that = this
      Dialog.confirm({
        title: '提示',
        message: '您确定要撤销吗？'
      }).then(() => {
         http({
          url:"http://" + prods.javaIP + "/advert/advert/remove",
          data:aid
        }).then(res=>{
          Dialog.alert({
            message: '撤销成功'
          }).then(() => {
            this.onRefresh()
          });
        })
      }).catch(() => {
        
      });
     
    }
  },
  created() {
    let that = this;
    that.userType = localStorage.getItem('userType')
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    mui.plusReady(() => {
      window.addEventListener("refleshPage", (e) => {
        that.onRefresh()
      });
    });
  }
};
</script>

<style lang="scss" scoped>
.adList {
  .mui-clearfix:after, .mui-clearfix:before{
    display: table;
    content: ' ';
  }
  .mui-clearfix:after {
      clear: both;
  }
  .left{
    float:left;
  }
  .right{
    float:right;
  }
  .updown{
    position: fixed;
    padding: 20px 30px;
    text-align: right;
    width: 100%;
    border-bottom:0.075rem solid #ebedf0;
    box-sizing: border-box;
    background-color: #fff;
    z-index: 2;
    button{
      padding:0 20px;
      letter-spacing: 2px;
    }
  }
  .van-pull-refresh{
    padding-top:120px;
  }
  .item{
    background: #fff;
    color:#333333;
    padding: 30px 20px;
    position: relative;
    border-bottom:0.075rem solid #e6e6e6;
    .img{
      float:left;
      width: 30%;
      img{
        display: block;
        width: 90%;
        height: 170px;
        border-radius: 20px;
      }
    }
    .content{
      float:left;
      width: 70%;
    }
    .list{
        line-height: 48px;
        .item_3 {
            font-size:30px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(51,51,51,1);
          }
          .item_4 {
            font-size:34px;
            font-family:Lantinghei SC;
            font-weight:600;
            color:rgba(245,176,67,1);
          }
          .item_5{
            font-size:22px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(153,153,153,1);
          }
    }
  }
}
</style>