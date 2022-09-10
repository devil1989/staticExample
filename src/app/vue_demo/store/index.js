//其实所有页面，用到的这个文件都是一样的，只要拷贝即可

import Vue from "vue";
import Vuex from "vuex";


//如果业务逻辑不是很复杂，就把state，getters，actions，mutations全部展开放在store.js里面，文件切换来切换去也很麻烦
import {state} from "./state.js";//统一管理的状态,只是一个对象
import {getters} from "./getters.js";//获取数据并渲染
import {actions} from "./actions.js";//异步操作处理数据【用到ajax或其他】，用this.$store.dispache("actionname",data);其实action里面还是用mutations去修改state的状态
import {mutations} from "./mutations.js";//同步处理数据的唯一改变，只能在这里修改store内的数据，this.$store.commit方法触发mutations改变state
Vue.use(Vuex);

/*用vuex封装store，这个行为只是给store制定了一套操作流程；经过封装的store，
就可以通过这个操作流程来操作store，接下来就是如何把store传入组件或者vue实例了
通常情况下，可以给每个实例都传入store，但是每次都传很麻烦，就从根元素上传入store，见app.js
把这个store注入到根元素，那么：
		1.this.$store就能获取到这个封装的store
		2.this.$store.getters就获取到这里的getters
			这个getters里面放统一要获取的store数据，数据统一从getters里面获取
			不然的话东一个西一个属性获取： this.$store.属性.属性.属性[甚至还可以使用函数来筛选]，
			数据获取的业务逻辑都散落在外面，找起来麻烦，直接把数据获取的逻辑全部放到getters里面，便于维护

这个封装行为，给getters,actions,mutations等属性在里面的方法调用的时候，都自动传入了state作为参数
*/
var store=new Vuex.Store({
	state,
	getters,
	actions,
	mutations
});

export {store};


// 如何模块化：
// 	1.把不同的模块的4个元素全部引用进来
// 	2.vuex其实会自动把所有的state，getters等全部综合起来，对各个元素的调用方法还是用原来的方法
// 	  但是如何区分不同模块,其实如果各个模块的各自的元素名称都不相同，那就没问题了，会自动根据名称调用
// 	  但如果不同模块getter如果相同，就会报错；
// 	  如果不同模块的action相同，那么dispatch的时候，会依次调用所有模块的对应action函数
// 	  如果不同模块的mutation相同，那么commit的时候，会依次调用所有模块对应的mutation函数

// var store = new Vuex.store({
// 	modules: {
// 		"moduleA": {
// 			state,
// 			getters,
// 			actions,
// 			mutations
// 		},
// 		"moduleB": {
// 			state,
// 			getters,
// 			actions,
// 			mutations
// 		},
// 	}
// });