<template>
  <div class="upDown">
    <van-nav-bar title="广告上下架" fixed left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有数据了"
      @load="onLoad"
      :offset="10"
    >
    <div class="item mui-clearfix" v-for="(item,index) in datas" :key="index">
      <div class="img"><img :src="item.thumbnailUrl"></div>
      <div class="content">
        <div class="list mui-clearfix" style="margin-bottom:6px">
          <div class="left item_5">
              设备名：{{item.dname}}
          </div>
        </div>
        <div class="list mui-clearfix" style="margin-bottom:6px">
          <div class="left item_5">
              设备类型：{{item.dtype==1?'青蛙':'蜻蜓'}}
          </div>
        </div>
        <div class="list mui-clearfix" style="margin-bottom:6px">
          <div class="left item_5">
              状态：{{item.active==1?'上架':'下架'}}
          </div>
        </div>
        <div class="right item_btn" v-show="item.active==2&&userType=='03'">
          
          <van-button type="info" size="mini" @click="toPut(item)">上架</van-button>
        </div>
        <div class="right item_btn" v-show="item.active==1&&userType=='03'">
          <van-button type="primary" size="mini" @click="tosort(item)">排序</van-button>
          <van-button type="info" size="mini" @click="toPut(item)">下架</van-button>
        </div>
      </div>
    </div>
    <div class="nodata" v-if="datas.length==0">
      <img :src="require('../../../static/imgs/nodata.png')">
    </div>
    </van-list>
    </van-pull-refresh>
    <van-dialog
      v-model="showSort"
      title="排序调整"
      show-cancel-button
      @open="openSort"
      @confirm="confirmSort"
    >
    <van-row class="paixu">
      <van-col span="8" v-for="(item,index) in sortList" :key="index"><img :src="item.thumbnailUrl"><van-field v-model="item.aorder" placeholder="请输入排序" /></van-col>
    </van-row>  
    </van-dialog>
  </div>
</template>

<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import Vue from "vue";
import { NavBar, Cell, CellGroup, Tab, Tabs,PullRefresh,List,Icon,Button,Dialog,Toast,Field,Row, Col } from "vant";

Vue.use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(Tab)
  .use(Tabs)
  .use(PullRefresh)
  .use(List)
  .use(Icon)
  .use(Button)
  .use(Dialog)
  .use(Toast)
  .use(Field)
  .use(Row)
  .use(Col)
window.mui = mui;

export default {
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      advertPutAwayDto:{},
      userType:'',
      datas:[],
      loading: false,   //是否处于加载状态
      finished: false,  //是否已加载完所有数据
      isLoading: false,   //是否处于下拉刷新状态
      pageSize: 10, // 每页条数
      pageIndex: 1, // 页码
      showSort:false,
      sortList:[],
      advertDeviceQuery:{},
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
      _data.pageIndex = this.pageIndex
      http({
          url: "http://" + prods.javaIP + "/advert/advert/toPutAway",
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
                v.thumbnailUrl = v.thumbnailUrl?("http://" + prods.imgIP + v.thumbnailUrl):require('../../../static/imgs/default.png')
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
    toPut(item){
      let that = this
      this.advertPutAwayDto.active = item.active==1?"2":"1"
      this.advertPutAwayDto.advertId = item.advertId
      this.advertPutAwayDto.did = item.did
      Dialog.confirm({
        title: '提示',
        message: item.active==1?"是否下架？":"是否上架？"
      }).then(() => {
        http({//上下架提交
          url: "http://" + prods.javaIP + "/advert/advert/putaway",
          data:that.advertPutAwayDto
        }).then(res=>{
          Dialog.alert({
            message: '操作成功'
          }).then(() => {
            that.onRefresh()
          });
        })
      }).catch(() => {
        // on cancel
      });
    },
    tosort(item){
      this.showSort = true
      this.advertDeviceQuery.active = 1
      this.advertDeviceQuery.advertId = item.advertId
      this.advertDeviceQuery.did = item.did
    },
    openSort(){
      let that = this
      
      http({//获取排序广告
          url: "http://" + prods.javaIP + "/advert/advert/toSort",
          data:that.advertDeviceQuery
        }).then(res=>{
          $.each(res.datas, function (i, v) { 
             v.thumbnailUrl = "http://" + prods.imgIP + v.thumbnailUrl
          });
          that.sortList = res.datas
        })
    },
    confirmSort(){
      let that = this
      let ids = ''
      let idsList = []
      idsList = that.sortList.sort(this.compare('aorder'))
      $.each(idsList, function (i, v) {
          if(!ids){
            ids = v.id
          }else{
            ids = ids + ',' + v.id 
          }
      });
      console.log(ids)
      http({//调整广告排序
          url: "http://" + prods.javaIP + "/advert/advert/sort",
          data:ids
        }).then(res=>{
          Dialog.alert({
            message: '排序成功'
          }).then(() => {
            that.onRefresh()
          });
        })
    },
    compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }
  },
  created() {
    let that = this;
    that.userType = localStorage.getItem('userType')
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    mui.plusReady(() => {});
  }
};
</script>

<style lang="scss" scoped>
.upDown {
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
    padding: 20px 30px;
    text-align: right;
    border-bottom:15px solid #e6e6e6;
    button{
      padding:0 20px;
      letter-spacing: 2px;
    }
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
  .paixu{
    padding:30px;
    .van-col{
      text-align: center;
      img{
        height: 100px;
      }
      .van-cell{
        border: 1px solid #e6e6e6;
        width: 70%;
        margin:0 auto;
        padding:5px 20px;
        .van-field__control{
          text-align: center!important;
        }
      }
    }
  }
}
</style>