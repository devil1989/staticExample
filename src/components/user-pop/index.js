require('ant-design-vue/lib/notification/style/index.css');
require("./index.scss");

import Vue from "vue";
import {notification} from 'ant-design-vue';
import Templates from "./index.html";
var template = Templates;

notification.config({
    duration:2.5
});

Vue.prototype.$notification=notification;
var { Cookies,Base64,BaseModel,Xss,util={}}=window.Util;
var {toast}=util;



let UserPop = {

    data() {
        return {
        }
    },

    mounted(){
    },

    computed:{
        userInfo(){
            return this.$store.getters.userInfo
        }
    },

    methods: {
        logout(){
            var that=this;
            var { Cookies,BaseModel }=window.Util;
            var model=new BaseModel({
                type:"get",
                url:"/logout",
                data:{
                    id:Cookies.get("u")
                }
            });
            Cookies.remove("u");
            model.promise.then(function(data) {//ajax清除后端登录态，前端重置本地用户信息
                if(data.state){
                    toast.bind(that)("退出登录","您的帐号已退出登录！");
                    that.$attrs.callback(data);
                }else{
                    toast.bind(that)(data.msg||"退出登录失败");
                }
            },function(err) {
                toast.bind(that)(err.msg||"退出登录失败");
            })
        },
        showUserInfoPop(){
            clearTimeout(window.userHoverState);
            this.userInfo.showUserPop=true;
        },
        hideUserInfoPop(){
            var that=this;
            window.userHoverState=setTimeout(function() {
                that.userInfo.showUserPop=false;
            },300);
        },
        goPersonalCenter(){
            location.href="/recommend/personal";
            // window.open("/recommend/personal","_blank").location;
        }
    },
    template:template
};
export default UserPop