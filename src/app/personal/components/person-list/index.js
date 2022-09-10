/*
 粉丝和关注列表都用这个组件
 */

import Vue from "vue";
import {notification} from 'ant-design-vue';
require("./index.scss");
require('ant-design-vue/lib/notification/style/index.css');

notification.config({
    duration:2
});
Vue.prototype.$notification=notification;
var { util={}}=window.Util;
var {toast}=util;
import Templates from "./index.html";
var template=Templates;


let fansList = {

    data() {
        return {
        }
    },

    mounted(){
    },

    computed:{
        personList(){
            return this.$store.getters.personList
        },
        userInfo(){
            return this.$store.getters.userInfo
        },
        activeKey(){
            return this.$store.getters.activeKey
        }
    },

    methods: {
        removeAttention(e){
            var { Cookies,Base64,BaseModel,sXss }=window.Util;
            var authorId=e.currentTarget.getAttribute("data-key");//被关注的作者
            var authorName=e.currentTarget.getAttribute("data-name");//被取关人的名字
            var uid=Cookies.get("u");//主动发起关注的那个人
            var isActive=true;
            var isAdd=false;
            var tempId;
            if(this.activeKey.val=="fans"){//移除粉丝
                tempId=uid?Base64.decode(decodeURIComponent(uid)).trim():null;
                uid=authorId?encodeURIComponent(Base64.encode(authorId)):null;
                authorId=tempId;
            }
            
            var model=new BaseModel({
                type:"post",
                url:"/add_user_attention",
                data:{authorId,uid,isAdd}
            });
            var that=this;
            model.promise.then(function(data) {
                if(data.data&&data.state){
                    if(that.activeKey.val=="fans"){
                        toast.bind(that)("已经移除了名为"+authorName+"的粉丝");
                        that.$attrs.callback(data,true);
                    }else{
                        toast.bind(that)("您已取消了对"+authorName+"的关注");
                        that.$attrs.callback(data);
                    }
                        
                }else{
                    toast.bind(that)(data.msg);
                }
            },function(err) {
                toast.bind(that)(data.msg);
            });
        }
    },
    template:template
};

export default fansList