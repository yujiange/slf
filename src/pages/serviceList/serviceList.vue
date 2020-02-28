<template>
  <div class="service">
    <van-nav-bar title="售后管理" fixed left-arrow @click-left="onClickLeft" @click-right="gotoPage('service')">
      <van-icon name="plus" slot="right" v-show="userType=='03'"/>
    </van-nav-bar>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有数据了"
      @load="onLoad"
      :offset="10"
    >
    <div class="item" v-for="(item,index) in datas" :key="index">
      <div class="list mui-clearfix" style="margin-bottom:6px">
        <div class="left item_5">
            预约时间：{{item.appointDate}}
        </div>
        <div class="right item_5" @tap="gotoPage('serviceDetail',item.aid)">查看详情></div>
      </div>
      <div class="list mui-clearfix" style="margin-bottom:6px">
        <div class="left item_5">
            服务地区：{{item.addrName}}
        </div>
      </div>
      <div class="list mui-clearfix" style="margin-bottom:6px">
        <div class="left item_5">
            详细地址：{{item.address}}
        </div>
      </div>
      <div class="list mui-clearfix" style="margin-bottom:6px">
        <div class="left item_5">
            流程状态：{{item.flowStatusName}}
        </div>
        <div class="right item_btn" v-show="item.flowStatus=='1'&&userType=='03'">
          <van-button type="info" size="mini" @click="gotoPage('service',item.aid)">修改</van-button>
          <van-button type="warning" size="mini" @click="cancelService(item.aid)">撤销</van-button>
        </div>
        <div class="right item_btn" v-show="item.flowStatus=='4'&&userType=='03'&&!item.comment">
          <van-button type="info" size="mini" @click="comment(item.aid)">评论</van-button>
        </div>
        <div class="right item_btn" v-show="item.flowStatus=='2'&&userType=='04'">
          <van-button type="info" size="mini" @click="bill(item.aid,'accept')">接单</van-button>
          <van-button type="warning" size="mini" @click="bill(item.aid,'refuse')">拒单</van-button>
        </div>
        <div class="right item_btn" v-show="item.flowStatus=='3'&&userType=='04'">
          <van-button type="info" size="mini" @click="complete(item.aid)">完成</van-button>
        </div>
      </div>
    </div>
    <div class="nodata" v-if="datas.length==0">
      <img :src="require('../../../static/imgs/nodata.png')">
    </div>
    </van-list>
    </van-pull-refresh>
    <van-dialog
      v-model="showComment"
      title="评论内容"
      show-cancel-button
      @confirm="confirmComment"
    >
      <van-field
        v-model="commentOrderDto.comment"
        rows="3"
        autosize
        type="textarea"
        placeholder="请评论该服务"
      />
    </van-dialog>
    <van-dialog
      v-model="showBillAccept"
      title="预计到达时间"
      show-cancel-button
      @confirm="confirmBillAccept"
    >
      <van-field
        readonly
        clickable
        v-model="takeOrderDto.arriveTime"

        left-icon="calender-o"
        placeholder="请选择时间"
        @click="showBillDate = true"
      />
    </van-dialog>
    <van-popup v-model="showBillDate" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBillDate = false"
        @confirm="onConfirmDate"
      />
    </van-popup>
    <van-dialog
      v-model="showBillRefuse"
      title="拒绝理由"
      show-cancel-button
      @confirm="confirmBillRefuse"
    >
      <van-field
        v-model="rejectOrderDto.reason"
        rows="3"
        autosize
        type="textarea"
        placeholder="请输入拒绝理由"
      />
    </van-dialog>
    <van-dialog
      v-model="showBillFinish"
      title="完成验证码"
      show-cancel-button
      @confirm="confirmBillFinish"
    >
      <van-field
        v-model="confirmOrderDto.code"
        placeholder="请完成验证码"
      />
    </van-dialog>
  </div>
</template>

<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import Vue from "vue";
import { NavBar, Cell, CellGroup, Tab, Tabs,Search,PullRefresh,List,Icon,Button,Dialog,Toast,Field,DatetimePicker,Popup } from "vant";

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
  .use(Field)
  .use(DatetimePicker)
  .use(Popup)
window.mui = mui;

export default {
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
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
      centerData:[],
      showComment:false,
      commentOrderDto:{},
      showBillAccept:false,
      takeOrderDto:{},
      showBillDate:false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2035, 0, 1),
      currentDate: new Date(),
      rejectOrderDto:{},
      showBillRefuse:false,
      showBillFinish:false,
      confirmOrderDto:{}
    }
  },
  components: {},
  mounted() {},
  methods: {
    onClickLeft() {
      mui.back();
    },
    gotoPage(id,aid){
      api.gotoIndex(id,{'aid':aid});
    },
    // 获取数据列表
    getList(obj) {
      let that = this
      let _data = obj || {}
      _data.pageIndex = this.pageIndex
      http({
          url: "http://" + prods.javaIP + "/device/appoint/list",
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
                switch(v.flowStatus){
                  case 1:
                    v.flowStatusName = '待派单'
                    break
                  case 2:
                    v.flowStatusName = '已派单'
                    break
                  case 3:
                    v.flowStatusName = '已接单'
                    break  
                  case 4:
                    v.flowStatusName = '确认'
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
    onRefresh() {    //下拉刷新
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
      api.gotoIndex('serviceDetail',{'aid':item.aid});
    },
    cancelService(aid){
      let that = this
      Dialog.confirm({
        title: '提示',
        message: '您确定要撤销吗？'
      }).then(() => {
         http({
          url:"http://" + prods.javaIP + "/device/appoint/cancle",
          data:aid
        }).then(res=>{
          Dialog.alert({
            message: '撤销成功'
          }).then(() => {
            that.onRefresh()
          });
        })
      }).catch(() => {
        
      });
     
    },
    confirmComment(){
      let that = this
      if(!this.commentOrderDto.comment){
        Toast('请输入您的评论')
        return false
      }
      http({
        url:"http://"+prods.javaIP + "/device/appoint/comment",
        data:this.commentOrderDto
      }).then(res=>{
        Dialog.alert({
          message: '评论成功'
        }).then(() => {
          that.onRefresh()
        });
      })
    },
    comment(aid){//完成单
      this.showComment = true
      this.commentOrderDto = {}
      this.commentOrderDto.aid = aid
    },
    bill(aid,type){
      let that = this
      this.takeOrderDto = {}
      this.rejectOrderDto = {}
      this.takeOrderDto.aid = aid
      this.rejectOrderDto.aid = aid
      switch(type){
        case 'accept':
          that.showBillAccept = true
          break
        case 'refuse': 
          that.showBillRefuse = true
          break
      }
    },
    confirmBillAccept(){//接单确认
      if(!this.takeOrderDto.arriveTime){
        Toast('请选择预计到达时间')
        return false
      }
      let that = this
      http({
        url:"http://"+prods.javaIP + "/device/appoint/takeOrder",
        data:this.takeOrderDto
      }).then(res=>{
        Dialog.alert({
          message: '接单成功'
        }).then(() => {
          that.onRefresh()
        });
      })
    },
    onConfirmDate(val) {//接单时间确认
      this.showBillDate = false;
      this.takeOrderDto.arriveTime = api.dateFormatter(val,true)
    },
    confirmBillRefuse(){//拒单确认
      let that = this
      if(!this.rejectOrderDto.reason){
        Toast('请输入拒绝理由')
        return false
      }
      http({
        url:"http://"+prods.javaIP + "/device/appoint/rejectOrder",
        data:this.rejectOrderDto
      }).then(res=>{
        Dialog.alert({
          message: '拒单成功'
        }).then(() => {
          that.onRefresh()
        });
      })
    },
    confirmBillFinish(){//确定完成订单
      let that = this
      console.log(this.confirmOrderDto)
      if(!this.confirmOrderDto.code){
        Toast('请输入完成验证码')
        return false
      }
      http({
        url:"http://"+prods.javaIP + "/device/appoint/confirm",
        data:this.confirmOrderDto
      }).then(res=>{
        Dialog.alert({
          message: '确认完成成功'
        }).then(() => {
          that.onRefresh()
        });
      })
    },
    complete(aid){//完成单
      this.showBillFinish = true
      this.confirmOrderDto = {}
      this.confirmOrderDto.aid = aid
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
.service {
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
          transform: scaleY(0.5);
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
  // .partOne{
  //   display: flex;
  //   flex-flow:row nowrap;
  //   justify-content: space-between;
  //   align-items: center;
  //   padding: 20px 0;
  //   border-bottom:10px solid rgba(242,242,242,1.0);
  //   .btn{
  //     padding:10px 20px;
  //     color:#fff;
  //     font-size: 24px;
  //     background-color:rgba(22,155,213,1);
  //     border-radius: 10px;
  //     font-family: PingFang SC;
  //     font-weight: 500;
  //   }
  // }
}
</style>