import Vue from "vue";
import * as antd from "ant-design-vue";
require('./app.scss');
let template=require("./app.html");


let page=new Vue({
	el:"#container",
	data:function(){
		return JSON.parse(decodeURIComponent(window.INIT_DATA))
	},
	created: function() {
        console.log('调用了created钩子函数')
    },
    beforeCreate: function() {
        console.log('调用了beforeCreat钩子函数')
    },
    
    beforeMount: function() {
        console.log('调用了beforeMount钩子函数')
    },
    mounted: function() {
        console.log('调用了mounted钩子函数')
    },
	computed:{
	},
	methods:{
	},
	components:{
	},
	template:template.default
})


    