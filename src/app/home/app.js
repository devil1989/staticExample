/*
页面数据流梳理：
    1.登录态，是html页面请求返回的时候自动带过来的，包括用户的个人信息等基础信息，这个数据通过html请求获取，页面的登录态展示，也是通过这个信息来的
    2.出了用户信息，其他的所有信息，都需要通过ajax重新获取，用来保证数据是最新的【这样就保证了不管是刷新，后退，还是其他页面操作，数据都是从服务端重新获取的，是最新数据，不存在缓存问题】；
    3.因为用户信息是html请求返回的，所以如果html是缓存数据，那么用户的数据也是缓存的【例如缓存策列不是no-cache的情况下，点击浏览器的back，返回的html页面就是之前的页面，用户信息和登录态也是之前的状态，这个就有问题】
      要解决这个问题，最简单的是设置no-cache缓存，但是对服务器压力太大，没有html缓存，所有的请求都要从服务器获取
                     还有一个方法就是，把html返回的数据，全部放到本地缓存，如果更新了，也更新本地缓存；同时所有页面的这些数据，都统一通过本地缓存获取，然后重新渲染，这样就做到了点击back时候的数据缓存问题
                     保障了html的返回数据都是最新的，但服务器缓存过期，本地没有过期，比如登录态，这个就非常难办。
                     推荐策列：
                            1.服务器返回html的时候，只返回登录态和用户id，其他数据，都通过ajax获取，这样，不管是back，还是其他，所有的数据，同时通过js这个源头来获取，保证没有缓存问题
                             也就是后端提供token和用户的uid，前端通过uid请求用户详细数据，后端根据token和uid来判断用户是否是登录状态，返回对应数据
                            2.因为只有html请求返回的页面有缓存问题，所以只要再history.back类似的方式返回其他页面的时候，在js中重新获取html返回的哪些数据，虽然html是缓存了数据
                              但是可以动过js，重新调用ajax，专门请求html缓存的那些数据；因为一般点击返回的场景下会出现html从缓存获取数据，所以只要用window.onpopstate来监听是否用浏览器的返回或history.back
                              如果是的话，就用js重新发送ajax来获取html的那部分缓存数据。
 */


// import {Toast} from "./components/toast/index.js";
// require('ant-design-vue/lib/list/style/index.css');
// require('ant-design-vue/lib/collapse/style/index.css');
import Vue from "vue";
import {Input,Button,Tabs} from 'ant-design-vue';
import {store} from "./store/index.js";
import {BaseModel} from 'ajaxbase.js';
import Cookies from 'js-cookie';

require('ant-design-vue/lib/input/style/index.css');
require('ant-design-vue/lib/button/style/index.css');
require('ant-design-vue/lib/tabs/style/index.css');
require('./app.scss');


import Templates from "./app.html";
var template=Templates;
// Vue.use(antd);//注册所有组件，不一个个注册了，麻烦得要死
//vue的基础包：550K【里面好400多K都是icon，关键是用任何一个插件，就会自动加载所有icon】；删除icon以后，基础包70k左右
// Vue.use(Input);
// Vue.use(Button);
// Vue.use(Tabs);
// Vue.use(Drawer);
// Vue.use(Form);
// Vue.use(List);
// Vue.use(Collapse);


function getPageOption(isFromBack) {
    
    var pageOpts={
        el:"#container",

        //特别注意，store里面的state数据不能直接引用在template里面，
        // 需要通过data，compoted，props等传递过去，然后state修改了，
        // 对应的data和其他属性都修改了，自然就重新render UI了
        data() {
            return {
                // activeKey:"1"//设置默认tab为7
            };
        },

        //在mounted之前，不加载任何js，只渲染页面整体架构，只用到了Input，Button，Tabs，Select这四个UI组件+vue+vuex
        // mounted的时候，加载所有页面都需要的util.js;
        // 然后过10s以后，预加载所有的ui组件,这样其他异步js都提前加载，假如10s内用户提前点击其他需要ui组件的功能，点击的时候也会自动触发对于的异步加载
        mounted(){//页面渲染完以后，预加载xss和富文本编辑框
            //预加载：所有模块会单独加载
            this.initPage(isFromBack||false);
        },

        store:store,
        // data:function(){
        //  return {}
        // },
        computed:{
            //getter只能拿1层，因为getter函数里面只有1层
            activeKey(){
                return this.$store.getters.activeKey
            },
            userInfo(){
                return this.$store.getters.userInfo
            },

            technology(){
                return this.$store.getters.technology
            },
            discussion(){
                return this.$store.getters.discussion
            },

            recovery(){
                return this.$store.getters.recovery
            },
            articleForm(){
                return this.$store.getters.articleForm
            },
            registerForm(){
                return this.$store.getters.registerForm
            },
            loginForm(){
                return this.$store.getters.loginForm
            },
            personalArticle(){
                return this.$store.getters.personalArticle
            },
            articleDisplayForm(){
                return this.$store.getters.articleDisplayForm
            },
            searchInfo(){
                return this.$store.getters.searchInfo
            },
            searchInfoList(){
                return this.$store.getters.searchInfoList
            }
            
        },
        methods:{

            //初始化页面
            initPage(needUpdateUserInfo){
                if(needUpdateUserInfo){
                    this.$store.commit("updateUserInfo",JSON.parse(decodeURIComponent(window.INIT_DATA)));
                }
                var that=this;
                var isLogin=this.userInfo.isLogin;
                this.getInitAsyncJs(function() {
                    that.switchTab("recommend");
                    that.$store.commit("updateSearchInfo",{
                        isSelectLoaded:true
                    });
                    if(isLogin){
                        that.$store.commit("updateUserInfo",{isUserPopLoaded:true})//
                    }
                });
                    

                setTimeout(function() {
                    that.getAsyncJs();  
                },10000);
            },


            /**异步加载js处理逻辑:异步加载之前，还可以在页面中做预加载**/
            getAsyncJs(callback){
                //如果里面的require是相同的，这个require.ensure不会再发请求；
                //里面所有的文件都单独打包
                require.ensure([],function(require){
                    // require('util.js'); 
                    require('../../components/login');
                    require('../../components/article-edit');
                    require('../../components/article-list');
                    require('../../components/article-display');
                    require('./components/regist');
                    // require('./components/search-list');//搜寻列表
                    
                    if(callback){
                        callback();
                    }
                });
            },

            getInitAsyncJs(callback){
                //如果里面的require是相同的，这个require.ensure不会再发请求；
                //里面所有的文件都单独打包
                require.ensure([],function(require){
                    var Select=require("ant-design-vue/lib/select/index.js");
                    require('ant-design-vue/lib/select/style/index.css');
                    require('util.js'); 
                    require('./components/search-list');//搜寻列表
                    Vue.use(Select.default);//这个做懒加载
                    if(callback){
                        callback();
                    }
                });
            },
            // getLoginInitAsyncJs(callback){
            //  require.ensure([],function(require){
            //      require('util.js'); 
            //      require('../../components/user-pop');//登录态下，需要右上角的用户信息和对应的pop
            //      require('./components/search-list');//搜寻列表
            //      if(callback){
            //          callback();
            //      }
            //  });
            // },


            /*********************其他弹框的展示和隐藏以及tab切换 start*********************/
            switchTab(key,val){
                if(key=="personalArticleList"){
                    this.$store.commit("updateActiveKey",{val:"personalArticleList"});
                    this.showPersonArticle();
                }else if(key=="search"){
                    // this.activeKey="6";这样写会报错，antd vue组件修改的时候，要求比较严格
                    this.onSearch();//执行当前搜索条件的搜索
                    var { Cookies}=window.Util;
                    var uid=Cookies.get("u");
                    if(this.articleDisplayForm.visible){//如果原来就已经展示文章弹框，那就需要更新里面内容
                        this.$store.dispatch("getPersonalArticleInfo",{visible:true,isLoaded:true,id:this.articleDisplayForm.data.content.id,uid:uid});
                    }
                }else if(key=="recommend"){//默认首页，内容位空，就展示推荐列表
                    this.$store.commit("updateActiveKey",{val:"recommend"});
                    this.rendTabList({type:"article",val:""});
                }else if(key=="recommendArticle"){//优质技术贴
                    this.$store.commit("updateActiveKey",{val:"recommendArticle"});
                    this.rendTabList({type:"article",val:"技术分享 战法 技术贴"});
                }
                //用不到了，因为只作为技术分享博客，不是金融相关的内容
                // else if(key=="recommendReview"){//优质复盘
                //  this.$store.commit("updateActiveKey",{val:"recommendReview"});
                //  this.rendTabList({type:"article",val:"复盘"});
                // }
            },

            //渲染首页，优质技术贴，优质复盘这三个tab
            rendTabList(opts){
                var { Cookies,Base64,BaseModel,sXss }=window.Util;
                var param={id:Cookies.get("u"),searchInfo:Object.assign({},opts)};
                var searchInfo=param.searchInfo;
                var that=this;
                var userList,articleList,tempCombine;
                that.searchInfoList.isLoaded=true;
                that.searchListLoading("loading");
                var model=new BaseModel({
                    type:"get",
                    url:"/search",
                    data:param
                });
                model.promise.then(function(data) {
                    var isNotEmpty=true;
                    var filterArray=(searchInfo.val||"").split(" ").filter(function(item="") {return item.trim()!=""});
                    // data格式：{time,title,content,tag,linkUser,linkComment,categroy,level}
                    if(data.state&&data.data){
                        tempCombine=that.tranWrapperData(data.data);
                        articleList=that.transArticleListData(tempCombine.article,sXss,{content:filterArray});
                        isNotEmpty=(articleList&&articleList.length);
                        
                        var tempObj={
                            isLoaded:true,
                            data:{articleList},
                            loadedInfo:{
                                loadingState:isNotEmpty?"loaded":"empty",//loading表示加载中，loaded表示加载成功，fail表示失败,empty表示加载成功但没有数据
                                content:isNotEmpty?"":"未查询到相关信息或用户"//提示文案
                            }
                        };
                        that.$store.commit("setSearchListInfo",tempObj);
                            
                    }else{
                        that.$store.commit("setSearchListInfo",{
                            isLoaded:true,
                            data:{userList:[],articleList:[]},
                            loadedInfo:{
                                loadingState:"fail",//loading表示加载中，loaded表示加载成功，fail表示失败
                                content:data.msg//提示文案
                            }
                        });
                    }
                    
                },function(data) {
                    that.articleListLoading("fail",data.msg);
                });
            },

            
            showLoginDrawer() {
                var that=this;
                this.getAsyncJs(function(){
                    that.loginForm.visible= true;
                    that.loginForm.isLoaded=true;
                });
            },

            showRegisterDrawer() {
                var that=this;
                this.getAsyncJs(function(){
                    that.registerForm.visible= true;
                    that.registerForm.isLoaded=true;
                });
            },

            showArticleDrawer() {
                var that=this;
                this.getAsyncJs(function(){
                    that.articleForm.visible= true;
                    that.articleForm.isLoaded=true;
                });
            },


            //小弹框 start
            showWriteInfo(){
                clearTimeout(window.HoverState);
                this.userInfo.showWriteAritle=true;
            },
            hideWriteInfo(){
                var that=this;
                window.HoverState=setTimeout(function() {
                    that.userInfo.showWriteAritle=false;
                },300);
            },
            //小弹框 end
            
            /*********************其他弹框的展示和隐藏 end*********************/




            /***********************搜索列表相关 start**********************/
            
            searchTypeChange(obj){
                this.$store.commit("updateSearchInfo",{
                    inputInfo:{
                        type:obj.key,
                        val:this.searchInfo.inputInfo.val
                    }
                });
                // this.searchInfo.inputInfo.type=obj.key;
            },
            onSearchChange(e){
                this.$store.commit("updateSearchInfo",{
                    inputInfo:{
                        type:this.searchInfo.inputInfo.type,
                        val:(e.target.value||"").trim()
                    }
                });
                // this.searchInfo.inputInfo.val=(e.target.value||"").trim();
            },

            //点击搜索按钮的逻辑
            // 搜索逻辑：
            //      1.默认推荐：输入空字符，展示推荐内容，不同type包含不同的推荐内容，
            //      2.type为all展示用户和文章；type为article就展示文章...
            //      3.输入查询内容中包含空格，就表示a||b||c，多个关联查询
            //      4.查询文章：看标签和title中是否包含，包含就返回；如果文章的热度超过一定值，那么还会查询这篇文章的内容是否包含搜索的value
            onSearch(val){
                this.$store.commit("updateActiveKey",{val:"search"});
                var searchInfo=this.searchInfo.inputInfo;
                var { Cookies,Base64,BaseModel,sXss }=window.Util;
                var param={id:Cookies.get("u"),searchInfo:searchInfo};
                var that=this;
                var userList,articleList,tempCombine;
                this.getAsyncJs(function(){
                    that.searchInfoList.isLoaded=true;
                    that.searchListLoading("loading");
                    var model=new BaseModel({
                        type:"get",
                        url:"/search",
                        data:param
                    });
                    model.promise.then(function(data) {
                        var isNotEmpty=true;
                        var filterArray=(searchInfo.val||"").split(" ").filter(function(item="") {return item.trim()!=""});
                        // data格式：{time,title,content,tag,linkUser,linkComment,categroy,level}
                        if(data.state&&data.data){
                            if(searchInfo.type=="all"){
                                tempCombine=that.tranWrapperData(data.data);
                                userList=that.transUserListData(tempCombine.user,sXss);
                                articleList=that.transArticleListData(tempCombine.article,sXss,{content:filterArray});
                            }else if(searchInfo.type=="article"){
                                tempCombine=that.tranWrapperData(data.data);
                                articleList=that.transArticleListData(tempCombine.article,sXss,{content:filterArray});
                                // articleList=articleList.filter(item => !item.needHide);
                            }else if(searchInfo.type=="user"){
                                userList=that.transUserListData(data.data.user,sXss);
                            }
                            isNotEmpty=(userList&&userList.length)||(articleList&&articleList.length);
                            
                            var tempObj={
                                isLoaded:true,
                                data:{userList,articleList},
                                loadedInfo:{
                                    loadingState:isNotEmpty?"loaded":"empty",//loading表示加载中，loaded表示加载成功，fail表示失败,empty表示加载成功但没有数据
                                    content:isNotEmpty?"":"未查询到相关信息或用户"//提示文案
                                }
                            };
                            that.$store.commit("setSearchListInfo",tempObj);
                                
                        }else{
                            that.$store.commit("setSearchListInfo",{
                                isLoaded:true,
                                data:{userList:[],articleList:[]},
                                loadedInfo:{
                                    loadingState:"fail",//loading表示加载中，loaded表示加载成功，fail表示失败
                                    content:data.msg//提示文案
                                }
                            });
                        }
                        
                    },function(data) {
                        that.articleListLoading("fail",data.msg);
                    });
                });
            },


            //管理“我的文章”列表的加载状态
            searchListLoading(str,msg){
                if(str=="loading"){//一个字母打错，store打成了stroe，找了半天
                    this.$store.commit("setSearchListInfo",{loadedInfo:{loadingState:"loading",content:"加载中..."}});
                    // this.$stroe.commit("setPersonalArticleInfo",{loadedInfo:{loadingState:"loading",content:"加载中..."}});
                }else if(str=="fail"){
                    this.$store.commit("setSearchListInfo",{loadedInfo:{loadingState:"fail",content:msg||"内容加载失败，请刷新页面重新加载"}});
                }
            },

            /*
            phone: 
            userName: 
            userPic: 
            _id: 
            */
            transUserListData(arr){//transId
                var { Cookies,Base64,BaseModel,sXss }=window.Util;
                arr.forEach(function(item) {
                    item.transId=encodeURIComponent(Base64.encode(item._id));
                });
                return arr;
            },


            /***********************搜索列表相关 end**********************/



            /***********************文章列表相关 start***********************/
            showPersonArticle(){
                var that=this;
                this.getAsyncJs(function(){
                    that.personalArticle.isLoaded=true;
                    that.articleListLoading("loading");
                    var { Cookies,Base64,BaseModel,sXss }=window.Util;
                    var param={id:Cookies.get("u")};
                    var model=new BaseModel({
                        type:"get",
                        url:"/person_article_list",
                        data:param
                    });
                    model.promise.then(function(data) {
                        // data格式：{time,title,content,tag,linkUser,linkComment,categroy,level}
                        if(data.state){
                            var rstData=that.transArticleListData(data.data,sXss);
                            that.$store.commit("setPersonalArticleInfo",{
                                data:rstData,
                                loadedInfo:{
                                    loadingState:rstData.length?"loaded":"empty",//loading表示加载中，loaded表示加载成功，fail表示失败
                                    content:rstData.length?"":"您还没发表过帖子"//提示文案
                                }
                            });
                        }else{
                            that.articleListLoading("fail",data.msg);
                        }
                        
                    },function(data) {
                        that.articleListLoading("fail",data.msg);
                    });
                    
                });
            },

            //个人文章列表数据获得以后，转化数据
            /*desc
                @data:文章数据列表
                @sXss:过滤文章内部html的函数
                @filter:文章筛选项：内容中包含filter.content或title中包含filter.content，才呈现出来；
                                   做这个筛选，是因为文章的content中包含html标签；
                                   如果搜索的时候搜索的是html标签相关的英文，比如说搜索p
                                   因为几乎所有的文章content都有p标签
                                   这样会导致所有热门文章都会被反馈出来，这个是明显的搜索错误，
                                   要修复的话，就需要在数据库中保存一份不包含html标签的文章内容，
                                   这样太耗费内存了，而且这种搜索也是偶发，前端过滤就好了*/


            transArticleListData(data,sXss,filter){
                var arr=[];
                var isEmptySearch=(this.searchInfo.inputInfo.val=="")?true:false;
                localStorage[location.pathname+"/pal"]=JSON.stringify(data);
                data.forEach(function(item,idx) {
                    var {id,_id,time,title,content,tag,linkUser,linkComment,categroy,level}=item;
                    var {fav,collect,comment,relay}=linkUser;
                    var simpleContent=sXss.process(content);//删除所有标签，只获取文案
                    var needHide=false;
                    if(filter&&filter.content&&filter.content.length){
                        needHide = !(filter.content||[]).some(function(subItem) {
                            return (simpleContent.indexOf(subItem)!=-1||title.indexOf(subItem)!=-1);
                        });
                    }
                    
                    //空搜索，返回的是后台的推荐文章，要直接放行；tag中包含走索的关键字，也要直接放行；
                    if(!needHide||item.isFromTag||isEmptySearch){
                        arr.push({timeStamp:time,showLoading:false,isFromTag:item.isFromTag,tagContent:item.tagContent,id:id||_id,time:new Date(time).format(),title:title,content:simpleContent,needHide:needHide,extraInfo:{fav,collect,comment,relay}});         
                    }
                    
                });
                return arr.sort(function(prev,cur) {
                    return cur.timeStamp-prev.timeStamp;
                });
            },

            //backData:{user:[],article:[],articleInTags:[{content,linkUser,articleInfo:[和article的array一样]}]};
            //主要是把articleInTags中的articleInfo这个数组合并到article数组中去，；
            // 就是把标签中含有搜索词的文章合并到“文章或标题”中含有搜索词的文章
            tranWrapperData({user=[],article=[],articleInTags=[]}){
                var innerArticleList=[];
                articleInTags.forEach(function(item) {
                    innerArticleList=item.articleInfo?innerArticleList.concat(item.articleInfo):innerArticleList;
                });
                innerArticleList.forEach(function(item) {
                    //打这个标记，为了在transArticleListData函数中，不被误删，就算title和内容中都没有，也不能删，因为标签中有
                    item.isFromTag=true;
                    item.tagContent=articleInTags[0].content;//数组articleInTags其实之有一个标签项
                });
                innerArticleList=innerArticleList.concat(article);
                var {util}=window.Util;
                var {unique}=util;
                article=unique(innerArticleList,"_id");
                return {article,user}
            },


            //管理“我的文章”列表的加载状态
            articleListLoading(str,msg){
                if(str=="loading"){//一个字母打错，store打成了stroe，找了半天
                    this.$store.commit("setPersonalArticleInfo",{loadedInfo:{loadingState:"loading",content:"加载中..."}});
                    // this.$stroe.commit("setPersonalArticleInfo",{loadedInfo:{loadingState:"loading",content:"加载中..."}});
                }else if(str=="fail"){
                    this.$store.commit("setPersonalArticleInfo",{loadedInfo:{loadingState:"fail",content:msg||"内容加载失败，请刷新页面重新加载"}});
                }
            },

            /*******************文章列表相关 end*******************/


            //提交文章成功后的回调函数
            submitAritcleCallback(){
                this.switchTab("personalArticleList");
            },


            //登录后的回调函数中包含的逻辑
            clearLoginForm(){
                this.$store.commit("clearLoginForm");
            },  

            closeLoginDrawer() {
                this.loginForm.visible = false;
            },

            renderPersonalInfo(data){
                var userInfo={...data.data};
                this.$store.commit("updateUserInfo",{isUserPopLoaded:true,isLogin:true,...userInfo});
            },

            loginSuccessCallback(data){
                this.closeLoginDrawer();
                this.clearLoginForm();
                this.renderPersonalInfo(data);
                this.switchTab(this.activeKey?this.activeKey.val:"personalArticleList");
            },

            //重置个人信息+页面
            logoutCallback(data){
                // var defaultUser=JSON.parse(JSON.stringify(this.userInfo.default||{}));
                // this.$store.commit("updateUserInfo",defaultUser);
                setTimeout(function() {
                    location.reload();
                },10);
            }

        },

        //这里设置异步：是懒加载，要用到的时候在加载；在mounted中用require.ensure设置预加载
        //如果预加载完成，这里的懒加载就用不上了，直接走304缓存获取预加载的js模块
        //这样写异步组件，组件不会加载，同时在template里面给组件添加v-if，通过变量控制
        //当变量为true的时候，就自动加载异步组件的js；所有的异步组件都是通过组件里的v-if变量控制的
        //想控制两个异步组件同时加载，那么只要给他们配置同一个v-if变量即可
        //异步加载的组件内，里面import的文件，webpack都是单独打一个包，，颗粒度很细，方便多模块复用
        components:{
            "login": () => import('../../components/login'),
            "regist": () => import('./components/regist'),
            "article-edit": () => import('../../components/article-edit'),
            "article-list": () => import('../../components/article-list'),
            "article-display": () => import('../../components/article-display'),
            "search-list": () => import('./components/search-list'),
            "user-pop": () => import('../../components/user-pop')//通用的右上角的个人登陆状态按钮组件
        },
        template:template
    };

    return pageOpts;
}

function initPage(isFromBack,callback) {
    //解决点击浏览器返回的时候，因为html缓存不重新请求，导致用户信息和登录态无法同步的问题
    if(isFromBack){
        if(Cookies.get("u")||""){
            var model=new BaseModel({
                url:'/user_info',
                type:"get",
                data:{id:Cookies.get("u")}
            });
            model.promise.then(function(data) {
                //因为点击back返回，因为缓存策略不是no-cache,所以html页面数据走缓存，用户的个人信息数据又是从html请求返回的，
                // 所以点击back的时候，就无法同步用户的个人信息，需要ajax重新请求个人请求，然后把信息保存到window.INIT_DATA
                // 因为html也是把返回的个人信息保存到了window.INIT_DATA，保持逻辑的一致，这样，接下来的初始话逻辑，都相同
                var rstData=data?(data.data||{}):{};
                var {_id,userName,name,phone,userPic,sex,age,linkUser,time,isLogin}=rstData;
                var dataStr=(encodeURIComponent(JSON.stringify({_id,userName,name,phone,userPic,sex,age,linkUser,time,isLogin})));
                window.INIT_DATA=(data&&data.data)?dataStr:window.INIT_DATA;
                callback();
            },function(err) {
                callback();
            });
        }else{
            callback();
        }
    }else{
        callback();
    }
}

(function (){
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Tabs);
    var isFromBack=(window.performance.navigation.type==2)?true:false;
    initPage(isFromBack,function() {
        new Vue(getPageOption(isFromBack));
    })
})();


//从缓存进来是不会触发这个事件的
// window.performance:ie9+android4.0
// window.performance.navigation.type:用户通过后退按钮访问本页面下，type值为2




// var obj=Object.assign({},{age:30});
// Object.defineProperties({
//  age:{}
// })
// mapState, mapMutations, mapGetters, mapActions这几个方法只是减少代码
// 个人不太喜欢用，反正和主流程无关

//从根元素上传入store，里面所有的组件都可以通过this.$store来访问


