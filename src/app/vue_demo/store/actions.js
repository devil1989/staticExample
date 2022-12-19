/*action是用来处于异步操作的，里面还是用到到了commit，就是亿mutation的方式去操作state，
mutation是最终修改state的唯一的入口，在index.js中vuex封装store的时候，
就已经把actions的参数设置成了包含mutation的commit方法的对象，action中使用commit，就是等价于this.$store.commit
action在外面，是通过this.$store.dispatch("actionName",data)，来调用的actionName就是这里的setAge

其实，mutation完全可以合并到action里面，让action里面同时操作同步和异步数据多好，redux就是这么做的
*/
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
				let state="success";
				(state=="success")?resolve(data):reject(data);
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



	}
};


export {actions}