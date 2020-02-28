<template>
  <div class="addService">
    <van-nav-bar :title="showActive?'修改售后':'新增售后'" fixed left-arrow @click-left="onClickLeft" />
    <van-field label="商户名称"  :value="deviceAppointDto.bname" readonly v-show="showActive"/>
    <van-cell-group>
      <van-cell title="服务类型" class="choose">
        <van-radio-group v-model="deviceAppointDto.atype" class="mui-clearfix">
          <van-radio class="left" icon-size="18px" name='1'>安装</van-radio>
          <van-radio class="left" icon-size="18px" name='2'>维修</van-radio>
        </van-radio-group>
      </van-cell>
      <van-field
        readonly
        clickable
        label="预约时间"
        :value="deviceAppointDto.appointDate"
        placeholder="选择时间"
        @click="showDate = true"
      />
      <van-field
        readonly
        clickable
        label="设备"
        :value="deviceAppointDto.dname"
        rows="1"
        autosize
        type="textarea"
        placeholder="选择设备"
        @click="showSb = true"
      /> 
      <van-dialog
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
      </van-dialog>
      <van-field label="服务地区"  v-model="deviceAppointDto.addrName" placeholder="请选择服务地区" @click="show = true"/>
      <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
            <van-area
              :area-list="areaList"
              :columns-num="3"
              :value="deviceAppointDto.addrId"
              ref="myArea"
              @confirm="onConfirm"
              @cancel="onCancel"
            />
      </van-popup>
      <van-field label="详细地址"  v-model="deviceAppointDto.address" placeholder="请输入详细地址" />
      <van-field label="备注" 
        rows="1"
        autosize
        v-model="deviceAppointDto.remark"
        placeholder="请输入备注" 
        type="textarea" />
    </van-cell-group>
    <div class="partEnd">
      <div class="btn" v-show="!showActive" @tap="addService">新增</div>
      <div class="btn" v-show="showActive&&userType=='03'" @tap="editService">更新</div>
    </div>
    <van-popup v-model="showDate" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showDate = false"
        @confirm="onConfirmDate"
      />
    </van-popup>
  </div>
</template>

<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import areaList from "src/public/js/area.js";
import api from "src/config/api";
import Vue from "vue";
import { NavBar, Cell, CellGroup,Field,Image,Dialog,DatetimePicker,Popup,Area,RadioGroup, Radio,Checkbox, CheckboxGroup,Toast} from "vant";

Vue.use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(Field)
  .use(Image)
  .use(Dialog)
  .use(DatetimePicker)
  .use(Popup)
  .use(Area)
  .use(RadioGroup)
  .use(Radio)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Toast)
window.mui = mui;
export default {
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  data: function() {
    return {
      areaList,
      aid:'',
      deviceAppointDto: {},
      showActive: false,
      showDate:false,
      result:[],
      sbList:[],
      userType:'',
      show:false,
      showSb:false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2035, 0, 1),
      currentDate: new Date()
    };
  },
  methods:{
    onClickLeft(){
      mui.fire(
        plus.webview.getWebviewById('serviceList'), // 父页面webview对象
        'refleshPage', // 自定义事件名称，这个名称你自己随便取
        {} // 你可以回传一些参数给父页面
      )
      mui.back();
    },
    onConfirmDate(val) {
      this.showDate = false;
      this.deviceAppointDto.appointDate = api.dateFormatter(val,false)
    },
    //确定选择城市
    onConfirm(val) {     
      this.show = false; //关闭弹框
      this.deviceAppointDto.addrName = val[0].name + "/" + val[1].name + "/" + val[2].name;
      this.deviceAppointDto.addrId = val[2].code
    },
    //取消选中城市
    onCancel() {
      this.show = false;
      this.$refs.myArea.reset(); // 重置城市列表
    },
    addService(){//添加售后
      let that = this
      if(!this.deviceAppointDto.atype||!this.deviceAppointDto.appointDate||!this.deviceAppointDto.dname
      ||!this.deviceAppointDto.addrName||!this.deviceAppointDto.addrId||!this.deviceAppointDto.address||!this.deviceAppointDto.remark){
          Toast('请填写完整信息!')
          return false
      }
        this.deviceAppointDto.atype = parseInt(this.deviceAppointDto.atype)
        http({
          url:"http://" + prods.javaIP + "/device/appoint/add",
          data:this.deviceAppointDto
        }).then(res=>{
          Dialog.alert({
            message: '添加成功'
          }).then(() => {
            that.deviceAppointDto.atype = that.deviceAppointDto.atype.toString()
            api.gotoIndex('serviceList')
          });
        })
    },
    editService(){//修改售后
      let that = this
      if(!this.deviceAppointDto.atype||!this.deviceAppointDto.appointDate||!this.deviceAppointDto.dname
      ||!this.deviceAppointDto.addrName||!this.deviceAppointDto.addrId||!this.deviceAppointDto.address||!this.deviceAppointDto.remark){
          Toast('请填写完整信息')
          return false
      }
        this.deviceAppointDto.atype = parseInt(this.deviceAppointDto.atype)
        this.deviceAppointDto.aid = this.aid
        http({
          url:"http://" + prods.javaIP + "/device/appoint/add",
          data:this.deviceAppointDto
        }).then(res=>{
            Dialog.alert({
              message: '修改成功'
            }).then(() => {
              that.deviceAppointDto.atype = that.deviceAppointDto.atype.toString()
              api.gotoIndex('serviceList')
            });
        })
    },
    openSb(){//打开选择设备
      http({
        url:"http://" + prods.javaIP + "/businessDevice/list",
        data:{}
      }).then(res=>{
          this.sbList = res.datas
      })
    },
    cancelSb(){//取消选择设备
      if(!this.deviceAppointDto.dname){
        this.result = []
      }else{
        this.result = this.deviceAppointDto.dids.split(',').map(Number)
      }
       
    },
    confirmSb(){//选择设备
        let that = this
        this.deviceAppointDto.dids = this.result.join(',')
        that.deviceAppointDto.dname = ''
        $.each(this.sbList, function (i, v) {
           $.each(that.result, function (index, val) { 
              if(v.did==val){
                if(that.deviceAppointDto.dname)
                  that.deviceAppointDto.dname = that.deviceAppointDto.dname + '、'+ v.dname
                else
                  that.deviceAppointDto.dname = v.dname
              }
           });
        });
    }
  },
  created(){
    let that = this
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    that.userType = localStorage.getItem('userType')
    
    mui.plusReady(() => {
      that.aid = plus.webview.currentWebview().aid;
      console.log('that.aid:'+that.aid)
      if(that.aid){
        that.showActive = true
        http({
          url: "http://" + prods.javaIP + "/device/appoint/detail/"+that.aid,
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
              res.data.atype = res.data.atype.toString()
              that.deviceAppointDto = res.data;
              that.result = res.data.dids.split(',')
            }
          })
          .catch(err => {
            console.log(err);
          });
      }else{
        that.showActive = false
      }
    });
  }
};
</script>


<style lang="scss">
.addService {
  .choose{
    .van-cell__title{
      flex:none;
      width: 180px;
    }
    .van-radio{
      margin:5px 40px 0 0;
    }
  }
  .partEnd{
    display: flex;
    flex-flow:row nowrap;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    .btn{
      margin-left: 20px;
      padding:10px 40px;
      color:#fff;
      font-size: 24px;
      background-color:#1989fa;
      border-radius: 10px;
      font-family: PingFang SC;
      font-weight: 500;
    }
  }
  .van-dialog__content{
    padding:10px 80px;
    .van-checkbox{
      padding: 10px 0;
    }
  }
}
</style>