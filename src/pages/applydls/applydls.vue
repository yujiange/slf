<template>
  <div class="applydls">
    <van-nav-bar title="申请成为分销商" fixed left-arrow @click-left="onClickLeft" />
    <van-steps :active="active">
      <van-step>基本信息</van-step>
      <van-step>上传凭证</van-step>
    </van-steps>
    <div class="content">
      <van-cell-group id="step1" v-if="stepShow">
        <van-field label="代理等级" placeholder="" disabled v-model="dldj" />
        <van-field label="代理费用" placeholder="" disabled v-model="dlfy" />
        <van-field label="代理商名称" placeholder="请输入名称" v-model="dlmc" />
        <van-field label="联系人" placeholder="请输入联系人" v-model="lxr" />
        <van-field
          label="所在区域"
          @click="showPopup"
          v-model="carmodel"
          right-icon="arrow"
          placeholder="请输入所在区域"
        />
        <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
          <van-area
            :area-list="areaList"
            :columns-num="3"
            ref="myArea"
            @confirm="onConfirm"
            @cancel="onCancel"
          />
        </van-popup>
        <van-field label="详细地址" placeholder="请输入详细地址" v-model="address" />
      </van-cell-group>
      <div id="step2" v-if="!stepShow">
        <div class="item">
          <p>
            法人身份证
            <span>人像照</span>
          </p>
          <van-uploader v-model="fileListOne" multiple :max-count="1" :after-read="afterReadOne" />
        </div>
        <div class="item">
          <p>
            法人身份证
            <span>国徽照</span>
          </p>
          <van-uploader v-model="fileListTwo" multiple :max-count="1" :after-read="afterReadTwo" />
        </div>
        <div class="item">
          <p>营业执照</p>
          <van-uploader
            v-model="fileListThree"
            multiple
            :max-count="1"
            :after-read="afterReadThree"
          />
        </div>
      </div>
    </div>
    <div class="next" @tap="nextStep" v-if="stepShow">下一步</div>
    <div class="next" @tap="finishStep" v-if="!stepShow">下一步</div>
  </div>
</template>

<script>
import mui from "src/public/js/mui.min.js";
import http from "src/util/ajax";
import prods from "src/config/api.config";
import api from "src/config/api";
import areaList from "src/public/js/area.js";
import Vue from "vue";
// import { getGlobalData } from "src/config/global_data.js";
import {
  NavBar,
  Row,
  Col,
  Step,
  Steps,
  Field,
  Cell,
  CellGroup,
  Icon,
  Area,
  Popup,
  Toast,
  Uploader
} from "vant";
Vue.use(Cell)
  .use(CellGroup)
  .use(Row)
  .use(Col)
  .use(Step)
  .use(Steps)
  .use(Field)
  .use(NavBar)
  .use(Icon)
  .use(Area)
  .use(Popup)
  .use(Toast)
  .use(Uploader);
window.mui = mui;

export default {
  data() {
    return {
      active: 0,
      areaList,
      carmodel: "",
      show: false,
      comboId: "",
      dldj: "",
      dlfy: "",
      dlmc: "",
      lxr: "",
      addrId:"",
      address: "",
      stepShow: true,
      fileListOne: [],
      fileListTwo: [],
      fileListThree: [],
      fileOne: "",
      fileTwo: "",
      fileThree: ""
    };
  },
  components: {},
  mounted() {},
  methods: {
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
    onClickLeft() {
      mui.back();
    },
    // 弹出层显示
    showPopup() {
      this.show = true;
    },
    //确定选择城市
    onConfirm(val) {
      console.log(val[0].name + "," + val[1].name);
      this.carmodel = val[0].name + "/" + val[1].name + "/" + val[2].name;
      this.addrId = val[2].code
      this.show = false; //关闭弹框
    },
    //取消选中城市
    onCancel() {
      this.show = false;
      this.$refs.myArea.reset(); // 重置城市列表
    },
    afterReadOne(file) {
      let that = this;
      mui.ajax({
        url: "http://" + prods.javaIP + "/upload/base64",
        type: "POST",
        crossDomain: true, //强制使用5+跨域
        data: { img: file["content"] },
        dataType: "JSON",
        success: function(res) {
          that.fileOne = JSON.parse(res).url;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          mui.alert("请求失败" + XMLHttpRequest.responseText);
        }
      });
    },
    afterReadTwo(file) {
      let that = this;
      mui.ajax({
        url: "http://" + prods.javaIP + "/upload/base64",
        type: "POST",
        crossDomain: true, //强制使用5+跨域
        data: { img: file["content"] },
        dataType: "JSON",
        success: function(res) {
          that.fileTwo = JSON.parse(res).url;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          mui.alert("请求失败" + XMLHttpRequest.responseText);
        }
      });
    },
    afterReadThree(file) {
      let that = this;
      mui.ajax({
        url: "http://" + prods.javaIP + "/upload/base64",
        type: "POST",
        crossDomain: true, //强制使用5+跨域
        data: { img: file["content"] },
        dataType: "JSON",
        success: function(res) {
          that.fileThree = JSON.parse(res).url;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          mui.alert("请求失败" + XMLHttpRequest.responseText);
        }
      });
    },
    nextStep() {
      let check = false;
      let that = this;
      mui("#step1 input").each(function() {
        //若当前input为空，则alert提醒
        if (!this.value || this.value.trim() == "") {
          Toast("还有资料没有填完！");
          check = false;
          return false;
        }
        check = true;
      }); //校验通过，继续执行业务逻辑
      if (check) {
        this.active = 1;
        this.stepShow = false;
      }
    },
    finishStep() {
      let that = this;
      console.log(that.comboId);
      if (this.fileOne && this.fileTwo) {
        http({
          url: "http://" + prods.javaIP + "/agent/agent/add",
          data: {
            comboId: that.comboId,
            addId: that.addrId,
            addName:that.carmodel,
            agentName: that.dlmc,
            linkName: that.lxr,
            linkAddr: that.address,
            authNegative: that.fileOne,
            authPositive: that.fileTwo,
            codeUrl: that.fileThree
          }
        })
          .then(res => {
            api.gotoIndex("my");
          })
          .catch(err => {});
      } else {
        Toast("请上传身份证正反面图片");
      }
    }
  },
  created() {
    let that = this;
    mui.init({
      swipeBack: true //启用右滑关闭功能
    });

    mui.plusReady(() => {
      that.dldj = plus.webview.currentWebview().lable;
      that.dlfy = plus.webview.currentWebview().price;
      that.comboId = plus.webview.currentWebview().comboId;
      console.log(that.comboId);
    });
  }
};
</script>

<style lang="scss" scoped>
.applydls {
  .van-nav-bar {
    .van-icon {
      color: #666666;
    }
  }
  .van-steps {
    padding: 30px 150px;
  }
  .content {
    margin-top: 20px;
    background-color: #fff;
    padding: 30px 0 200px;
    .van-cell {
      color: #4d4d4d;
      .van-cell__value {
        input.van-field__control {
          color: #0072ff;
        }
      }
    }
    #step2 {
      text-align: center;
      .item p {
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        margin: 20px 0;
        span {
          color: #ff0000;
        }
      }
    }
  }
  .next {
    width: 690px;
    height: 100px;
    background: rgba(0, 114, 255, 1);
    border-radius: 50px;
    margin: 0 auto;
    text-align: center;
    line-height: 100px;
    color: #fff;
    position: fixed;
    bottom: 40px;
    left: 30px;
  }
}
</style>