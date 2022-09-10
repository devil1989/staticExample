require('ant-design-vue/lib/drawer/style/index.css');
require('ant-design-vue/lib/form/style/index.css');
require('ant-design-vue/lib/notification/style/index.css');
require("./index.scss");
import Vue from "vue";
import {Drawer,Tag,Form,notification} from 'ant-design-vue';
import commonFunc from "pc/js/trans.js";
import Templates from "./index.html";
var template = Templates;

Vue.use(Drawer);
Vue.use(Form);
notification.config({
    duration:1
});
Vue.prototype.$notification=notification;

var { Cookies,Base64,BaseModel,Xss,pXss,util={} }=window.Util;
var {getEncryptData,getPersonalXssRule} = window.Util.util;
var {isTel,isUserName,isPassward}=window.Util.validate;
var {toast}=util;

let DisplayArticle = {

    data() {
        return {
            content:""
        }
    },

    mounted(){
    },

    computed:{
        articleDisplayForm(){
            return this.$store.getters.articleDisplayForm
        },
        userInfo(){
            return this.$store.getters.userInfo
        }
    },

    methods: {
        changComment(e){

        },


        //文章点赞
        triggerFav(e){
            if(!this.userInfo.isLogin){
                toast.bind(this)("请先登录");
            }else{
                var { Cookies,Base64,BaseModel,sXss }=window.Util;
                var uid=Cookies.get("u");//主动发起关注的那个人
                var isActive=this.articleDisplayForm.data.content.isFav;
                var articleId=this.articleDisplayForm.data.content.id;
                var isAdd=isActive?false:true;
                var isFav=false;
                var model=new BaseModel({
                    type:"post",
                    url:"/add_article_fav",
                    data:{articleId,uid,isAdd}
                });
                var that=this;
                model.promise.then(function(data) {
                    if(data.data&&data.state){
                        var {fav=[]}=data.data;
                        isFav=that.userInfo.isLogin&&fav.some(function(item) {
                            return item==Base64.decode(decodeURIComponent(uid||""));
                        });
                        that.$store.commit("setArticleDisplayFormContent",{isFav:isFav,favNum:fav.length});
                    }else{
                        toast.bind(that)(data.msg);
                    }
                },function(err) {
                    toast.bind(that)(err.msg);
                });
            }
                
        },

        //文章收藏
        triggerCollection(e){
            if(!this.userInfo.isLogin){
                toast.bind(this)("请先登录");
            }else{
                var { Cookies,Base64,BaseModel,sXss }=window.Util;
                var uid=Cookies.get("u");//主动发起关注的那个人
                var isActive=this.articleDisplayForm.data.content.isCollected;
                var articleId=this.articleDisplayForm.data.content.id;
                var isAdd=isActive?false:true;
                var isCollected=false;
                var model=new BaseModel({
                    type:"post",
                    url:"/add_article_collect",
                    data:{articleId,uid,isAdd}
                });
                var that=this;
                model.promise.then(function(data) {
                    if(data.data&&data.state){
                        var {collect=[]}=data.data;
                        isCollected=that.userInfo.isLogin&&collect.some(function(item) {
                            return item==Base64.decode(decodeURIComponent(uid||""));
                        });
                        that.$store.commit("setArticleDisplayFormContent",{isCollected:isCollected,collectNum:collect.length});
                    }else{
                        toast.bind(that)(data.msg);
                    }
                },function(err) {
                    toast.bind(that)(err.msg);
                });
            }
        },

        //是否已经被关注
        isAttentioned(authorId){

            if(this.userInfo&&this.userInfo.linkUser&&this.userInfo.linkUser.attention){
                var uid=Base64.decode(decodeURIComponent(Cookies.get("u")||""));//主动发起关注的那个人;
                return this.userInfo.linkUser.attention.some(function(item) {
                    return item==authorId
                });
            }
        },

        //添加个人关注或取消关注
        triggerAttention(e){
            var { Cookies,Base64,BaseModel,sXss }=window.Util;
            var authorId=e.currentTarget.getAttribute("data-key");//被关注的作者
            var uid=Cookies.get("u");//主动发起关注的那个人
            var isActive=this.isAttentioned(authorId)?true:false;//&&this.userInfo.linkUser&&this.userInfo.linkUser
            var isAdd=isActive?false:true;
            var tempId=Base64.decode(decodeURIComponent(Cookies.get("u")||"")).trim();
            if(tempId==(authorId?authorId.trim():"")){
                toast.bind(this)("你时刻关注着你自己,不需要再关注了");
                return;
            }

            var model=new BaseModel({
                type:"post",
                url:"/add_user_attention",
                data:{authorId,uid,isAdd}
            });
            var that=this;
            model.promise.then(function(data) {
                if(data.data&&data.state){
                    var {linkUser}=data.data;
                    that.$store.commit("updateUserInfo",{linkUser});
                    that.$store.commit("setArticleDisplayFormData",{
                        userInfo:Object.assign({},that.articleDisplayForm.data.userInfo,{isBeAttentioned:that.isAttentioned(authorId)})
                    });
                }else{
                    toast.bind(that)(data.msg);
                }
            },function(err) {

            });
        },

        //点赞:fav-is-active这个class从业务逻辑中判断,然后交互的时候再更具class去判断是否点赞还是取消
        // 这个依赖于dom,不太好,最好做成关注的那个逻辑,所有是否关注,都从js业务中获取逻辑,不依赖dom
        addFav(e){
            if(!this.userInfo.isLogin){
                toast.bind(this)("请先登录");
            }else{
                var classStr=(e.currentTarget&&e.currentTarget.getAttribute("class"))||"";
                var isActive=(classStr.indexOf("fav-is-active")!=-1)?true:false;//
                var that=this;
                var { Cookies,Base64,BaseModel,sXss }=window.Util;
                var cid=e.currentTarget.getAttribute("data-cid");
                var uid=Cookies.get("u");
                var isAdd=isActive?false:true;

                var model=new BaseModel({
                    type:"post",
                    url:"/add_comment_fav",
                    data:{cid,uid,isAdd}
                });

                model.promise.then(function(data) {
                    if(data.data&&data.state){
                        var {_id,fav}=data.data;
                        var tempId=Base64.decode(decodeURIComponent(Cookies.get("u")||""));
                        that.$store.commit("updateArticleDisplayCommentList",{_id:_id,fav:fav,uid:tempId});
                    }else{
                        toast.bind(that)("点赞失败");
                    }
                },function(err) {

                });
            }
        },

        validateContent(val=""){
            var status,helpInfo;
            //输出只有字符串，没有警告信息，我只能把警告信息挂在window.ErrorTags上
            if((!val)||val.trim()==""){
                status="error";
                helpInfo="评论内容不能为空";
            }else{
                var oldVal=val;
                val=pXss.process(val);
                if(window.ErrorTags&&window.ErrorTags.length){
                    status="error";
                    helpInfo=this.getWarnInfo(window.ErrorTags);
                    val=oldVal;
                }else{
                    this.sebmitComment(val);
                    return
                }
            }
            this.$store.commit("setArticleDisplayFormData",{comment:{val,status,helpInfo}});//属性不能少
        },


        /*
        @param：
            uid:谁写的评论
            content：评论内容，
            targetId ：针对哪跳信息【信息id】的回复
            category ：评论类型
                如果category是1类型，targetId就是自己个人的uid；【放自己说说列表】
                如果category是2类型，targetId就是aid，放到对应文章下面，targetId为文章id
                如果category是3类型，targedid就是其他人的uid【放对方留言板1级留言】
                如果category是4类型，targedid就是cid，放到其他评论的下面
                如果category是5类型，targedid就是chartId，放到对应图表下面

            //at相关人员功能暂时不做
            atList:{atId,atedId,atType：2表示文章的at，4表示评论的at}
                atId：主动at的人的id；atedId：被at的人的id
        */

        getParam(val){
            var targetUserId;
            var uid=Cookies.get("u");
            var content=val;

            /*初始化，或者点击回复的时候，都会自动同步对话框中的回复类型和id，
            如果是回复文章，回复类型就是2，id就是文章id
            如果是回复评论，回复类型就是4，id就是被回复的那条评论的id
            已经同步到this.articleDisplayForm.data.comment，直接获取即可；*/
            var category=this.articleDisplayForm.data.comment.replyType;//自己的回复类型【不是回复的那条信息的类型】
            var targetId=this.articleDisplayForm.data.comment.replyId;//回复那条评论的id
            
            //源头都一样
            var origin={category:"2",targetId:this.articleDisplayForm.data.content.id};//文章的type和他的id
            //targetUserId有逻辑区分
            if(category=="2"){//表示这条评论是文章1级评论，直接放在文章下，所以uid是写文章那人的id
                targetUserId=this.articleDisplayForm.data.userInfo.id;
            }

            //如果是回复其他评论，那么被回复的评论的那个人的id从comment中获取
            // 因为点击回复的时候，已经把被回复的那个人的个人信息同步到comment里面了
            else if(category=="4"){
                var temp=this.articleDisplayForm.data.comment.pInfo;
                targetUserId=temp?temp._id:"";
            }
            var par={uid,content,linkOrigin:origin,linkOther:{category,targetId,targetUserId}};
            return par;
        },  

        setReplay(e){
            var target=e.currentTarget;
            //ie8之前要用target.getAttribute("className")
            var isActive=target.getAttribute("class")&&(target.getAttribute("class").indexOf("aitive-reply")!=-1);
            var placeholder,replyId,replyType,isActiveReply;
            var commentInfo,pInfo;
            if(this.articleDisplayForm.data.comment.isActiveReply&&isActive){//点击回复来回切换
                isActiveReply=false;
                placeholder="请输入...";
                replyId=this.articleDisplayForm.data.content.id;
                replyType="2";
                pInfo={};
                this.$store.commit("setArticleDisplayFormCommentInput",{placeholder,replyId,replyType,isActiveReply,pInfo});
            }

            else{
                var val = target.getAttribute("data-cid");
                var commentList=this.articleDisplayForm.data.commentList||[];
                
                commentList.forEach(function (item) {
                    if(item.id==val){
                        commentInfo=item;
                        return;
                    };
                    if(item.childArr&&item.childArr.length){
                        item.childArr.forEach(function(subItem) {
                            if(subItem.id==val){
                                commentInfo=subItem;
                                return;
                            };
                        });
                    }
                    if(commentInfo){
                        return;
                    }
                })
                if(commentInfo){
                    pInfo=commentInfo?commentInfo.personInfo:{};//被回复的那个人的信息
                    placeholder=`回复@${pInfo.name||pInfo.phone}`;
                    replyId=commentInfo.id;
                    isActiveReply=true;
                    replyType="4";//点击回复，都是回复别人的评论

                    //设置这个replyId和replyType，是为了在点击提交的时候，统一从这里获取参数；
                    this.$store.commit("setArticleDisplayFormCommentInput",{placeholder,replyId,replyType,isActiveReply,pInfo});
                    document.querySelector(".article-display-wrapper .js_comment_info").focus();
                }
            }
        },


        sebmitComment(val){
            var param=this.getParam(val);
            var model=new BaseModel({
                type:"post",
                url:"/add_article_comment",
                data:param
            });
            var that=this;
            model.promise.then(function(data) {//返回当前文章的所有评论
                //data:{id,time,content,level,linkUser,linkOther,linkOrigin,personInfo}
                // linkOther|linkOrigin:{category,targetId}
                // personInfo:{name,userPic....}//user表的数据结构
                if(data&&data.data&&data.data.length){
                    that.renderComment(data.data,param);//刷新文章的评论
                }else{
                    toast.bind(that)(data.msg);
                }
            },function(err) {
                toast.bind(that)(err.msg);
            });
        },

        //刷新评论:该文章下所有的评论列表
        renderComment(arr,param){
            var commentList=commonFunc.transData(arr,param.linkOrigin.targetId,this.articleDisplayForm.data.userInfo.id,this.userInfo.isLogin);
            var commentObj=Object.assign({},this.articleDisplayForm.data.defaultComment,{replyId:this.articleDisplayForm.data.content.id})
            this.$store.commit("setArticleDisplayFormData",{commentList,comment:commentObj});
        },

        //用户使用错误标签提示
        getWarnInfo(errTags){
            var errInfo="";
            var errTags=[...new Set(errTags)];
            errTags.forEach(function(item){
                errInfo+=`<${item}>;`
            });
            window.ErrorTags=[];
            return `文章中不能包含${errInfo}这类html标签，请删除`;
        },

        submitComment(e){
            var val=document.querySelector(".js_comment_info").value;
            this.validateContent(val);
        },
        closeArticleDisplayForm(){
            if(this.$attrs.callback){
                this.$attrs.callback();
            }
            this.articleDisplayForm.visible=false;
        }
    },
    components:{
        
    },
    template:template
};
export default DisplayArticle