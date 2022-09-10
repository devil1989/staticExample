const state={//每次初始化state的时候,都用服务端输出的window.INIT_DATA来初始化,登录态也是这样判断,而不是localStorage
	activeKey:{val:"article"},//默认开启的tab页

	//可以是自己的信息，也可以是别人页面的信息，看url后面是否带了？id=...;如果个人中心的url后面带有id，就是别人的页面；userInfo保存的是别人的用户信息
	userInfo:Object.assign({//既是用户个人中心的个人信息展示组件，同时也保存“首页的个人信息获取和登录态获取”
		loadedInfo:{
			loadingState:"loading",//loading表示加载中，loaded表示加载成功，fail表示失败
			content:""//提示文案
		},
		isLoaded:false,//userInfoForm表单是否已经加载
		isLogin:false,//是否登录
		isSelf:false,//是否是自己的页面
		isUserPopLoaded:false,
		showUserPop:false,
		
		//用户的个人数据
		_id:"",
		userPic:"",
		time:"",
		name:"",
		userName:"",
		phone:"",
		age:"",
		sex:"",
		linkUser:{},
		default:{//默认的数据,reset的时候要用
			_id:{
				val:"",
				status:"",
				helpInfo:""
			},
			userPic:{
				isChange:false,//个人图片是否修改
				val:"",//这个参数弃用，改用previewUrl这个key，因为这离有两个url，如果其中一个用val表示，容易混淆
				status:"",
				helpInfo:"",
				preview:false,
				previewUrl:"",//上传图片的url
				url:"",//弹框内需要裁剪的图片的原图，base64的url
				height:0,//原始图片的高
				width:0,//原始图片的宽
				startX:0,//开始拖拽的x坐标
				startY:0,//开始拖拽的y坐标
				endX:0,//拖拽结束的x坐标
				endY:0,//拖拽结束的y坐标
				cutHeight:0,//需要裁剪的预览图片的高；等于拖拽的Y轴上的长度
				cutWidth:0,//需要裁剪的预览图片的宽；等于拖拽的X轴上的长度
				isDrag:false,//是否处于拖拽状态
				displayCanvas:'block',
				offset:{}//需要被截取的图片的相对于body的offset位置，因为是不变的，所以mousedown的时候就保存下来，免得鼠标异动的时候需要重新计算
			},
			time:{
				val:"",
				status:"",
				helpInfo:""
			},
			name:{
				val:"",
				status:"",
				helpInfo:""
			},
			userName:{//就是nickname
				val:"",
				status:"",
				helpInfo:""
			},
			phone:{
				val:"",
				status:"",
				helpInfo:""
			},
			age:{
				val:"",
				status:"",
				helpInfo:""
			},
			sex:{
				val:"",
				status:"",
				helpInfo:""
			},
			submitBtn:{
				disableBtn:false,
				val:"提交",
			},
			editBtn:{
				disableBtn:false,
				val:"修改信息",
			},
			cancelBtn:{
				disableBtn:false,
				val:"取消",
			}
		},

		//用户编辑状态下的个人数据，默认打开的时候，是和上面的数据保持一致的，但是一旦数据开始编辑，就和上面的数据不一样了
		isEdit:false,//前提，isLogin&&isSelf==true 下才可以为true
		data:{
			_id:{
				val:"",
				status:"",
				helpInfo:""
			},
			userPic:{
				val:"",
				status:"",
				helpInfo:"",
				preview:false,
				previewUrl:"",//上传图片的url
				url:"",//弹框内需要裁剪的图片的原图，base64的url
				height:0,//原始图片的高
				width:0,//原始图片的宽
				startX:0,//开始拖拽的x坐标
				startY:0,//开始拖拽的y坐标
				endX:0,//拖拽结束的x坐标
				endY:0,//拖拽结束的y坐标
				cutHeight:0,//需要裁剪的预览图片的高；等于拖拽的Y轴上的长度
				cutWidth:0,//需要裁剪的预览图片的宽；等于拖拽的X轴上的长度
				isDrag:false,//是否处于拖拽状态
				displayCanvas:'block',
				offset:{}//需要被截取的图片的相对于body的offset位置，因为是不变的，所以mousedown的时候就保存下来，免得鼠标异动的时候需要重新计算
			},
			time:{
				val:"",
				status:"",
				helpInfo:""
			},
			name:{
				val:"",
				status:"",
				helpInfo:""
			},
			userName:{//就是nickname
				val:"",
				status:"",
				helpInfo:""
			},
			phone:{
				val:"",
				status:"",
				helpInfo:""
			},
			age:{
				val:"",
				status:"",
				helpInfo:""
			},
			sex:{
				val:"",
				status:"",
				helpInfo:""
			},
			submitBtn:{
				disableBtn:false,
				val:"提交",
			},
			editBtn:{
				disableBtn:false,
				val:"修改信息",
			},
			cancelBtn:{
				disableBtn:false,
				val:"取消",
			}
		}
		
	},JSON.parse(decodeURIComponent(window.INIT_DATA))),

	//设置的tab页，修改手机号，密码，退出登录等
	safeInfo:{
		isLoaded:false,//userInfoForm表单是否已经加载
		data:{
			oldPwd:{
				val:"",
				status:"",
				helpInfo:""
			},
			newPwd:{
				val:"",
				status:"",
				helpInfo:""
			}
		},
		loadedInfo:{
			loadingState:"loading",//loading表示加载中，loaded表示加载成功，fail表示失败
			content:"",//提示文案
		},
		changeResult:{//修改密码后的返回信息以及状态
			state:0,
			msg:""
		},
		default:{
			isLoaded:false,//userInfoForm表单是否已经加载
			data:{
				oldPwd:{
					val:"",
					status:"",
					helpInfo:""
				},
				newPwd:{
					val:"",
					status:"",
					helpInfo:""
				}
			},
			loadedInfo:{
				loadingState:"loading",//loading表示加载中，loaded表示加载成功，fail表示失败
				content:"",//提示文案
			},
			changeResult:{//修改密码后的返回信息以及状态
				state:0,
				msg:""
			}
		}
	},

	articleForm:{//文章编辑弹框
		isLoaded:false,
		visible:false,
		showWriteAritle:false,
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
		},
		default:{
			isLoaded:false,
			visible:false,
			showWriteAritle:false,
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
		}
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
		visible: false,
		default:{
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
		],
		default:{
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
		}
	},

	fansList:{
		isLoaded:false,//组件是否已经加载
		loadedInfo:{
			loadingState:"loading",//loading表示加载中，loaded表示加载成功，fail表示失败
			content:""//提示文案
		},
		data:[
		],
		default:{
			isLoaded:false,//组件是否已经加载
			loadedInfo:{
				loadingState:"loading",//loading表示加载中，loaded表示加载成功，fail表示失败
				content:""//提示文案
			},
			data:[
			]
		}
	},

	attentionList:{
		isLoaded:false,//组件是否已经加载
		loadedInfo:{
			loadingState:"loading",//loading表示加载中，loaded表示加载成功，fail表示失败
			content:""//提示文案
		},
		data:[
		],
		default:{
			isLoaded:false,//组件是否已经加载
			loadedInfo:{
				loadingState:"loading",//loading表示加载中，loaded表示加载成功，fail表示失败
				content:""//提示文案
			},
			data:[
			]
		}
	},

	//粉丝和关注人员的公共字段，这个用于渲染
	personList:{
		isLoaded:false,//组件是否已经加载
		loadedInfo:{
			loadingState:"loading",//loading表示加载中，loaded表示加载成功，fail表示失败
			content:""//提示文案
		},
		data:[
		],
		default:{
			isLoaded:false,//组件是否已经加载
			loadedInfo:{
				loadingState:"loading",//loading表示加载中，loaded表示加载成功，fail表示失败
				content:""//提示文案
			},
			data:[
			]
		}
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
		},
		default:{
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
		}
	}
};

export {state};