<template>
  <div class="updatePass">
    <van-nav-bar title="修改密码" left-arrow @click-left="onClickLeft" />
    <van-cell-group>
      <van-field
        v-model="oldPass"
        type="password"
        label="旧密码"
        placeholder="请输入旧密码"
        clearable
        required
      />
      <van-field
        v-model="newPass"
        type="password"
        label="新密码"
        placeholder="请输入新密码"
        clearable
        required
      />
      <van-field
        v-model="comPass"
        type="password"
        label="确认新密码"
        placeholder="请再次输入新密码"
        clearable
        required
      />
      </van-cell-group>
      <div class="finishTap" @tap="finishTap">完成</div>
  </div>
</template>


<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import Vue from "vue";
import { NavBar, Cell, CellGroup,Field,Image,Toast,Dialog } from "vant";

Vue.use(NavBar)
  .use(Cell)
  .use(CellGroup)
  .use(Field)
  .use(Image)
  .use(Toast)
  .use(Dialog);
window.mui = mui;
export default {
  data: function() {
    return {
      oldPass: '',
      newPass: '',
      comPass: ''
    }
  },
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  methods:{
    onClickLeft(){
      mui.back();
    },
    finishTap(){
        let that = this;
        if(this.oldPass&&this.newPass&&this.comPass){
          if(this.newPass !== this.comPass){
            Toast('两个新密码不一样，请重新输入！');
            return false;
          }
          if(this.oldPass == this.newPass||this.oldPass == this.comPass){
            Toast('新老密码不能一样！');
            return false;
          }
          http({
            url: "http://" + prods.javaIP + "/system/user/resetPwd",
            data: {
              oldPwd:that.oldPass,
              pwd:that.newPass
            }
          })
            .then(res => {
              if (res.code === 0) {
                Dialog.alert({
                  title: '提示',
                  message: '修改成功'
                }).then(() => {
                  api.gotoIndex('my');
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        }else{
          Toast('请填写完整信息！');
        }
    }
  },
  created(){
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });
    
  }
};
</script>


<style lang="scss">
.updatePass {
  .finishTap{
    width: 690px;
    height: 80px;
    line-height: 80px;
    background: rgba(0, 114, 255, 1);
    border-radius: 40px;
    margin: 40px auto;
    text-align: center;
    color: #fff;
    font-size: 34px;
    font-family: PingFang SC;
    &.active{
      background:#B2D5FF;
    }
  }
}
</style>