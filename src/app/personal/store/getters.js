//获取state里面的数据，getters用在computed里面
const getters={
	activeKey(state){
		return state.activeKey;
	},
	articleForm(state){
		return state.articleForm;
	},
	userInfo(state){
		return state.userInfo;
	},
	loginForm(state){
		return state.loginForm;
	},
	personalArticle(state){
		return state.personalArticle;
	},
	articleDisplayForm(state){
		return state.articleDisplayForm;
	},
	fansList(state){
		return state.fansList;
	},
	attentionList(state){
		return state.attentionList;
	},
	personList(state){
		return state.personList;
	},
	safeInfo(state){
		return state.safeInfo;
	}
	
}


export {getters}