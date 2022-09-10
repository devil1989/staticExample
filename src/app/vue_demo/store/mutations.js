
/*
mutation是修改store内数据state的唯一方式，其他地方都不能修改，通过this.$store.commit('setName'，args)来调用
mutation必须是同步的，如果里面用到了异步操作然后执行state修改，就需要用action，
action里面还是调用store.commit然后到这里来执行*/

const mutations={//state是store封装的时候默认传入的，args是通过store.commit('setName'，args)传入的
	setName (state,args){
		state.person[args.idx].name=args["name"];
	},
	setPersonAge (state,args){
		state.person[args.idx].age=args["age"];
	}
	
}

export {mutations}