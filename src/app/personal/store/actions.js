/*action是用来处于异步操作的，里面还是用到到了commit，就是亿mutation的方式去操作state，
mutation是最终修改state的唯一的入口，在index.js中vuex封装store的时候，
就已经把actions的参数设置成了包含mutation的commit方法的对象，action中使用commit，就是等价于this.$store.commit
action在外面，是通过this.$store.dispatch("actionName",data)，来调用的actionName就是这里的setAge

其实，mutation完全可以合并到action里面，让action里面同时操作同步和异步数据多好，redux就是这么做的
*/

import commonFunc from "pc/js/trans.js";
import {state} from "./state.js";

var {articleDisplayForm}=state;//这个state只能拿初始化的数据,后续state变化是拿不到的

const actions={
	setPersonName:function({commit},data){
		
		//把setTimeout当作是一个ajax请求，在callback里面写commit("setName",data);就可以了
		setTimeout(function(){
			commit("setName",data);
		},300);
		

		// 用promise如何实现：其实promise就只是包了一个壳，把异步请求和回调函数拆开来而已，用起来像同步
		let ps=new Promise(function(resolve,reject){
			//把setTimeout当作是一个ajax请求,在callback里面写调用resolve或者reject即可
			setTimeout(function(){
				let status="success";
				(status=="success")?resolve(data):reject(data);
			},300)
		});
		ps.then(function(data){
			//success的逻辑
			commit("setName",data);
			return "success"
		},function(){
			//fail的逻辑
			return "fail reason"
		})

	},

	//通过data.id获取文章信息，然后展示弹框
	getPersonalArticleInfo:function({commit},data) {
		var {visible,isLoaded,id,uid,callback}=data;
		
		
		var {BaseModel,Base64,Cookies}=window.Util;
		//如果uid是文章的创建者，那么后端默认它对文章拥有所有权限：查看，评论等，后续还会增加其他功能
		var model= new BaseModel({//如果设置了uid，那才可以判断用户是否对这个id的文章有权限查看和访问
			url:"/article_info",
			type:"get",
			data:{id:[id],uid:uid}
		});
		var uInfo=this.getters.userInfo;

		model.promise.then(function(data) {
			commit("setArticleDisplayForm",{visible:visible,isLoaded:isLoaded});//先展示弹框，数据后加载
			if(data&&data.state&&data.data){
				//repliedUserInfo文章下面的每条评论中，评论被回复的那个人的个人信息
				// userAuthorInfo是这篇文章的作者的个人信息
				var {id,time,title,content,tag,linkUser,linkComment,category,level,personInfo,commentList}=data.data;
				var cmtList=commonFunc.transData(commentList,id,Base64.decode(decodeURIComponent(Cookies.get("u")||"")),uInfo.isLogin);
				var commentObj=Object.assign({},articleDisplayForm.data.defaultComment,{replyId:id});
				var userAuthorInfo=personInfo[0];//文章作者信息
				var isBeAttentioned
				var isFav=false;
				var isCollected=false;
				var articleFavNum=0,articleCollectNum=0;
				var curUid=Base64.decode(decodeURIComponent(Cookies.get("u")||""));//主动发起关注的那个人;

				userAuthorInfo.id=userAuthorInfo._id;

				if(uInfo&&uInfo.linkUser&&uInfo.linkUser.attention){
	                
	                isBeAttentioned = uInfo.linkUser.attention.some(function(item) {
	                    return item==userAuthorInfo.id
	                });
	            }
	            if(linkUser&&linkUser.fav&&linkUser.fav.length){
	            	isFav=uInfo.isLogin&&linkUser.fav.some(function(item) {
	            		return item==curUid
	            	})?true:false
	            	articleFavNum=linkUser.fav.length;
	            }

	            if(linkUser&&linkUser.collect&&linkUser.collect.length){
	            	isCollected=uInfo.isLogin&&linkUser.collect.some(function(item) {
	            		return item==curUid
	            	})?true:false
	            	articleCollectNum=linkUser.collect.length;
	            }

	            //点开文章的时候,判断这篇文章的作者是否以及被当前用户关注
	            userAuthorInfo.isBeAttentioned=isBeAttentioned?true:false;

				commit("setArticleDisplayFormData",{
					userInfo:userAuthorInfo,
					content:{//文章的信息
						 id:id,
						 time:new Date(time).format(),
						 title:title,
						 val:content,
						 isFav:isFav,
						 favNum:articleFavNum,
						 isCollected:isCollected,
						 collectNum:articleCollectNum

						 // extraInfo:extraInfo,//点赞收藏转发评论【评论人的id】
						// 	time:“”,
						// 	title:"标题A",
						// 	val:"内容范德萨范德萨范德萨发",
						// 	extraInfo:{fav:[],collect:[],relay:[],comment:[]}
					},
					comment:commentObj,
					commentList:cmtList
				});

				var tagModel= new BaseModel({//如果设置了uid，那才可以判断用户是否对这个id的文章有权限查看和访问
					url:"/article_tag_info",
					type:"get",
					data:{articleId:id}
				});
				return tagModel.promise;

			}else{
				alert(data.msg||"请求文章数据失败");
			}
		},function(err) {
			commit("setArticleDisplayFormData",{
				content:{
					id:null
				}
			});//id为null就是没找到对于文章
		}).then(function(data) {//请求标签数据的结果
			if(data.status&&data.data){
				var {tags=[]}=data.data;
				commit("setArticleDisplayFormData",{tags});
			}
			setTimeout(function() {
				if(callback){
					callback();
				}
			},1)
		},function(err) {
			alert(err.msg);
			setTimeout(function() {
				if(callback){
					callback();
				}
			},1)
		});

	}
};


export {actions}