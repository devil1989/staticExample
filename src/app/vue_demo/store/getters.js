//获取state里面的数据，getters用在computed里面
const getters={
	personLength(state){
		return state.person.filter(function(p){
			return p.sex=="male"
		}).length;
	},
	persons(state){
		return state.person
	}
}


export {getters}