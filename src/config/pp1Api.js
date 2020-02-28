import apiRoot from './api.config'
import http from "src/util/ajax"

// 脸易付 JAVA API 跟路径
var serverIP = apiRoot.javaIP;

// 脸易付 PHP API 根路径
var serverIP2 = apiRoot.imgIP;


export default {
    Mobile_Boolean:false,
    loginBool:false,
    sendMessageIsOk:false,
    password_Boolean:false,
    getCodeData:'',
    gotoIndex(id,extras){
        console.log(JSON.stringify(extras))
        mui.openWindow({
            url: "./"+id+".html",
            id: id,
            extras: extras,
            show: {
                aniShow: "fade-in",
                duration: 600
            }
        });
    },
    //清除input文本框内容
    clearInputInit(){
        $(".mui-input-row").on("tap",".lyf-clear",function(){
            $(this).siblings('.lyf-input-clear').val('');
        })
    },
    //监控input文本框变化，显示清除按钮
    changInputSpy(){
        
        $("#loginIn input,#loginUp input").each(function() {
            let that = this;
            $.each(['keyup', 'change', 'input', 'focus', 'cut', 'paste','blur'], function(index, type) {
                if(type=='blur'){
                    that.addEventListener(type, function() {
                        $(that).siblings('.lyf-clear').addClass('lyf-hidden');
                    });
                }else{
                    (function(type) {
                        that.addEventListener(type, function() {
                            
                            if($(that).val().trim())
                                $(that).siblings('.lyf-clear').removeClass('lyf-hidden');
                            else
                                $(that).siblings('.lyf-clear').addClass('lyf-hidden');
                        });
                    })(type);
                }
            });    
        });
    },
    // 验证手机号码
    verifiyPhone(){
        var regMobile=$(".reg_mobile").val();
        if(regMobile == null || regMobile == ''){
        mui.toast('手机号码不能为空',{duration:'short',type:'div'});
        this.Mobile_Boolean = false;
        }else if ((/^1[34578]\d{9}$/).test(regMobile)){
            this.Mobile_Boolean = true;
        }else {
            mui.toast('请输入正确的手机号码',{duration:'short',type:'div'});
            this.Mobile_Boolean = false;
        }
    },
    //验证码校验
    testVerifyCode(){
        if(!this.Mobile_Boolean){
          this.verifiyPhone();
        }else{
          var verifycode = $(".lyf-input-code").val();
          
        }
    },
    // 验证找回密码 规则6-20
    verifiyPassword(){
        let that = this;
        var regPassword=$(".lyf-input-password").val();
            if(regPassword == null || regPassword == ''){
                mui.toast('密码不能为空',{duration:'short',type:'div'});
                that.password_Boolean = false;
                return false;
            }else if ((/^[a-z0-9_-]{6,20}$/).test(regPassword)){
                that.password_Boolean = true;
            }else {
                mui.toast('请输入6-20位密码',{duration:'short',type:'div'});
                that.password_Boolean = false;
                return false;
            }
    },
    getCheckout(username){
        let that = this;
        that.getCodeData = ''
        http({
            url: "http://" + serverIP + "/sendCode",
            data: username
        }).then(res => {
            mui.toast(res.msg);
            that.getCodeData = res.data
            that.sendMessageIsOk = false
        }).catch(err => {
            
        })
    },
    out_login() {
        if(mui.os.plus){
            if (mui.os.android) {
        
                //				plus.runtime.quit();//退出程序
                var curr = plus.webview.currentWebview();
                //获取所有已经打开的webview窗口
                var wvs = plus.webview.all();
                // console.log(wvs.length);
                for (var i = 0, len = wvs.length; i < len; i++) {
                    //关闭除当前页面外的其他页面
                    if (wvs[i].getURL() == curr.getURL())
                        //遇到当前页跳过
                        continue;
                    //非当前页执行关闭
                    plus.webview.close(wvs[i]);
                }
                //				console.log(JSON.stringify(curr));
                //打开login页面
                plus.webview.open('login.html');
                localStorage.clear();
                curr.close();
                //				console.log(JSON.stringify(curr));''
        
            } else if (mui.os.ios) {
                var curr = plus.webview.currentWebview();
                //获取所有已经打开的webview窗口
                var wvs = plus.webview.all();
                for (var i = 0, len = wvs.length; i < len; i++) {
                    //关闭除当前页面外的其他页面
                    if (wvs[i].getURL() == curr.getURL())
                        //遇到当前页跳过
                        continue;
                    //非当前页执行关闭
                    plus.webview.close(wvs[i]);
                }
        
                curr.close();
                localStorage.clear();
                //打开login页面
                plus.webview.open('login.html');
        
            }
        }else{
            localStorage.clear()
            this.gotoIndex('login')
        }    
    },
    dateFormatter(str) { //默认返回yyyy-MM-dd HH-mm-ss
        let hasTime = arguments[1] != false ? true : false; //可传第二个参数false，返回yyyy-MM-dd
        let d = new Date(str);
        let year = d.getFullYear();
        let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
        let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
        let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
        let minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
        if (hasTime) {
            return [year, month, day].join('-') + " " + [hour, minute].join(':');
        } else {
            return [year, month, day].join('-');
        }
    }
}