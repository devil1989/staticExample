const state={//每次初始化state的时候,都用服务端输出的window.INIT_DATA来初始化,登录态也是这样判断,而不是localStorage
	activeKey:{val:"1"},//默认开启的tab页
	userInfo:Object.assign({
		showWriteAritle:false,//展示文章pop
		showUserPop:false,//展示用户信息pop
		isUserPopLoaded:false,//是否加载了右上角的用户信息组件
		userName:"",
		phone:"",
		userPic:"",
		linkUser:{},
		isLogin:false,
		default:{
			showWriteAritle:false,//展示文章pop
			showUserPop:false,//展示用户信息pop
			userName:"",
			phone:"",
			userPic:"",
			linkUser:{},
			isLogin:false
		}
	},JSON.parse(decodeURIComponent(window.INIT_DATA))),
	technology:{
		title:"热门技术贴排行榜",
		data:[{
			aid:"452181",//文章的id
			tags:"文章的标签",//文章的标签
			title:"文章1",//标题
			content:"文章内的内容",//内容
			avgStars:56,//平均评分
			stores:55,//点赞收藏数量
			comments:1500,//评论数量
			relay:12,//转发数量
			pv:120,//浏览量
			uv:10,//浏览用户数
			finishRate:"50%"//完整阅读占比
		},{
			aid:"452181",//文章的id
			tags:"文章的标签",//文章的标签
			title:"文章2",//标题
			content:"文章内的内容",//内容
			avgStars:56,//平均评分
			stores:55,//点赞收藏数量
			comments:1500,//评论数量
			relay:12,//转发数量
			pv:120,//浏览量
			uv:10,//浏览用户数
			finishRate:"50%"//完整阅读占比
		}]
	},
	discussion:{
		title:"热点讨论排行榜",
		data:[{
			aid:"452181",//文章的id
			tags:"文章的标签",//文章的标签
			title:"热点文章1",//标题
			content:"文章内的内容",//内容
			avgStars:56,//平均评分
			stores:55,//点赞收藏数量
			comments:1500,//评论数量
			relay:12,//转发数量
			pv:120,//浏览量
			uv:10,//浏览用户数
			finishRate:"50%"//完整阅读占比
		}]
	},
	recovery:{
		title:"热门复盘排行榜",
		data:[{
			aid:"452181",//文章的id
			tags:"文章的标签",//文章的标签
			title:"复盘文章1",//标题
			content:"文章内的内容",//内容
			avgStars:56,//平均评分
			stores:55,//点赞收藏数量
			comments:1500,//评论数量
			relay:12,//转发数量
			pv:120,//浏览量
			uv:10,//浏览用户数
			finishRate:"50%"//完整阅读占比
		}]
	},
	registerForm:{
		isLoaded:false,
		data:{
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
			},
			submitState:{
				disableBtn:false,
				submitText:"提交",
			}
		},
		visible: false
	},
	loginForm:{
		isLoaded:false,
		data:{
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
			submitState:{
				disableBtn:false,
				submitText:"登录",
			}
		},
		visible: false
	},
	articleForm:{
		isLoaded:false,
		visible:false,
		data:{
			title:{
				val:"",
				status:"",
				helpInfo:""
			},
			content:{
				val:"",
				status:"",
				helpInfo:""
			},
			submitState:{
				disableBtn:false,
				submitText:"登录",
			},
			tag:{
				curtentValue:"",
				tagList:[],
				inputVisible:false
			}
		},
			
		toolBar:{
			config:{},
			mode:"simple"//simple【只有一个对话框其他什么都没有】
		},
		editorContent:{
			config:{ placeholder: '请输入内容...' },
			mode:"default"
			// innerhtml:'<p>hello</p>'
		}
	},

	//个人文章列表
	personalArticle:{
		isLoaded:false,//组件是否已经加载
		loadedInfo:{
			loadingState:"loading",//loading表示加载中，loaded表示加载成功，fail表示失败
			content:""//提示文案
		},
		data:[
		// {
		//  id:""
		// 	time:“”,
		// 	title:"标题A",
		// 	content:"内容范德萨范德萨范德萨发",
		// 	extraInfo:{fav:[],collect:[],relay:[],comment:[]}
		// }
		]
	},

	//文章单独展示和评论展示
	articleDisplayForm:{//文章展示和评论弹框
		isLoaded:false,
		visible:false,
		data:{
			userInfo:{//文章作者的信息

			},
			content:{//文章的内容
				//  id:""
				// 	time:“”,
				// 	title:"标题A",
				// 	val:"内容范德萨范德萨范德萨发",
				//  isFav//是否被当前用户关注【 只有用户点开文章的时候，才会再action中动态添加】
				//  favNum//点赞数量
				// 	extraInfo:{fav:[],collect:[],relay:[],comment:[]}
			},
			comment:{//评论输入框和错误提示
				val:"",
				status:"",
				helpInfo:"",
				placeholder:"请评论...",//回复那个人的名称
				replyId:"",//回复那条评论|文章的id
				replyType:"2",//默认回复文章；2：表示回复文章；4表示回复别人的评论
				activeReplayId:"",
				pInfo:{}//被回复的那个人的信息，点击提交的时候，需要传给后台【这样后台不需要在去数据库获取信息了】
						// 如果是文章的回复，那么pInfo就是作者信息
						//目前文章作者信息为空对象，因为没用到，如果实在想获取作者信息
						//点击文章的时候级联user表获取信息
			},
			//comment重置的时候要用到
			defaultComment:{//评论输入框和错误提示
				val:"",
				status:"",
				helpInfo:"",
				placeholder:"请评论...",//回复那个人的名称
				replyId:"",//回复那条评论|文章的id
				replyType:"2",//默认回复文章；2：表示回复文章；4表示回复别人的评论
				activeReplayId:"",
				pInfo:{}//被回复的那个人的信息，点击提交的时候，需要传给后台【这样后台不需要在去数据库获取信息了】
						// 如果是文章的回复，那么pInfo就是作者信息
						//目前文章作者信息为空对象，因为没用到，如果实在想获取作者信息
						//点击文章的时候级联user表获取信息
			},
			submitState:{//评论提交按钮
				disableBtn:false,
				submitText:"提交",
			},
			commentList:[],
			tags:[]
			//commentList内部对象结构： {id,time,content,level,linkUser,linkOther,linkOrigin,personInfo,childArr}
			// childArr结构就是[ {id,time,content,level,linkUser,linkOther,linkOrigin,personInfo}]
			// childArr内部是当前一级回复下的所有回复【包括回复的回复，所有子孙】。
		}
	},

	searchInfo:{
		isSelectLoaded:false,
		inputInfo:{//查询详细:默认查询返回的内容，就是首页的推荐tab的内容
			type:"all",
			val:""
		},
		outputInfo:[]//返回的信息列表
	},

	//个人查询列表
	searchInfoList:{
		isLoaded:false,//组件是否已经加载
		loadedInfo:{
			loadingState:"loading",//loading表示加载中，loaded表示加载成功，fail表示失败
			content:"加载中..."//提示文案
		},
		data:{
			userList:[],
			articleList:[]
		}
	},
};

export {state};