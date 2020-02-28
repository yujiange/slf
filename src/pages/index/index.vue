<template>
    <div class="index">
        <div class="logo"><img src="../../../static/imgs/logo.png" alt="logo"></div>
        <van-swipe :autoplay="5000">
            <van-swipe-item v-for="(image, index) in images" :key="index">
                <img v-lazy="image" />
            </van-swipe-item>
        </van-swipe>
        <van-row class="notice">
            <van-col span="4" class="noticeLeft"><img src="../../../static/imgs/notice.png" alt=""></van-col>
            <van-col span="16" class="noticeCenter"><van-notice-bar color="#333333" background="#fff">热烈庆祝脸易付试运行通知</van-notice-bar></van-col>
            <!-- <van-col span="4" class="noticeRight">更多></van-col> -->
        </van-row>
        <div class="content">
            <div class="title">数据统计</div>
            <van-row type="flex" justify="space-between">
                <van-col span="12">
                    <div class="item" v-lazy:background-image='require("../../../static/imgs/iconOrder_1.png")'>
                    <h3>总订单数</h3><div>{{orders}}笔</div>
                    </div>
                </van-col>
                <van-col span="12">
                    <div class="item" v-lazy:background-image='require("../../../static/imgs/iconOrder_2.png")'>
                    <h3>总金额</h3><div>{{moneyTotal}}元</div>
                    </div>
                </van-col>
            </van-row>
            <van-row type="flex" justify="space-between">
                <van-col span="12">
                    <div class="item" v-lazy:background-image='require("../../../static/imgs/iconOrder_3.png")'>
                    <h3>蜻蜓交易总数</h3><div>{{ordersQt}}笔</div>
                    </div>
                </van-col>
                <van-col span="12">
                    <div class="item" v-lazy:background-image='require("../../../static/imgs/iconOrder_4.png")'>
                    <h3>青蛙交易总数</h3><div>{{ordersQw}}笔</div>
                    </div>
                </van-col>
            </van-row>
        </div>
        <footor :active="0"></footor>
    </div>
</template>

<script>
import footor from "src/components/footer/footer.vue";
import mui from "src/public/js/mui.min.js"
import http from 'src/util/ajax'
import prods from 'src/config/api.config'
import api from 'src/config/api'
import Vue from 'vue'
import { Swipe, SwipeItem,Lazyload,Row, Col,NoticeBar} from 'vant'

Vue.use(Swipe).use(SwipeItem).use(Lazyload).use(Row).use(Col).use(NoticeBar)

window.mui = mui;
export default {
    data(){
        return {
            orders:15,
            moneyTotal:0,
            ordersQt:0,
            ordersQw:0,
            images: [
                require("../../../static/imgs/banner1.png"),
                require("../../../static/imgs/banner2.png"),
                require("../../../static/imgs/banner3.png")
            ]
        }
    },
    components: {
        footor
    },
    mounted(){
        
    },
    methods: {
        gotoNew(id){ 
            mui.openWindow({
                url: "./"+id+".html",
                id: id,
                show: {
                    aniShow: "fade-in",
                    duration: 600
                }
            });
        },

    },
    created() {
        let that = this;
        mui.init({
            swipeBack: true //启用右滑关闭功能
        });
        http({
            url: "http://" + prods.javaIP + "/order/order/dataCount",
            data:{}
        }).then(res => {
            that.orders = res.data.totalOrder
            that.moneyTotal = res.data.totalMoney
            that.ordersQt = res.data.qtValidOrders
            that.ordersQw = res.data.qwValidOrders
        }).catch(err => {
            
        })
        mui.plusReady(() => {
            
        });

    }
};
</script>

<style lang="scss" scoped>

.index{
    .logo{
        padding: 35px 20px;
        img{
            width: 244px;
            height: 60px;
        }
    }
    .van-swipe{
        padding: 0 20px;
        img{
            width: 710px;
            height: 320px;
            border-radius:20px;
        }
    }
    .notice{
        padding:20px 0;
        border-bottom: 1px solid #E6E6E6;
        .noticeLeft{
            height: 60px;
            border-right: 1px solid #ccc;
            img{
                width: 60px;
                height: 28px;
                margin-left: 30px;
                margin-top:16px;
            }
        }
        .noticeCenter{
            height: 60px;
            .van-notice-bar{
                height: 60px;
                padding: 0 0 0 21px;
            }
        }
        .noticeRight{
            height: 60px;
            line-height: 60px;
            font-size:24px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(153,153,153,1);
            padding-left: 10px;
        }
    }
    .content{
        .title{
            margin: 40px 0 20px 30px;
            font-size:34px;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(51,51,51,1);
        }
        .van-col{
            padding: 0 30px;
            margin-bottom:40px;
            .item{
                width: 320px;
                height:146px;
                background-size:cover;
                overflow: hidden;
                color:#fff;
                padding:19px;
                box-sizing: border-box;
                h3{
                    font-size:24px;
                    font-family:PingFang SC;
                    font-weight:400;
                    margin-bottom: 10px;
                }
                div{
                    font-size:40px;
                    font-family:PingFang SC;
                    font-weight:400;
                }
            }
        }
    }
}
</style>