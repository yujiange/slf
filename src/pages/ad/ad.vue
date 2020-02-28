<template>
  <div class="addAd">
    <van-nav-bar :title="showActive?'修改广告':'新增广告'" fixed left-arrow @click-left="onClickLeft" />
    <van-cell-group>
      <van-field label="跳转地址"  v-model="advertDto.targetUrl" placeholder="请输入跳转地址（选填）" />
      <van-field
        readonly
        clickable
        label="开始时间"
        :value="advertDto.startTime"
        placeholder="选择时间"
        @click="openDate('1')"
      />
      <van-field
        readonly
        clickable
        label="结束时间"
        :value="advertDto.endTime"
        placeholder="选择时间"
        @click="openDate('2')"
      />
      <van-field
        readonly
        clickable
        label="设备"
        :value="advertDto.dnames"
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
      <div class="adpic">广告图</div>
      <van-uploader v-model="fileListOne" multiple :max-count="1" :after-read="afterReadOne" />
      <div class="tips">说明：请按照800*1280像素格式上传图片</div>
    </van-cell-group>
    <div class="partEnd">
      <div class="btn" v-show="!showActive" @tap="addAd">新增</div>
      <div class="btn" v-show="showActive" @tap="editAd">更新</div>
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
import { NavBar, Cell, CellGroup,Field,Image,Dialog,DatetimePicker,Popup,RadioGroup, Radio,Checkbox, CheckboxGroup,Toast,Uploader} from "vant";

Vue.use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(Field)
  .use(Image)
  .use(Dialog)
  .use(DatetimePicker)
  .use(Popup)
  .use(RadioGroup)
  .use(Radio)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Toast)
  .use(Uploader)
window.mui = mui;
export default {
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  data: function() {
    return {
      areaList,
      aid:'',
      advertDto: {},
      showActive: false,
      showDate:false,
      showDateIndex:'',
      result:[],
      sbList:[],
      show:false,
      showSb:false,
      fileListOne: [],
      fileOne: "",
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2035, 0, 1),
      currentDate: new Date()
    };
  },
  methods:{
    onClickLeft(){
      mui.fire(
        plus.webview.getWebviewById('adList'), // 父页面webview对象
        'refleshPage', // 自定义事件名称，这个名称你自己随便取
        {} // 你可以回传一些参数给父页面
      )
      mui.back();
    },
    openDate(index){
      this.showDate = true
      this.showDateIndex = index
      if(index=='1'){
        // this.currentDate = this.advertDto.startTime?new Date(2020,1,3):new Date()
      }else{
        // this.currentDate = this.advertDto.endTime?new Date():new Date()
      }
    },
    onConfirmDate(val) {
      this.showDate = false;
      if(this.showDateIndex == '1'){
          this.advertDto.startTime = api.dateFormatter(val,false)
      }else if(this.showDateIndex == '2'){
          this.advertDto.endTime = api.dateFormatter(val,false)
      }
      
    },
    afterReadOne(file) {
      let that = this;
      mui.ajax({
        url: "http://" + prods.javaIP + "/common/upload/base64litimg",
        type: "POST",
        crossDomain: true, //强制使用5+跨域
        data: { img: file["content"] },
        dataType: "JSON",
        success: function(res) {
          that.advertDto.thumbnailUrl = JSON.parse(res).litimg;
          that.advertDto.advertUrl = JSON.parse(res).url;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          Toast("请求失败" + XMLHttpRequest.responseText);
        }
      });
    },
    addAd(){//添加广告
      let that = this
      if(!this.advertDto.startTime||!this.advertDto.endTime
      ||!this.advertDto.dnames||!this.advertDto.dids||!this.advertDto.advertUrl){
          Toast('请填写完整信息!')
          return false
      }
        http({
          url:"http://" + prods.javaIP + "/advert/advert/add",
          data:this.advertDto
        }).then(res=>{
          Dialog.alert({
            message: '添加成功'
          }).then(() => {
            that.onClickLeft()
          });
        })
    },
    editAd(){//修改广告
      let that = this
      if(!this.advertDto.startTime||!this.advertDto.endTime
      ||!this.advertDto.dnames||!this.advertDto.dids||!this.advertDto.advertUrl){
          Toast('请填写完整信息!')
          return false
      }
        this.advertDto.aid = this.aid
        http({
          url:"http://" + prods.javaIP + "/advert/advert/add",
          data:this.advertDto
        }).then(res=>{
            Dialog.alert({
              message: '修改成功'
            }).then(() => {
              that.onClickLeft()
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
      if(!this.advertDto.dnames){
        this.result = []
      }else{
        this.result = this.advertDto.dids.split(',').map(Number)
      }
       
    },
    confirmSb(){//选择设备
        let that = this
        this.advertDto.dids = this.result.join(',')
        that.advertDto.dnames = ''
        $.each(this.sbList, function (i, v) {
           $.each(that.result, function (index, val) { 
              if(v.did==val){
                if(that.advertDto.dnames)
                  that.advertDto.dnames = that.advertDto.dnames + '、'+ v.dname
                else
                  that.advertDto.dnames = v.dname
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
    mui.plusReady(() => {
      that.aid = plus.webview.currentWebview().aid;
      console.log('that.aid:'+that.aid)
      if(that.aid){
        that.showActive = true
        http({
          url: "http://" + prods.javaIP + "/advert/advert/detail/"+that.aid,
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
              that.result = res.data.dids.split(',')
              that.fileListOne = []
              that.fileListOne.push({
                url:"http://"+prods.imgIP + res.data.advertUrl
              })
              console.log(JSON.stringify(res.data))
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
.addAd {
  .van-hairline--top-bottom::after{
    border-width: 0;
  }
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
  .adpic{
    padding: 20px 30px;
    font-size: 28px;
  }
  .van-uploader{
    display: block;
  }
  .van-uploader__upload,.van-uploader__preview{
    margin: 30px auto;
  }
  .tips{
    padding: 0 0 30px 30px;
    font-size: 24px;
    color:#ccc;
  }
}
</style>