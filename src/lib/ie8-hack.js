// import "@babel/polyfill";//ie8+浏览器全兼容
// import "es5-shim";//es5-sham不加载，es5-sham依赖es5-shim，做的是es5-shim无法完成的任务；es5-shim就是用现有的js来模仿一些es3不兼容的方法，把es3
// import 'es5-shim/es5-sham';

// import "@babel/runtime";//按需加载





// require("console-polifill");//压缩的时候把console去掉

//es3ify-loader 这个ie8兼容的插件在webpack中的设置好了；完成es3到es5的兼容；（es5转es3）
//es3ify-loader无法完成的es5转es3，就通过es5-shim + es5-sham来完成；
//babel完成了es5到es6的兼容（es6转成es5）

// 基础概念：
// shim：用浏览器支持的js模仿浏览器不支持的es5或者es6功能
// sham：对shim不能支持的功能，做降级处理
// polyfill：通过浏览器的API来拓展，使得浏览器支持es5或者es6的功能



/* ie8兼容总结 

1.引用babel-polyfill，es5-shim/es5-sham ,console-polifill
2.webpack打包用es3ify-loader和babel-loader（es6转es5，es5转es3）
3.Object.defineProperty不能用：业务中不用这个方法，引用的框架中也不能用这个方法，例如react-router-redux（react想要支持ie8，首先得在 14.7版本以下，react-router不支持ie8）
4.Babel 会把export xxx from ‘xx’ 语法转码为访问器属性设置的exports对象。 所以得分开写:
	import XXX from ".."
	export {xxx} 

babel-preset-es2015 : ES2015转码规则
babel-preset-react": react转码规则
babel-preset-stage-0: ES7不同阶段语法提案的转码规则，一共有4个，选择安装一个

babel为了兼容ie8需要开启loose模式，转化的时候能部分兼容ie8

Object.assign Object.values等不能用（除非全局引入babel-polyfill，但他太大了，压缩有就有32K）
*/




// 基于浏览器的兼容：core-js@3废弃了babel-polyfill，实现了完全无污染的API转译，就是用core-js来代替bobel-polyfill
// 用到@babel/polyfill；@babel/runtime；@babel/plugin-transform-runtime；@babel/runtime-corejs3；@babel/preset-env
// @babel/polyfill：用于ie8+非语法的新函数全兼容【依赖@babel/runtime-corejs3插件和@babel/runtime插件】，一次性全部加载太大，所以用大其他插件
// @babel/preset-env：包含了babel-preset-es2015以后的所有兼容，就是兼容所有的es最新语法，会根据“@babel/preset-env”中的tagerts设置，自动以target中的浏览器版本为基础，实现js的polyfill和语法的兼容
// @babel/plugin-transform-runtime：解决下面2个问题：1.多个文件重复引用相同helpers（帮助函数）-> 提取运行时;2.新API方法全局污染 -> 局部引入
// 具体看webpack.config.dev.js中的babel-loader设置，同时要注意.babelrc文件中的设置

