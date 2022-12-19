//获取state里面的数据，getters用在computed里面
const getters={
	activeKey(state){
		return state.activeKey;
	},
	technology(state){
		return state.technology;
	},
	discussion(state){
		return state.discussion;
	},
	recovery(state){
		return state.recovery;
	},
	registerForm(state){
		return state.registerForm;
	},
	loginForm(state){
		return state.loginForm;
	},
	articleForm(state){
		return state.articleForm;
	},
	userInfo(state){
		return state.userInfo;
	},
	personalArticle(state){
		return state.personalArticle;
	},
	articleDisplayForm(state){
		return state.articleDisplayForm;
	},
	searchInfo(state){
		return state.searchInfo;
	},

	searchInfoList(state){
		return state.searchInfoList;
	}
	
	
}


export {getters}