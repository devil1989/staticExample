import Vue from "vue";
import {Drawer,Form,notification} from 'ant-design-vue';
import Templates from "./index.html";
var template = Templates;
require('ant-design-vue/lib/drawer/style/index.css');
require('ant-design-vue/lib/form/style/index.css');
require('ant-design-vue/lib/notification/style/index.css');

require("./index.scss");

Vue.use(Drawer);
Vue.use(Form);
notification.config({
    duration:1.5
});
Vue.prototype.$notification=notification;
// Vue.use(notification);

//组件公共对外的api直接可以在逐渐内定义，然后外面随时可以调用
//组件特殊生命周期内的回调函数，需要组件初始化的时候从外面传进来
var { Cookies,Base64,BaseModel,util={} }=window.Util;
var {toast}=util;
var {getEncryptData,getPersonalXssRule} = window.Util.util;
var {isTel,isUserName,isPassward}=window.Util.validate;

let Login = {

    data() {
        return {
            registerFormElement:this.$form.createForm(this, { name: 'registerForm' })
        }
    },

    computed:{
        registerForm(){
            return this.$store.getters.registerForm
        }
    },

    methods: {

        closeRegisterDrawer(){
            this.registerForm.visible = false;
        },


        changePhoneNum(e){
            var errMsg="请输入正确的手机号";
            var emptyMsg="请输入手机号";
            var val=e.target.value;
            var status=isTel(val)?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status==""?"":errMsg);

            this.$store.commit("setRegisterFormPhone",{val,status,helpInfo});
        },

        changePassward(e){
            var errMsg="只支持英文字母和数字，不支持空格等其他特殊字符，长度必须小于17";
            var emptyMsg="请输入密码";
            var val=e.target.value;
            var status=isPassward(val)?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status==""?"":errMsg);

            this.$store.commit("setRegisterFormPassward",{val,status,helpInfo});
        },

        changeNickName(e){
            var errMsg="只支持中英文和数字，不支持空格等其他特殊字符，长度必须小于17";
            var emptyMsg="";
            var val=e.target.value;
            var status=(isUserName(val)||val=="")?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status!=""?errMsg:"");

            this.$store.commit("setRegisterFormNickname",{val,status,helpInfo});
        },

        //输入验证码时候的智能提示错误信息，不是验证
        changeValdateNum(e){
            var errMsg="验证码错误，如果看不清请点击图片刷新验证码";
            var errIdx=[];
            var errNum=0;
            var emptyMsg="请输入验证码";
            var val=e.target.value+"";
            var valData=Base64.decode(Cookies.get("captcha")||"");
            var arr=[...valData],valArr=[...val];
            
            valArr.forEach(function(val,idx) {
                if(idx>=arr.length){
                    return
                }
                if(valArr[idx].toLowerCase()!=arr[idx].toLowerCase()){
                    errIdx.push(parseInt(idx)+1);
                    errNum++
                }
            })
            
            if(errNum){
                errMsg=`验证码第${[...errIdx]}个字母错误，看不清可点击图片刷新`;
            }

            var status=(valData&&val&&errNum==0)?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status==""?"":errMsg);

            this.$store.commit("setRegisterFormValidateNum",{val,status,helpInfo});
        },

        //验证码是否正确的最终验证
        finalValdateNum(e){
            var errMsg="验证码错误，看不清可点击图片刷新";
            var emptyMsg="请输入验证码";
            var val=e.target.value+"";
            var valData=Base64.decode(Cookies.get("captcha")||"");
            var status=(valData&&val&&val.trim().toLowerCase()==valData.toLowerCase())?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status==""?"":errMsg);

            this.$store.commit("setRegisterFormValidateNum",{val,status,helpInfo});
        },

        changeValdateImg(e){
            var that=this;
            if(!window.couldnotChangeImg){
                window.couldnotChangeImg=true;
                var imgstr=this.registerForm.data.validatenum.imgstr;
                imgstr=imgstr.replace(/\?\d{1,}/g,`?${+new Date()}`);
                this.$store.commit("setRegisterFormValidateNum",{imgstr});
            }else{
                if(!window.hasShowImageToast){
                    window.hasShowImageToast=true;
                    // that.$notification.open({
                    //  message: '',
                    //  description:'',
                    //  duration:2,
                    //  onClick: () => {
                    //  },
                    //  onClose:function() {
                    //      window.hasShowImageToast=false;
                    //  }
                    // });
                    toast.bind(this)("图片更新失败","您更换图片过快，请过2秒后再点击刷新，最多刷新50次！",function(){
                        //toast关闭的时候，执行的函数
                        window.hasShowImageToast=false;
                    })
                }
                clearTimeout(window.ImageSwitch);
            }
            window.ImageSwitch=setTimeout(function() {
                window.couldnotChangeImg=false;
            },2000)
        },


        /*表单提交的验证逻辑自己写吧，用antd-vue里面坑得要死，一堆问题；也别用v-model，
        逻辑一塌糊涂，没有文档，自己手动绑;校验和内容修改也自己写逻辑，它的文档能功能像屎一样
        完全没有业务的自由度，不要用他的v-decorator*/
        registerNewAccount(e) {
            var phoneNum = this.registerForm.data.phone.val;
            var passward = this.registerForm.data.passward.val;
            var nickName = this.registerForm.data.nickname.val;
            var captcha = this.registerForm.data.validatenum.val;//图片验证码【前端验证后，后端再验证，因为前端可以直接被绕过】
            var that=this;

            if(isTel(phoneNum)&&isPassward(passward)&&(nickName.trim()==""||isUserName(nickName))&&Base64.decode(Cookies.get("captcha")||"").toLowerCase()==this.registerForm.data.validatenum.val.toLowerCase()){
                
                //JSONP调用案例
                // var model=new BaseModel({
                //  dataType:"jsonp",
                //  type:"get",
                //  url:"/jsonp"
                // });

                var encryptedData=getEncryptData({phoneNum,passward,nickName,captcha});
                
                var model=new BaseModel({
                    type:"post",
                    url:"/reigst_user",
                    data:encryptedData
                });

                // {
                //  data:{
                //      data:{phone,userName},
                //      msg:"",//反馈信息
                //      state:1//1表示注册成功，0表示注册失败；网络正常，服务器没出错
                //      status:200//200表示请求成功；只关乎网络和服务器错误
                //  }
                // }

                this.switchSubmitState("submiting");
                model.promise.then(function(data) {
                    if(data.state){
                        // that.$notification.open({
                        //  message: '注册成功',
                        //  description:,
                        //  onClick: () => {
                        //  }
                        // });
                        toast.bind(that)("注册成功",'您的支持是我们最大的动力！');
                        that.clearRegisterForm();
                        that.closeRegisterDrawer();
                        that.renderPersonalInfo(data);
                    }else{
                        if(data.data.phone){
                            var status="error";
                            var helpInfo=data.data.phoneMsg;
                            that.$store.commit("setRegisterFormPhone",{status,helpInfo});
                        }
                        if(data.data.userName){
                            var status="error";
                            var helpInfo=data.data.userNameMsg;
                            that.$store.commit("setRegisterFormNickname",{status,helpInfo});
                        }
                    }
                    that.changeValdateImg();
                    that.switchSubmitState("submited");
                },function(data) {
                    toast.bind(that)(data.msg||"注册失败");
                    that.changeValdateImg();
                    that.switchSubmitState("submited");
                });
            }else{
                //模仿event，重新校验
                this.changePhoneNum({target:{value:this.registerForm.data.phone.val}});
                this.changePassward({target:{value:this.registerForm.data.passward.val}});
                this.changeNickName({target:{value:this.registerForm.data.nickname.val}});
                this.finalValdateNum({target:{value:this.registerForm.data.validatenum.val}});
            }
        },

        //注册按钮提交开关
        switchSubmitState(submitState){
            if(submitState=="submiting"){
                var disableBtn=true;
                var submitText="提交中...";
                this.$store.commit("setRegisterFormSubmitState",{disableBtn,submitText});
            }else{
                var disableBtn=false;
                var submitText="提交";
                this.$store.commit("setRegisterFormSubmitState",{disableBtn,submitText});
            }
        },

        clearRegisterForm(){
            this.$store.commit("clearRegisterForm");
        },

        
        renderPersonalInfo(data){
            var userInfo={...data.data};
            this.$store.commit("updateUserInfo",{isUserPopLoaded:true,isLogin:true,...userInfo});
        },

    },
    template:template
};

// Vue.component("v-toast", Toast);//组件名称自己注册

export default Login