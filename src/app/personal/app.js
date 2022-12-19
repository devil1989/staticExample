
// import {Toast} from "./components/toast/index.js";
// require('ant-design-vue/lib/list/style/index.css');
// require('ant-design-vue/lib/collapse/style/index.css');
// 犯了一个超级sb的错误，组件提示属性不存在，我居然蠢到在app.js这个容器里面找属性，组件的html用到的属性，自然是在组件的js里面定义的

/*
 个人中心页面的4中状态：url后面带id，就访问的是别人的个人中心，userInfo.isSelf为false[服务端已经处理了逻辑然后返回前端，服务端顺带处理isSelf的逻辑，所以前端不需要处理了]；userInfo.isLogin表示是否是登录状态
 1.未登录，且是自己的个人中心：
 2.未登录，且是别人的个人中心
 3.登录状态，且是自己的个人中心
 4.登陆状态，且是访问被人的个人中心
 */

/*
 登录态后页面之间的相互通信：因为某个用户a登录，然后点击返回，跳转到之前的页面，之前的页面因为没有登录，所以还是先是未登录状态：这个可以用浏览器缓存no-cache解决，但杀鸡用牛刀了
 最佳解决方案：每个页面的登录态保存到本地缓存，点击back的时候，如果当前登录态【未登录或一登陆】和页面的登录态不相同，就用js刷新页面【实现去缓存】
 */

import Vue from "vue";
import {Input,Button,Tabs} from 'ant-design-vue';
import {store} from "./store/index.js";

require('ant-design-vue/lib/input/style/index.css');
require('ant-design-vue/lib/button/style/index.css');
require('ant-design-vue/lib/tabs/style/index.css');
require('./app.scss');

import Templates from "./app.html";
var template=Templates;




function getPageOption(isFromBack) {
	var pageOpts={
		el:"#container",

		//特别注意，store里面的state数据不能直接引用在template里面，
		// 需要通过data，compoted，props等传递过去，然后state修改了，
		// 对应的data和其他属性都修改了，自然就重新render UI了
		data() {
			return {
			};
		},

		//在mounted之前，不加载任何js，只渲染页面整体架构，只用到了Input，Button，Tabs，Select这四个UI组件+vue+vuex
		// mounted的时候，加载所有页面都需要的util.js;
		// 然后过10s以后，预加载所有的ui组件,这样其他异步js都提前加载，假如10s内用户提前点击其他需要ui组件的功能，点击的时候也会自动触发对于的异步加载
		mounted(){//页面渲染完以后，预加载xss和富文本编辑框
			//预加载：所有模块会单独加载
			var that=this;
			var isLogin=(this.userInfo&&this.userInfo.isLogin)?true:false;
			var {errorData}=JSON.parse(decodeURIComponent(window.INIT_DATA));
			if(errorData){
				location.href="/recommend/error_page";
				return
			}


			if(isFromBack){
				this.$store.commit("updateUserInfo",JSON.parse(decodeURIComponent(window.INIT_DATA)));
			}
			
				// this.getLoginInitAsyncJs(function() {
				// 	that.$store.commit("updateUserInfo",{isUserPopLoaded:true});
				// 	that.switchTab("article");
				// });
			this.getInitAsyncJs(function() {
				that.switchTab("article");
				if(isLogin){
					that.$store.commit("updateUserInfo",{isUserPopLoaded:true})
				}
			});
				

			setTimeout(function() {
				that.getAsyncJs();
			},10000);
		},

		store:store,
		// data:function(){
		// 	return {}
		// },
		computed:{
			//getter只能拿1层，因为getter函数里面只有1层
			activeKey(){
				return this.$store.getters.activeKey
			},
			loginForm(){
				return this.$store.getters.loginForm
			},
			userInfo(){
				return this.$store.getters.userInfo
			},

			articleForm(){
	            return this.$store.getters.articleForm
	        },
	        personalArticle(){
	            return this.$store.getters.personalArticle
	        },
	        articleDisplayForm(){
	            return this.$store.getters.articleDisplayForm
	        },
	        fansList(){
	            return this.$store.getters.fansList
	        },
	        attentionList(){
	            return this.$store.getters.attentionList
	        },
	        personList(){
	            return this.$store.getters.personList
	        },
	        safeInfo(){
	            return this.$store.getters.safeInfo
	        },
		},
		methods:{


			/**异步加载js处理逻辑:异步加载之前，还可以在页面中做预加载**/
			getAsyncJs(callback){
				//如果里面的require是相同的，这个require.ensure不会再发请求；
				//里面所有的文件都单独打包

				require.ensure([],function(require){
					require('util.js'); 
					require('../../components/login');
					require('../../components/article-edit');
					require('../../components/article-list');
					require('../../components/article-display');
					require('./components/person-list');
					require('./components/user-info');
					require('./components/safe-info');
					
					
					if(callback){
						callback();
					}
				});
			},

			getInitAsyncJs(callback){
				//如果里面的require是相同的，这个require.ensure不会再发请求；
				//里面所有的文件都单独打包
				var that=this;
				require.ensure([],function(require){
					require('util.js'); 
					if(callback){
						callback();
					}
				});
			},

			getId(){//统一获取id的函数，因为个人中心的id，不一定是自己的id，也有可能是在访问别人的个人中心页面，所以得优先获取this.userInfo._id
				var { Cookies,Base64,BaseModel,sXss }=window.Util;
				return this.userInfo._id?(encodeURIComponent(Base64.encode(this.userInfo._id))):Cookies.get("u")
			},


			/*********************其他弹框的展示和隐藏以及tab切换 start*********************/
			switchTab(key,val){
				var { Cookies,Base64,BaseModel,sXss }=window.Util;
				var para={};
				var id=this.getId();
				this.$store.commit("updateActiveKey",{val:key});
				var that=this;
				Vue.nextTick(function() {
					if(key=="article"){//个人文章列表
						that.personalArticle.isLoaded=true;
						that.rendTab({
							type:"setPersonalArticleInfo",
							param:{
			                    type:"get",
			                    url:"/person_article_list",
			                    data:{id}
		                },success:null,transData:that.transArticleListData.bind(that)});
					}else if(key=="fav"){//收藏列表
						that.personalArticle.isLoaded=true;
						that.rendTab({type:"setPersonalArticleInfo",param:{
		                    type:"get",
		                    url:"/person_collection_list",
		                    data:{id}
		                },success:null,transData:that.transArticleListData.bind(that)});
					}else if(key=="fans"){//粉丝列表
						//ajax返回的数据结构 {_id,userName,name,phone,userPic,linkUser}
						that.personList.isLoaded=true;
						that.rendTab({type:"updatePersonList",param:{
		                    type:"get",
		                    url:"/person_fans_list",
		                    data:{id}
		                },success:null,transData:that.transFansListData.bind(that)});
					}else if(key=="attention"){//关注列表
						that.personList.isLoaded=true;
						that.rendTab({type:"updatePersonList",param:{
		                    type:"get",
		                    url:"/person_attention_list",
		                    data:{id}
		                },success:null,transData:that.transFansListData.bind(that)});
					}else if(key=="userInfo"){//个人信息修改
						that.userInfo.isLoaded=true;
						that.rendTab({type:"updateUserInfo",param:{
		                    type:"get",
		                    url:"/user_info",
		                    data:{id}
		                },success:function(data){
		                	var rstData=data.data;
		                	var isNotEmpty=rstData?true:false;
		                	var {_id,userName,name,phone,userPic,sex,age,linkUser,time}=(rstData||{});
		                	var loadedInfo={
								loadingState:isNotEmpty?"loaded":"empty",//loading表示加载中，loaded表示加载成功，fail表示失败,empty表示加载成功但没有数据
								content:data.msg||(isNotEmpty?"":"未查询到相关用户信息")//提示文案
							}
							var isLogin=true;
			            	var tempObj={_id,userName,name,sex,age,phone,userPic,linkUser,time, loadedInfo,isLogin}; 
			            	that.$store.commit("updateUserInfo",tempObj);
		                }});
					}else if(key=="safeInfo"){
						that.safeInfo.isLoaded=true;
						that.rendTab({type:"updateSafeInfo",param:{
		                    type:"get",
		                    url:"/user_info",
		                    data:{id}
		                },success:function(data){//数据还是用userInfo里面的数据，只是加载的状态用safeInfo而已
		                	var rstData=data.data;
		                	var isNotEmpty=rstData?true:false;
		                	var {_id,userName,name,phone,userPic,sex,age,linkUser,time}=(rstData||{});
		                	var loadedInfo={
								loadingState:isNotEmpty?"loaded":"empty",//loading表示加载中，loaded表示加载成功，fail表示失败,empty表示加载成功但没有数据
								content:data.msg||(isNotEmpty?"":"未查询到相关用户信息")//提示文案
							}
							var isLogin=true;
			            	var tempObj={_id,userName,name,sex,age,phone,userPic,linkUser,time, loadedInfo,isLogin}; 
			            	that.$store.commit("updateUserInfo",tempObj);
		                }});
					}
				});
			},

			resetInfo(opts={}){
	            var defaultInfo=this.userInfo.default;
	            var cloneObj=JSON.parse(JSON.stringify(defaultInfo));
	            cloneObj._id.val=this.userInfo._id;
	            cloneObj.userPic.previewUrl=this.userInfo.userPic;
	            cloneObj.time.val=this.userInfo.time;
	            cloneObj.name.val=this.userInfo.name;
	            cloneObj.userName.val=this.userInfo.userName;
	            cloneObj.phone.val=this.userInfo.phone;
	            cloneObj.age.val=this.userInfo.age;
	            cloneObj.sex.val=this.userInfo.sex;
	            this.$store.commit("updateUserInfo",{isEdit:false,data:cloneObj},opts);
	        },


			//渲染tab，传入param请求参数和success和fail的回调函数
			rendTab(opts){
				var tempObj,articleList=[];
				var { Cookies,Base64,BaseModel,sXss }=window.Util;
				var param={id:Cookies.get("u")};
				var that=this;
				var isLogin=this.userInfo.isLogin;
				var isSelf=this.userInfo.isSelf;
				if(!isLogin&&isSelf){
					that.$store.commit(opts.type,{
						loadedInfo:{
							loadingState:"empty",
							content:"请先登录"
						}
					});
					return
				}
				if(!isSelf&&opts.param&&opts.param.data){//查看别人的个人中心的文章或者其他数据，后台不需要鉴权；只有查看自己个人中心的时候，需要登录鉴权【自己登录界面查看到的东西很全，别人的个人中心，只能查看别人的部分信息】
					opts.param.data.isPassVerify=1;
				}
				var model=new BaseModel(opts.param);
	            model.promise.then(function(data) {
	            	var isNotEmpty=true;
	            	if(data.status&&data.data){

	            		if(opts.success){//有自定义的callback，就调用自定义的方法处理逻辑
		                	opts.success.bind(that)(data);
		                }else{
		            		articleList=opts.transData(data.data,sXss)
		                	isNotEmpty=(articleList&&articleList.length);
			            	
			            	var tempObj={
			                	data:articleList,
			                	loadedInfo:{
									loadingState:isNotEmpty?"loaded":"empty",//loading表示加载中，loaded表示加载成功，fail表示失败,empty表示加载成功但没有数据
									content:data.msg||(isNotEmpty?"":"未查询到相关信息或用户")//提示文案
								}
			                };
			                that.$store.commit(opts.type,tempObj);
		                }
		                
	            	}else{
	            		that.updateTabLoadState("fail",opts.type,data);
	            		if(opts.fail){
		            		opts.fail.bind(that)(err);
		            	}else{
		            		alert(err.msg);
		            	}
	            	}
	            },function(err) {
	            	
	            	if(opts.fail){
	            		that.$store.commit("setSearchListInfo",{
		                	data:{userList:[],articleList:[]},
		                	loadedInfo:{
								loadingState:"fail",//loading表示加载中，loaded表示加载成功，fail表示失败
								content:data.msg//提示文案
							}
		                });

	            		opts.fail.bind(that)(err);

	            	}else{
	            		alert(err.msg);
	            	}
	            });
			},


			showArticleDrawer() {
				var that=this;
				this.getAsyncJs(function(){
					that.articleForm.visible= true;
					that.articleForm.isLoaded=true;
				});
			},

			showLoginDrawer() {
				var that=this;
				this.getAsyncJs(function(){
					that.loginForm.visible= true;
					that.loginForm.isLoaded=true;
				});
	        },


			//小弹框 start
	        showWriteInfo(){
	            console.log("show");
	            clearTimeout(window.HoverState);
	            this.articleForm.showWriteAritle=true;
	        },
	        hideWriteInfo(){
	            console.log("hide")
	            var that=this;
	            window.HoverState=setTimeout(function() {
	                that.articleForm.showWriteAritle=false;
	            },300);
	        },
	        //小弹框 end
			

			goPersonalCenter(){
				location.href="/recommend/personal";
				// window.open("/recommend/personal","_blank").location;
			},

			goHome(){
				location.href="/";
			},
			/*********************其他弹框的展示和隐藏 end*********************/




			/***********************文章列表相关 start***********************/

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
				var isEmptySearch=true;
				localStorage[location.pathname+"/pal"]=JSON.stringify(data);
				data.forEach(function(item,idx) {
					var {id,_id,time,title,content,tag,linkUser,linkComment,categroy,level}=item;
					var {fav,collect,comment,relay}=linkUser;
					var simpleContent=sXss.process(content);//删除所有标签，只获取文案
					var needHide=false;
					if(filter){
						needHide = (simpleContent.indexOf(filter.content)==-1&&title.indexOf(filter.content)==-1)?true:false;
					}
					
					//空搜索，返回的是后台的推荐文章，要直接放行；tag中包含走索的关键字，也要直接放行；
					if(!needHide||item.isFromTag||isEmptySearch){
						arr.push({showLoading:false,isFromTag:item.isFromTag,tagContent:item.tagContent,id:id||_id,timeStamp:time,time:new Date(time).format(),title:title,content:simpleContent,needHide:needHide,extraInfo:{fav,collect,comment,relay}});			
					}
					
				});
				return arr.sort(function(prev,cur) {
					return cur.timeStamp-prev.timeStamp;
				});;
			},

			/*******************文章列表相关 end*******************/

			//“粉丝数据+关注列表数据”转化
			transFansListData(data=[],sXss){
				var arr=[];
				var { Cookies,Base64,BaseModel,sXss }=window.Util;
				data.forEach(function(item,idx) {
					var {_id,id,userName,name,phone,userPic,linkUser={},time}=item;
					var {fans}=linkUser;
					id=_id?encodeURIComponent(Base64.encode(_id)):_id;
					arr.push({time:new Date(time).format(),id:id,_id:_id,name:name||phone,userPic:userPic,fansNum:fans?fans.length:0});	
				});
				return arr;
			},

			//提交文章成功后的回调函数
			submitAritcleCallback(){
				this.switchTab("article");
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
	        	if(!this.userInfo.isSelf){
                    setTimeout(function() {
                        location.href="/recommend/personal";
                    },100)
                    return;
                }else{
                    this.closeLoginDrawer();
                    this.clearLoginForm();
                    this.renderPersonalInfo(data);
                    this.switchTab(this.activeKey?this.activeKey.val:"article");
                }
	        },

	        //重置个人信息和登陆状态【因为这个】
	        logoutCallback(data){
	        	setTimeout(function() {
	        		location.reload();
	        	},10)
	        },

	        //取消关注某人后的回调函数
	        removeAttentionCallback(data={},isRemoveFans){
	        	var {linkUser}=data.data||{};
	        	this.$store.commit("updateUserInfo",{linkUser});
	        	if(isRemoveFans){
	        		this.switchTab("fans");
	        	}else{
	        		this.switchTab("attention");
	        	}
	        },

	        //article-display组件中，关闭文章的时候，需要重新加载个人收藏列表
	        // article-list组件中，点击取消收藏文章后，也需要执行该函数，重新加载个人收藏
	        afterRemoveFavCallback(data){
	        	if(this.userInfo.isLogin&&this.userInfo.isSelf){
	        		this.switchTab(this.activeKey.val);
	        	}
	        }
			
		},

		//这里设置异步：是懒加载，要用到的时候在加载；在mounted中用require.ensure设置预加载
		//如果预加载完成，这里的懒加载就用不上了，直接走304缓存获取预加载的js模块
		//这样写异步组件，组件不会加载，同时在template里面给组件添加v-if，通过变量控制
		//当变量为true的时候，就自动加载异步组件的js；所有的异步组件都是通过组件里的v-if变量控制的
		//想控制两个异步组件同时加载，那么只要给他们配置同一个v-if变量即可
		//异步加载的组件内，里面import的文件，webpack都是单独打一个包，，颗粒度很细，方便多模块复用
		components:{
			"article-edit": () => import('../../components/article-edit'),
			"article-list": () => import('../../components/article-list'),
			"article-display": () => import('../../components/article-display'),
			"login": () => import('../../components/login'),
			"person-list": () => import('./components/person-list'),
			"user-info": () => import('./components/user-info'),
			"safe-info": () => import('./components/safe-info'),
			"user-pop": () => import('../../components/user-pop')//通用的右上角的个人登陆状态按钮组件
		},
		template:template
	};

	return pageOpts;
}

function initPage(isFromBack,callback) {
	//解决点击浏览器返回的时候，因为html缓存不重新请求，导致用户信息和登录态无法同步的问题
	if(isFromBack){
		require.ensure([],function(require){
			require('util.js'); 
			var { Cookies,Base64,BaseModel,sXss }=window.Util;
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
		});
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

