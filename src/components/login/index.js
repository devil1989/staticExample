import Vue from "vue";
import {Drawer,Form,notification} from 'ant-design-vue';
require('ant-design-vue/lib/drawer/style/index.css');
require('ant-design-vue/lib/form/style/index.css');
require('ant-design-vue/lib/notification/style/index.css');
import Templates from "./index.html";
var template = Templates;
require("./index.scss");

Vue.use(Drawer);
Vue.use(Form);
notification.config({
    duration:1
});
Vue.prototype.$notification=notification;

//组件公共对外的api直接可以在逐渐内定义，然后外面随时可以调用
//组件特殊生命周期内的回调函数，需要组件初始化的时候从外面传进来
var { Cookies,Base64,BaseModel,util={} }=window.Util;
var {toast}=util;
var {getEncryptData,getPersonalXssRule} = window.Util.util;
var {isTel,isUserName,isPassward}=window.Util.validate;

let Login = {

    data() {
        return {
            loginFormElement:this.$form.createForm(this, { name: 'loginForm' })
        }
    },

    computed:{
        loginForm(){
            return this.$store.getters.loginForm
        }
    },

    methods: {
        /*--------------------------------登录相关逻辑 start-----------------------------*/
        changeLoginPhoneNum(e){
            var errMsg="请输入正确的手机号";
            var emptyMsg="请输入手机号";
            var val=e.target.value;
            var status=isTel(val)?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status==""?"":errMsg);

            this.$store.commit("setLoginFormPhone",{val,status,helpInfo});
        },
        changeLoginPasswardNum(e){
            var errMsg="只支持英文字母和数字，不支持空格等其他特殊字符，长度必须小于17";
            var emptyMsg="请输入密码";
            var val=e.target.value;
            var status=isPassward(val)?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status==""?"":errMsg);

            this.$store.commit("setLoginFormPassward",{val,status,helpInfo});
        },

        //注册按钮提交开关
        switchLoginSubmitState(submitState){
            if(submitState=="submiting"){
                var disableBtn=true;
                var submitText="登录中...";
                this.$store.commit("setLoginFormSubmitState",{disableBtn,submitText});
            }else{
                var disableBtn=false;
                var submitText="登录";
                this.$store.commit("setLoginFormSubmitState",{disableBtn,submitText});
            }
        },

        submitLogin(e){
            this.$refs.submitbtn.$el.click();
        },

        login(e){
            var that=this;
            var phoneNum = this.loginForm.data.phone.val;
            var passward = this.loginForm.data.passward.val;

            if(isTel(phoneNum)&&isPassward(passward)){
                var encryptedData=getEncryptData({phoneNum});
                var model=new BaseModel({
                    type:"post",
                    url:"/dynomic_code",
                    data:encryptedData
                });

                this.switchLoginSubmitState("submiting");
                model.promise.then(function(data) {

                    if(data.state){
                        // Cookies.set("dynomicCode",data.timeStamp);
                        var timeStamp=data.data.timeStamp;
                        var encryptedData=getEncryptData({phoneNum,passward,timeStamp});
                        return new BaseModel({
                            type:"post",
                            url:"/login",
                            data:encryptedData
                        }).promise
                    }
                    else{
                        return {notGettedDynomicCode:true,msg:data.msg}
                    }
                    that.switchLoginSubmitState("submited");
                },function(err) {
                    return {notGettedDynomicCode:true,msg:err.msg}
                    that.switchLoginSubmitState("submited");
                }).then(function(data) {
                    //动态码没拿到
                    if(data.notGettedDynomicCode){
                        that.errorInfo(data);
                    }
                    else{//拿到动态码后是否登陆成功的逻辑
                        if(data.state){
                            // that.$notification.open({
                            //  message: '',
                            //  description:
                            // });
                            toast.bind(that)("登录成功",`欢迎："${data.data.userName||data.data.phone}" 用户`);
                            that.$attrs.callback(data);

                        }else{
                            that.errorInfo(data);
                        }
                    }
                    that.switchLoginSubmitState("submited");
                },function(err) {
                    that.errorInfo(err);
                    that.switchLoginSubmitState("submited");
                })
            }else{
                this.changeLoginPhoneNum({target:{value:this.loginForm.data.phone.val}});
                this.changeLoginPasswardNum({target:{value:this.loginForm.data.passward.val}});
            }
        },

        errorInfo(data){
            toast.bind(this)("登录失败",data.msg);
            // this.$notification.open({
            //  message: '',
            //  description:
            // });
        },
        closeLoginDrawer() {
            this.loginForm.visible = false;
        }

    },
    template:template
};

// Vue.component("v-toast", Toast);//组件名称自己注册

export default Login