
/*
mutation是修改store内数据state的唯一方式，其他地方都不能修改，通过this.$store.commit('setName'，args)来调用
mutation必须是同步的，如果里面用到了异步操作然后执行state修改，就需要用action，
action里面还是调用store.commit然后到这里来执行*/

const mutations={//state是store封装的时候默认传入的，args是通过store.commit('setName'，args)传入的
	// setName (state,args){
	// 	state.person[args.idx].name=args["name"];
	// },
	// setPersonAge (state,args){
	// 	state.person[args.idx].age=args["age"];
	// },

	updateActiveKey(state,args){
		state.activeKey=Object.assign({},state.activeKey,args);
	},
	
	//个人中心信息展示相关
	updateUserInfo(state,args){
		state.userInfo=Object.assign({},state.userInfo,args);
	},

	//注册相关
	clearRegisterForm(state,args){
		state.registerForm.data=Object.assign({},state.registerForm.data,{
			phone:{
				val:"",
				status:"",
				helpInfo:""
			},
			passward:{
				val:"",
				status:"",
				helpInfo:""
			},
			nickname:{
				val:"",
				status:"",
				helpInfo:""
			},
			validatenum:{
				val:"",
				status:"",
				helpInfo:"",
				imgstr:"/ajax/captcha?456"
			}
		});
	},
	setRegisterFormPhone(state,args){
		state.registerForm.data.phone=Object.assign({},state.registerForm.data.phone,args);
	},
	setRegisterFormPassward(state,args){
		state.registerForm.data.passward=Object.assign({},state.registerForm.data.passward,args);
	},
	setRegisterFormNickname(state,args){
		state.registerForm.data.nickname=Object.assign({},state.registerForm.data.nickname,args);
	},
	setRegisterFormValidateNum(state,args){
		state.registerForm.data.validatenum=Object.assign({},state.registerForm.data.validatenum,args);
	},
	setRegisterFormSubmitState(state,args){
		state.registerForm.data.submitState=Object.assign({},state.registerForm.data.submitState,args);
	},
	

	//登录相关
	clearLoginForm(state,args){
		state.loginForm.data=Object.assign({},state.loginForm.data,{
			phone:{
				val:"",
				status:"",
				helpInfo:""
			},
			passward:{
				val:"",
				status:"",
				helpInfo:""
			}
		});
	},
	setLoginFormPhone(state,args){
		state.loginForm.data.phone=Object.assign({},state.loginForm.data.phone,args);
	},
	setLoginFormPassward(state,args){
		state.loginForm.data.passward=Object.assign({},state.loginForm.data.passward,args);
	},
	setLoginFormSubmitState(state,args){
		state.loginForm.data.submitState=Object.assign({},state.loginForm.data.submitState,args);
	},


	//文章创建相关
	setArticleFormTitle(state,args){
		state.articleForm.data.title=Object.assign({},state.articleForm.data.title,args);
	},
	setArticleFormContent(state,args){
		state.articleForm.data.content=Object.assign({},state.articleForm.data.content,args);
	},
	setArticleFormSubmitState(state,args){
		state.articleForm.data.submitState=Object.assign({},state.articleForm.data.submitState,args);
	},


	//搜索列表信息相关
	setSearchListInfo(state,args){
		state.searchInfoList=Object.assign({},state.searchInfoList,args);
	},

	updateSearchInfo(state,args){
		state.searchInfo=Object.assign({},state.searchInfo,args);
	},











	//个人文章列表相关
	setPersonalArticleInfo(state,args){
		state.personalArticle=Object.assign({},state.personalArticle,args);
	},


	//个人文章展示弹框相关
	setArticleDisplayForm(state,args){
		state.articleDisplayForm=Object.assign({},state.articleDisplayForm,args);
	},

	//个人文章展示弹框内部data数据
	setArticleDisplayFormData(state,args){
		state.articleDisplayForm.data=Object.assign({},state.articleDisplayForm.data,args);
	},

	//个人文章展示弹框内部,评论编辑区数据
	setArticleDisplayFormCommentInput(state,args){
		state.articleDisplayForm.data.comment=Object.assign({},state.articleDisplayForm.data.comment,args);
	},

	//个人文章展示弹框内部,文章展示信息内容【包括点赞，收藏，评论】
	setArticleDisplayFormContent(state,args){
		state.articleDisplayForm.data.content=Object.assign({},state.articleDisplayForm.data.content,args);
	},

	updateArticleDisplayCommentList(state,{_id,fav,uid}){
		var commentList=state.articleDisplayForm.data.commentList;
		var commentInfo,linkUser,innerLinkUser,isFavActive;

		//为了减少渲染dom，这里做了部分数据的修补，逻辑也是trans转化的时候的部分逻辑，但可能出bug
		commentList.forEach(function (item) {
            if(item.id==_id){
            	item.linkUser=Object.assign({},item.linkUser,{fav:fav,favNum:fav?fav.length:0});
            	linkUser=item.linkUser;
            	if(linkUser&&linkUser.fav&&linkUser.fav.length){
	                isFavActive=linkUser.fav.some(function(innerItem) {
	                    return innerItem==uid
	                })?true:false;
	            }

            	item.isFavActive=isFavActive;
            	isFavActive=false;
            	return
            };
            if(item.childArr&&item.childArr.length){
                item.childArr.forEach(function(subItem) {
                    if(subItem.id==_id){
                    	subItem.linkUser=Object.assign({},subItem.linkUser,{fav:fav,favNum:fav?fav.length:0});
                    	
                    	innerLinkUser=subItem.linkUser;
		            	if(innerLinkUser&&innerLinkUser.fav&&innerLinkUser.fav.length){
			                isFavActive=innerLinkUser.fav.some(function(innerItem) {
			                    return innerItem==uid
			                })?true:false;
			            }
                    	subItem.isFavActive=isFavActive;
                    	return
                    };
                });
            }
        })
	},

	
	//更新标签内容
	updateTags(state,args){
		state.articleForm.data.tag=Object.assign({},state.articleForm.data.tag,args);
	}
}

export {mutations}