<template>
  <div style="height:100%">
    <div class="info" v-if="showFlag==0">
      <van-nav-bar title="基本信息" fixed left-arrow @click-left="onClickLeft" />
      <div role="button" tabindex="0" class="van-cell van-cell--clickable avatar" @click="showUpdate(1)">
        <div class="van-cell__title"><span>头像</span></div>
        <div class="van-cell__value"><img :src="avatar"></div>
        <i class="van-icon van-icon-arrow van-cell__right-icon"></i>
      </div>
      <van-cell title="姓名" is-link :value="userName" @click="showUpdate(2)"/>
      <van-cell title="手机号" :value="tel"/>
      <van-cell title="性别" is-link :value="sexName" @click="showSexPopup"/>
      <van-popup v-model="showSex" position="bottom" :style="{ height: '50%' }">
            <van-picker
              show-toolbar
              title="性别"
              :default-index="sexIndex"
              :columns="sexList"
              @cancel="onCancelSex"
              @confirm="onConfirmSex"
            />
      </van-popup>
      <van-cell title="年龄" @click="showPickerPopup" is-link :value="age"/>
      <van-popup v-model="showPicker" position="bottom" :style="{ height: '50%' }">
            <van-picker
              show-toolbar
              title="年龄"
              :default-index="age"
              :columns="columns"
              @cancel="onCancelPicker"
              @confirm="onConfirmPicker"
            />
      </van-popup>
      <van-cell class="theArea" title="地区" is-link  @click="showPopup" :value="carmodel"/>
      <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
            <van-area
              :area-list="areaList"
              :columns-num="3"
              :value="addrId"
              ref="myArea"
              @change="onChange"
              @confirm="onConfirm"
              @cancel="onCancel"
            />
      </van-popup>
    </div>
    <div class="avatarPage" v-if="showFlag==1" style="height:100%">
      <van-nav-bar title="修改头像" fixed left-arrow @click-left="showUpdate(0)" @click-right="showAvatarRight" >
        <van-icon name="weapp-nav" slot="right" />
      </van-nav-bar>
      <van-action-sheet
        v-model="showAvatar"
        :actions="actions"
        cancel-text="取消"
        @cancel="onCancelAvatar"
        @select="onSelect"
      />
      <div class="avatarPageIndex">
        <img :src="avatar" >
      </div>
    </div>
    <div class="userName" v-if="showFlag==2">
      <van-nav-bar title="修改姓名" fixed left-text="取消"
  right-text="完成" @click-left="showUpdate(0)" @click-right="userNameRight"/>
      <van-cell-group>
        <van-field clearable v-model="userNameUpdate" placeholder="请输入姓名" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import areaList from "src/public/js/area.js";
import photoByCamera from 'src/util/photoByCamera.js';
import photoByGallery from 'src/util/photoByGallery.js';
import Vue from "vue";
import { NavBar, Cell, CellGroup,Toast,Area,Popup,Picker,Field,Dialog,Icon,ActionSheet } from "vant";

Vue.use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(Toast)
  .use(Area)
  .use(Popup)
  .use(Picker)
  .use(Field)
  .use(Dialog)
  .use(Icon)
  .use(ActionSheet);
window.mui = mui;

export default {
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      areaList,
      showFlag:0,
      carmodel: "选择地区",
      addrId:'',
      show: false,
      avatar:require('../../../static/imgs/default.png'),
      userName:'填写姓名',
      tel:'',
      sexName:'选择性别',
      sexIndex:'',
      age:'选择年龄',
      userNameUpdate:'',
      showPicker:false,
      showSex:false,
      showAvatar:false,
      actions: [
        { name: '拍摄' },
        { name: '从手机相册选择' },
        { name: '保存图片' }
      ],
      sexList:['男','女'],
      columns:['0', '1', '2', '3', '4','5', '6', '7', '8', '9','10', '11', '12', '13', '14','15', '16', '17', '18', '19','20', '21', '22', '23', '24','25', '26', '27', '28', '29',
      '30', '31', '32', '33', '34','35', '36', '37', '38', '39','40', '41', '42', '43', '44','45', '46', '47', '48', '49','50', '51', '52', '53', '54','55', '56', '57', '58', '59',
      '60', '61', '62', '63', '64','65', '66', '67', '68', '69','70', '71', '72', '73', '74','75', '76', '77', '78', '79','80', '81', '82', '83', '84','85', '86', '87', '88', '89',
      '90', '91', '92', '93', '94','95', '96', '97', '98', '99','100']
    };
  },
  components: {},
  mounted() {},
  methods: {
    onClickLeft() {
      mui.fire(
        plus.webview.getWebviewById('my'), // 父页面webview对象
        'refleshPage', // 自定义事件名称，这个名称你自己随便取
        {} // 你可以回传一些参数给父页面
      )
      mui.back();
    },
    gotoNew(id) {
      mui.openWindow({
        url: "./" + id + ".html",
        id: id,
        show: {
          aniShow: "fade-in",
          duration: 600
        }
      });
    },
    showUpdate(type){
      let that = this;
      if(type==0){
        this.showFlag = type;
      }else if(type==2){
        this.userNameUpdate = this.userName
        this.showFlag = type;
      }else{
        this.showFlag = type;
      }
    },
    showAvatarRight(){
      this.showAvatar = true;
    },
    onCancelAvatar() {
      this.showAvatar = false;
    },
    onSelect(item) {
      let that = this
      this.showAvatar = false;
      if(item.name=='拍摄'){
        photoByCamera(
          imgSrc => {
            plus.nativeUI.showWaiting('图片上传中');
              // 第一步：创建上传对象
              let task = plus.uploader.createUpload(
                "http://" + prods.javaIP + "/common/upload",   // 请求接口
                { method:"POST"}, // 请求类型
                function ( t, status ) { // 上传结束回调
                // console.log(status)
                // console.log(JSON.stringify(t))
                  plus.nativeUI.closeWaiting(); // 关闭loading动画
                  if ( status == 200) {  // 上传成功
                    Toast('上传成功') // 给个小提示
                    // 之后的业务逻辑写在这里
                    // 如果后台有返回值，则这样取 t.responseText 这是个字符串，需转为json对象
                    http({
                      url:"http://" + prods.javaIP + "/system/user/edit",
                      data:{
                        avatar:JSON.parse(t.responseText).url
                      }
                    }).then(res=>{
                      that.avatar = "http://"+prods.imgIP + JSON.parse(t.responseText).url
                    });
                  } else { // 失败处理
                    Toast('网络连接异常');
                  }
                }
              );
              // 第二步：添加上传图片路径以及其他要传给后台的参数
              // 注意，参数只能为字符串！！！
              var img = plus.io.convertAbsoluteFileSystem(imgSrc);
                // 添加图片参数
              task.addFile(img, {key: 'file'});

              // 第三步： 开始上传
              task.start();
          },
          err => {
          
          }
        )
      }else if(item.name=='从手机相册选择'){
        photoByGallery(
          imgSrcList => {
              plus.nativeUI.showWaiting('图片上传中');
              // 第一步：创建上传对象
              let task = plus.uploader.createUpload(
                "http://" + prods.javaIP + "/common/upload",   // 请求接口
                { method:"POST"}, // 请求类型
                function ( t, status ) { // 上传结束回调
                // console.log(status)
                // console.log(JSON.stringify(t))
                  plus.nativeUI.closeWaiting(); // 关闭loading动画
                  if ( status == 200) {  // 上传成功
                    Toast('上传成功') // 给个小提示
                    // 之后的业务逻辑写在这里
                    // 如果后台有返回值，则这样取 t.responseText 这是个字符串，需转为json对象
                    http({
                      url:"http://" + prods.javaIP + "/system/user/edit",
                      data:{
                        avatar:JSON.parse(t.responseText).url
                      }
                    }).then(res=>{
                      that.avatar = "http://"+prods.imgIP + JSON.parse(t.responseText).url
                    });
                    // console.log(JSON.stringify(t))
                    // console.log(t.responseText)
                  } else { // 失败处理
                    Toast('网络连接异常');
                  }
                }
              );
              // 第二步：添加上传图片路径以及其他要传给后台的参数
              // 注意，参数只能为字符串！！！
              var img = plus.io.convertAbsoluteFileSystem(imgSrcList);
                // 添加图片参数
              task.addFile(img, {key: 'file'});

              // 第三步： 开始上传
              task.start();
          },
          err => {
            
          })
      }else if(item.name=='保存图片'){
        console.log(that.avatar);
            if(that.avatar.indexOf('./')!==-1){
               Toast('请先上传图片')
            }else if(that.avatar){
                let imgDtask = plus.downloader.createDownload(that.avatar,{method:'GET'}, function (d,status) {
                        if(status == 200){
                            plus.gallery.save(d.filename, function () {//保存到相册
                                plus.io.resolveLocalFileSystemURL(d.filename, function (enpty) {
                                // 关闭弹框
                                    Toast('保存成功')
                                });

                            })
                        }else{
                            Toast('保存失败')
                        }
                });
                imgDtask.start()
            }
      }
    },
    userNameRight(){
      let that = this;
      if(!this.userNameUpdate || this.userNameUpdate.trim() == ""){
        Toast('不能为空！');
        return false
      }else{
        this.showFlag = 0;
      }
      http({
        url:"http://" + prods.javaIP + "/system/user/edit",
        data:{
          userName:that.userNameUpdate
        }
      }).then(res=>{
        that.userName = that.userNameUpdate
      });
    },
    //选择性别
    showSexPopup(){
      this.showSex = true;
    },
    onConfirmSex(value, index) {
      // Toast(`当前值：${value}, 当前索引：${index}`);
      let that = this;
      
      this.showSex = false;
      http({
        url:"http://" + prods.javaIP + "/system/user/edit",
        data:{
          sex:index
        }
      }).then(res=>{
        that.sexName = value;
        that.sexIndex = index
      });
    },
    onCancelSex() {
      this.showSex = false;
    },
    //选择年龄
    showPickerPopup(){
      this.showPicker = true;
    },
    onConfirmPicker(value, index) {
      // Toast(`当前值：${value}, 当前索引：${index}`);
      this.age = value;
      this.showPicker = false;
      http({
        url:"http://" + prods.javaIP + "/system/user/edit",
        data:{
          age:value
        }
      }).then(res=>{
        that.age = value;
      });
    },
    onCancelPicker() {
      this.showPicker = false;
    },
    // 弹出层显示 选择地区
    showPopup() {
      this.show = true;
    },
    //value=0改变省，1改变市，2改变区
    onChange(picker, index, value) {
      let val = picker.getValues();
      console.log(val);
      console.log(index); 
      console.log(value); 
      let areaName = "";
      for (var i = 0; i < val.length; i++) {
        areaName = areaName + (i == 0 ? "" : "/") + val[i].name;
      }
      this.carmodel = areaName;
      this.addrId = val[2].code
    },
    //确定选择城市
    onConfirm(val) {
      let that = this;      
      this.show = false; //关闭弹框
      http({
        url:"http://" + prods.javaIP + "/system/user/edit",
        data:{
          addr:that.carmodel,
          addrId:that.addrId
        }
      }).then(res=>{
        that.carmodel = val[0].name + "/" + val[1].name + "/" + val[2].name;
        that.addrId = val[2].code
      });
    },
    //取消选中城市
    onCancel() {
      this.show = false;
      this.$refs.myArea.reset(); // 重置城市列表
    }
  },
  created() {
    let that = this;
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    http({
      url: "http://" + prods.javaIP + "/system/user/detail",
      data: {}
    })
      .then(res => {
        console.log(JSON.stringify(res.data))
        that.avatar = res.data.avatar?("http://"+prods.imgIP + res.data.avatar):require('../../../static/imgs/default.png')
        that.userName = res.data.userName || '填写姓名';
        that.tel = res.data.phonenumber;
        that.sexName = res.data.sex=='0'?'男':'女' || '选择性别';
        that.sexIndex = res.data.sex
        that.age = res.data.age || '选择年龄';
        that.carmodel = res.data.addr || '选择地区';
        that.addrId = res.data.addrId;
      })
      .catch(err => {});
    mui.plusReady(() => {});
  }
};
</script>

<style lang="scss" scoped>
.info {
  .van-cell {
    font-size:30px;
    font-family:PingFang SC;
    color:rgba(51,51,51,1);
    &.theArea{
      margin-top: 17px;
    }
    &.avatar{
      line-height: 130px;
      .van-cell__value,.van-cell__title{
        height: 130px;
      }
      .van-cell__value img{
        width: 130px;
        height: 130px;
        border-radius:10px;
      }
      .van-icon{
        margin-top:30px;
      }
    }
    .van-cell__value{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.avatarPage{
  height: 100%;
  background-color: #000;
  .van-nav-bar{
    background-color: #000;
    .van-icon,.van-nav-bar__title{
      color:#fff;
    }
  }
  .van-hairline--bottom::after{
    border-bottom-width: 0;
  }
  .avatarPageIndex{
    height: 100%;
    width: 100%;
    background-color: #000;
    z-index: 1;
    img{
      width: 100%;
      margin-top: 20%;
      height: auto;
    }
  }
}

</style>