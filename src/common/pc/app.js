//下面这2个代替polyfill，同时需要在webpack设置中把useBuiltIns改为entry，表示一次性把兼容的js手动引入,这两个文件加起来非常大，不建议直接添加
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

//入口文件会被babel根据浏览器的特性来自动添加用到的js；但是第三方库没有被babel执行转化，貌似useage自动转化对第三方库不管用，得自己手动添加兼容的第三方库的兼容方法
import 'core-js/stable/object'; //使用usage的时候，貌似没有把array加载进来，没办法，自己在入口出手动引入
import 'core-js/stable/array';
import 'core-js/stable/promise';

import './sass/app.scss';//pc所有页面公共的css
// import * as util from 'util.js'; //util公共函数，做懒加载，提高页面渲染速度


function initMockData(){
	//mock数据:url后面添加mock=1【会加载mock数据】，ajax请求参数中添加参数mock:true,即可两个条件都成立才会走mock；如果url后面没有添加mock，哪怕开发人员忘了在请求中注释掉mock=true，也没关系
	window.mockData={};
	if(/(\?mock$)|(\?mock(\&|\=))|(\&mock$)|(\&mock(\&|\=))/.test(location.search)){//是否mock
		require.ensure([],function(require){
			window.mockData=require('../../../mock/index.js').default;
		});
	}
}
	

//上线前判断时候有yz或者qa的静态资源
function initWarn(){
	if(window&&document.querySelectorAll&&!/(qaclass\.|yzclass\.|local\.|localhost)/.test(location.href)){
		let hasQa=false,hasYz=false;
		let links=document.querySelectorAll("link[rel='stylesheet']")||[];
		let scripts=document.querySelectorAll("script[src]")||[];
		
		links.forEach(function(unit,idx){
			if(/qares\./.test(unit.href)){
				hasQa=true;
			}
			if(/yzres\./.test(unit.href)){
				hasYz=true;
			}
		});
		scripts.forEach(function(unit,idx){
			if(/qares\./.test(unit.src)){
				hasQa=true;
			}
			if(/yzres\./.test(unit.src)){
				hasYz=true;
			}
		});

		if(hasQa){
			console.error("线上环境页面包含qa环境的代码，请检查js和css链接是否正确");
		}
		if(hasYz){
			console.error("线上环境页面包含yz环境的代码，请检查js和css链接是否正确");
		}
	}
}

initMockData();
initWarn();