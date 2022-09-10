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
var { Cookies,Base64,BaseModel,util }=window.Util;
var {getEncryptData,getPersonalXssRule} = window.Util.util;
var {isTel,isUserName,isPassward}=window.Util.validate;
var {toast}=util;


let Login = {

    data() {
        return {
            pageName:this.$attrs.pageName
            // registerFormElement:this.$form.createForm(this, { name: 'registerForm' })
        }
    },

    mounted(){
        var that=this;
        // //为了css书写方便，需要删除
        // setTimeout(function() {
        //     that.showArticleDisplayDrawer({target:document.querySelector(".list-item-wrapper>li .list-item-inner")})    
        // },1)
        
    },

    computed:{
        personalArticle(){
            return this.$store.getters.personalArticle
        },
        userInfo(){
            return this.$store.getters.userInfo
        },
        activeKey(){
            return this.$store.getters.activeKey
        }
        // ,
        // articleDisplayForm(){
        //     return this.$store.getters.articleDisplayForm
        // }
    },

    methods: {

        //展示文章内容弹框
        showArticleDisplayDrawer(e) {
            var uid=Cookies.get("u");
            var target=util.closest(e.target,"data-key-id");
            if(target){
                var id=target.getAttribute("data-key-id");
                var data=this.personalArticle.data||[];
                data.forEach(function(item) {
                    if(item.id==id){
                        item.showLoading=true;
                    }
                });
                this.$store.dispatch("getPersonalArticleInfo",{visible:true,isLoaded:true,id:id,uid:uid,callback:function() {
                    data.forEach(function(item) {
                        if(item.id==id){
                            item.showLoading=false;
                        }
                    });
                }});
            }
        },

        //取消收藏
        removeCollection(e){
            
            if(this.userInfo.isLogin&&this.userInfo.isSelf){
                var { Cookies,Base64,BaseModel,sXss }=window.Util;
                var uid=Cookies.get("u");
                var articleId=e.target.getAttribute("data-key");;
                var isAdd=false;
                var isCollected=false;
                var model=new BaseModel({
                    type:"post",
                    url:"/add_article_collect",
                    data:{articleId,uid,isAdd}
                });
                var that=this;
                model.promise.then(function(data) {
                    if(data.data&&data.state){
                        if(that.$attrs.callback){
                            toast.bind(that)(data.msg||"取消收藏成功");
                            that.$attrs.callback();
                        }
                    }else{
                        toast.bind(that)(data.msg);
                    }
                },function(err) {
                    toast.bind(that)(err.msg);
                });
            }
        }

    },
    template:template
};

export default Login