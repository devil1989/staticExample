// import Vue from "vue";
// import * as antd from "ant-design-vue";
// import {store} from "./store/index.js";
// import {Toast} from "./components/toast/index.js";
// require('./app.scss');

// let template=require("./app.html");


// // mapState, mapMutations, mapGetters, mapActions这几个方法只是减少代码
// // 个人不太喜欢用，反正和主流程无关

// //从根元素上传入store，里面所有的组件都可以通过this.$store来访问
// let page=new Vue({
// 	el:"#container",

// 	//特别注意，store里面的state数据不能直接引用在template里面，
// 	// 需要通过data，compoted，props等传递过去，然后state修改了，
// 	// 对应的data和其他属性都修改了，自然就重新render UI了
// 	// data:{
// 	// 	componentData:this.$store.getters.components
// 	// },
// 	store:store,
// 	// data:function(){
// 	// 	return {}
// 	// },
// 	computed:{
// 		persons(){//用getters获取数据:getters只能是1层，不能再往里面拿数据
// 			return this.$store.getters.persons
// 		},
// 		componentData(){
// 			return this.$store.getters.components
// 		}

// 	},
// 	methods:{
// 		setName(data){
// 			//https://blog.csdn.net/aiyang1214878408/article/details/124736396
// 			/*
// 			 如果用了vue-devtools6.0以上的版本，那么它可能导致this.$store.dispatch报sub is not a func 的错误，需要设置下vue-devtools
// 			 1.在调试器中选择vue【就那个vuetool】，然后中击最右侧“三个点' ,选择devtool plugins
// 			 2.选择点击中间的"Vue 2",最右侧就会出来“Legacy Actions”这个开关，把他开启，就不会报错了
// 			 */

// 			//用action来“异步修改数据”
// 			this.$store.dispatch("setPersonName",{idx:0,name:"来日方长"});

// 			//调用组件api来实现和组件的交互：这个是主动调用，组件生命周期之外的调用
// 			this.$refs["cpa"].outerApi(data,function(formattedData){
// 				console.log("回调函数,处理formattedData相关业务逻辑");
// 			});
// 		},
// 		setAge(data){
// 			//用mutation来同步修改数据
// 			this.$store.commit("setPersonAge",{idx:0,age:24});
// 		},

// 		//给组件添加生命周期的回调函数
// 		beforeComponentACreated(){
// 		},

// 		//给组件添加异步事件的回调函数
// 		afterClickComponentA(){
// 		}
// 	},
// 	components:{
// 		"componentA":Toast
// 	},
// 	template:template.default
// })


    // beforeCreate: function() {
    //     console.log('调用了beforeCreat钩子函数')
    // },
    // created: function() {
    //     console.log('调用了created钩子函数')
    // },
    // beforeMount: function() {
    //     console.log('调用了beforeMount钩子函数')
    // },
    // mounted: function() {
    //     console.log('调用了mounted钩子函数')
    // }