
前端开发效率提升[sublime内支持]：！！！！！！！！！！！！！！！！！！！！
	f+tab:匿名函数 : [有了这个，完全没必要用箭头函数，因为写起来比箭头函数还要方便]
	fun+tab:正常函数
	for+tab:for循环自动补全，tab切换到下一个for循环变量
	函数名写完，按tab直接切到函数参数位置；函数参数写完，按tab直接切换到函数体内写代码

	多用es6的解构和...拓展

	let,var,import,require,module,defaults,debugger这种经常用的，会有缓存记忆，打一半直接出现在第一行就可以tab了


	！！！！！！！！！
	熟悉antv-design：看看什么组件，当自己需要类似组件，不要傻乎乎自己去写，先借外力，外面有现成了就不要自己造轮子！！！！！！！！！！！！
	！！！！！！！！！

	前端开发的时候，不要去写注释，因为中文和英文切换很花费时间，而且写注释也费时间；高手都是函数命名语义化，完全不需要写注释，等这一块功能开发完，再写注释
	
	代码自动折叠到第2层：ctrl+shift+x；crlt+shift+数字【自动折叠刀第几层】




BOM接口：
	1.window.performance:兼容ie9+和android4.0+；可以统计页面加载性能+页面是否通过back按钮返回【window.performance.navigation.type】
	





HTML5:常用的且支持ie9+的标签

	1.canvas ：功能类型：画布
	2.video，audio ：资源类型
	3.aside，header，footer，nav，section，article：语义化




CSS3：设备和平台区分，布局，动画，特效样式【4大类】

	多媒体查询【针对不同的媒体设备用不同的表现方式】：@media ，用于设置android，iphone，pc或者宽度限制的情况下，例如@media screen and (min-width: 480px) {宽度大于480的设备上用到的css}
	                                                                                  可以用and来添加限制条件

	//样式特效
	边框：border-radius,box-shadow，
	渐变：linear-gradient，背景颜色中可使用
	旋转变换【2D和3D】:  transform：translate【平移】，rotate【旋转】，scale【缩放】，skew【坐标轴倾斜】，matrix【包含以上所有功能的综合属性】

	//动画
	过度动画：transition【属性名称，过度时间，过度方式（线性过度），延迟多久开始】：
	自定义动画【有from和to，可以设置时间百分比，更加自由】：keyframes【定义动画名称和大概的变化】+animation【名称（和keyframes对应），时间，过渡方式，延迟，播放次数，是否下一个周期逆回放，是否运行】


	//布局
	flex-box：弹性盒子，用于弹性布局！！！！！！！
	inline-block
	响应式设置：max-width，min-width，百分比宽度
	width:calc(100% -50px) 意思是总宽度减去50px后的宽度




语法糖：对某个语言增加某种语法，对语言本身没有影响，只是增加它的可阅读性和可使用性


https://www.w3cschool.cn/escript6/escript6-6frp37f9.html学习到了generator函数，到了throw函数还没学

ES6:  解构，扩展运算（集成interator接口的数据都可以，所以除了object[纯对象]，number，bool，null，undefined，其他基本都可以），默认值，常量和局部变量，字符串处理
	
	es6核心概念：Proxy,Promise ，Iterator ，Generator，async，Class，Module
				Proxy：代理， new Proxy(obj, {
							  get: function (target, propKey, receiver) {
							    console.log(`getting ${propKey}!`);
							    return Reflect.get(target, propKey, receiver);
							  },
							  set: function (target, propKey, value, receiver) {
							    console.log(`setting ${propKey}!`);
							    return Reflect.set(target, propKey, value, receiver);
							  }
							});
							除了set，get，还有其他各种拦截方式，分别针对js对象的各种行为
				相当于给一个对象obj设置代理，任何属性的获取和设置，都要先通过这个函数，这个其实类似于Object.defineProterty，在里面设置get和set，所有的行为也是会通过defineProterty中的get和set
				不同在于defineProterty是针对单个属性设置的拦截，而Proxy是对所有属性无差别拦截，当然拦截里面也可以再细分针对不同属性做出不同拦截


				//遍历字符串和其他复杂数据类型，统一用for of
				Iterator:它是一个遍历器接口，只要给某个数据类型部署这个接口，那么它就可以用这个接口里面的方法【只要是for of和...】
						里面有很多方法，object没有包含这个接口，除了string的其他4种基础数据类型也没有,剩下的几乎全有
						支持Iterator的原生数据类型：String，Array，Map，Set，TypedArray，函数的 arguments 对象，NodeList 对象
												  虽然对象没有继承Iterator，但可以取巧来遍历对象：for (var key of Object.keys(someObject)){console.log(key,someObject[key])}


				 <!-- async 函数【es2017】就是将 Generator 函数的星号（ * ）替换成 async ，将 yield 替换成 await ，用async函数【语法】代替Generator函数【语法】>
				Generator函数【主要用在后端开发，协程】：	首先，他是一个Iterator对象【遍历器对象】的生成函数，就是调用Generator函数会生成一个遍历器对象
								【ES6 规定这个遍历器是 Generator 函数的实例，虽然没有用new；所以这个对象继承Generator的prototype

								带*函数，里用yeid来表示各种停顿状态；用next()一次次分步执行；
								1.调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是上一章介绍的遍历器对象（Iterator Object）！！！！
								2.第一次调用next(),遇到第一个yield就停止，返回的是第一个遇到的yield后面的值【其实就是执行到yield后面紧跟的表达式就停止了】；
								3.第二次调用next(),执行的是第一个yield和第二个yield之间的语句+第二个yield后面的那个表达式【这个作为返回语句】
								4.yield和后面的表达式是一个整体，下次条用next()如果赋值了，那么从原来停止的那个yield表达式后会被这个值替代，如果没有赋值，那就用undefined来替代上一步的那个yield表达式整体
								5.这里有一个细节，非常关键，如果碰到y= yield(x+5);第一next(),遇到yield就自动停止在了x+5这个表达式的计算，而不会执行下面的y=...；
								  y= yield(x+5);这里是包含2个计算的，第一步是x+5，第二部才是把x+5赋值给y，赋值语句计算是从右向左传递计算的；第一个next执行，停顿在了x+5这个yield表达式，
								  接下来要遇到下一个next()执行，才能让y被赋值，而下一个y赋值的值就是yield表达式的值，而此时yield表达式的值是从next函数的参数中获取的。
								  因为yield表达式本身没有返回值，或者说总是返回 undefined 。 next 方法可以带一个参数，该参数就会被当作上一个 yield 表达式的返回值。
								  执行next()返回的对象的value是yield后面的表达式的值，yield本身没有任何返回值，只能通过next（值），来给yield赋值

				              核心是理解yield
				              		1.它是暂停的意思，他后面接一个表达式，执行next(),返回的是一个{value:当前 yield 表达式的值，done：是否结束}，
				              		2.yeid停顿是按照语句来停顿的，下一句语句里如果包含yeid，那它就会在下一句包含yeid的语句之前暂停【以语句为单位，语句是以；为结束的】
				              		3.每次执行next(),里面如果赋值了

				              最后一个yield后面如果没有return，那执行最后的哪个next()返回的就是{value:undefined,done:true}




				Promise: 本质上来说，Promise构造函数创建一个promise对象只是用来规范异步操作的流程，把异步操作和回调函数赋值拆分成2断操作，promise对象构建的时候里面写ajax，
						并把ajax的成功和失败的回调函数赋值给默认的resolve和reject；对象创建，就是执行ajax然后获取对应状态的过程，这个对象再用then函数来存放成功和失败的回调函数
						相当于添加了then的时候，如果ajax请求已经有结果了，就会执行里面对应的状态的函数，没有调用then的时候，promise对象就算获取了ajax数据，也只是改变了状态，并且被阻塞，
						因为then还没有调用
						本质一句话：用Promise构造函数去封装异步，把异步的回调函数独立出来保存到promise的接口；然后接下来的通过then定义和执行回调函数都是同步的过程。
						
						pending,reject,fulfilled三种状态，只执行一遍，一旦出结果，接下来即使再添加异步函数监听，还是出相同的结果，这个和事件的异步不一样
						promise对象的then方法来自定义resove和reject的回调函数【成功和失败】


						 p=Promise.all(p1,p2).then(回调函数)：所有都fulfilled,才执行回调函数
						 p=Promise.any(p1,p2).then(回调函数)：只要参数实例有一个变成 fulfilled 状态，包装实例就会变成 fulfilled 状态
						 Promise.race(p1,p2).then(回调函数)：只要一个实例率先改变状态， p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数。
						 【es2020才加入】Promise.allSettled().then():等到所有这些参数实例都返回结果，不管是 fulfilled 还是 rejected ，包装实例才会结束









	Set：无重复的类数组对象；就是和数组差不多，但是里面没有重复的数据
			去除数组重复数据然后再转回数组：[...new Set(array)]


	Map：	也是个类数组，new Map([[1,2],[3,"4"]])，因为对象的属性只能是字符串，map的属性可以是“对象”等其他类型
			【如果是作为key，这个key是引用地址，所以即使2个内容相同的对象作为key，也是两个key，引用地址相同才是同一个key】，
			不仅限于字符串，size获取大小，set，get函数来设置和获取属性，还有has，delete，clear等方法




	对象：
		Object.setPrototypeOf(obj, proto)：把proto设置为obj的原型对象

		对象方法简写：
		var obj={
			getName(){}等价于 getName:function(){}
		}



	函数：
		1.箭头函数【可以和解构赋值一起使用】：	item => item+5 ：一个参数的箭头函数 
					() => 5;  没有参数的箭头函数
					(num1, num2) => num1 + num2; 多个参数的箭头函数
					(num1, num2) => {num1=3;num2=num1+num2} 多个参数和多条语句的箭头函数【这里要特别注意，箭头函数后面的第一个大括号是解释为代码块，而不是对象，
															所以如果要返回对象，需要用()来包裹对象，或者干脆用{}包裹对象】
		2.扩展运算：function add(...values) {} ；values就是arguments的意思，可以有任意个数的参数，配合函数里面使用for of，就可以直接遍历任意长度的参数
		 			严格模式use 'strict'可以再函数第一行使用，只针对这个函数使用严格模式【包括函数的参数声明】
		 			es6规定：只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错，不建议用严格模式
					function foo(){},如何获取函数名称 foo.name就能得到“foo”字符串


	数组：
		扩展运算【用于参数声明和函数执行】：arr=[1,2,3];console.log([...arr]);就是自动打出1，2，3  
			用于数组克隆；例如arr=[1,2,3];arr1=[...arr];实现了数组克隆，如果用ES5，那就是arr1=arr.concat();es5对象克隆是obj={age:24};obj1=Object.assign({},obj);
						arr.concat和Object.assign都只是第一层的浅拷贝，用深拷贝:JSON.stringify(JSON.parse(obj));

			用于数组连接：arr=[1,2,3];arr1=[4,5];arr2=[...arr1,...arr2];
			用于字符串转数组：str="jeffrey";arr=[...str];这个是很变态的方法，最后得到["j","e","f","f","e","r","y"]

		Array.from(arrayLike)：把类对象数组arrayLike转换成真正的数组，Map，argumets,Set,NodeList等

	变量：
		let：块级作用域 （if，while，for for in等语句里面）【js本来只有全局作用域和函数作用域这个2个】
		const：常量，不变的
	


	顶层对象：不同宿主环境不同，浏览器里是window； Node 和 Web Worker 没有window；一般再最外层，用this就可以获取顶层对象


	解构赋值 【解构失败的变量就是undefined】：
								字符串解构：let [a,b,v,b]="jeffrey";逐个赋值

								数组解构：let [a,b,c]=[1,2,3];就是分别给三个对象赋值
											高级用法就是： [a,b,c]=变量或函数();
								对象解构：let {name,age}={name:'jeff',age:24};直接获得name="jeff";age=24;这种是最常见的
								         	高级用法就是{name,age}=变量或函数()；

								函数参数解构：function add([x, y]){return x + y;}add([2,3]);等于把2赋给x，把3赋给y

								解构用于变量交换：let x=1,y=2;[x,y]=[y,x];

								混杂结构：比如一个JSON数据，jsonData={age:24,list:[2,3],persion:{sex:"male"}}；
											用结构方法：{age,list,persion}=jsonData;提取数据快到起飞，
											更加方面的是数组结构提取json，连属性名称都不用，方便到哭：
											var jsonData=[{name:"jeff"},56,[4,5]];var [person,a,[b,c]];而且解除只要数据个数对可以无线叠加，例如上面这个，还可能够继续解除
											var jsonData=[{name:"jeff"},56,[4,5]];var [{name},a,[b,c]]，直接把name都拿出来了

								正则解构【这个是最强的功能，没有之一】： let {groups: {one, two}} = /^(?<one>.*):(?<two>.*)$/u.exec('foo:bar'); ；把"foo"赋值给one，"bar"赋值给two

	默认值：
			let [x=1,y=2]=[3,4];
			let {age=24,name="fds"}={age:25,name:"fdd"};
			function getAge (age=25,{name="fs",age=24}){}


	遍历：任何部署了 Iterator 接口的对象，都可以用 for...of 循环遍历：	字符串，数组，对象，Map，Set，
																   	函数每部的arguments,
																   	Generator 函数，
																   	nodeList（用querySelectorAll(".classNameA"),返回的结果）从此都用这个函数
																   	
		Iterator 接口的对象包含的功能：for...of ；扩展运算...（例如conosle.log(...[1,2,3]),分别打出1，2，3）

	字符串模板：`chenjiajie${age}fdsds`可以再字符串中写入变量，非常方便，字符串和变量，不用再用+这么麻烦连接了

	正则：let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;  '2015-01-02'.replace(re, '$<day>/$<month>/$<year>')  //最终格式变成'02/01/2015' 这个超级实用
		 但原来的es5的用法也超级好用，例如："2012-01-23:15-22-24".replace(/(\d{4})-(\d{2})-(\d{2})\:(\d{2})-(\d{2})-(\d{2})/,"$1年$2月$3日：$4时$5时$分")格式转换成2012年01月23日15时22分24秒
	




	核心：类和模块的内部，默认就是严格模式，所以不需要使用 use strict 指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。
		  ES6 不会把类的声明提升到代码头部，所以先使用类再定义类是会报错的；




	Class： 有实例属性，实例方法，静态方法，没有静态属性，更没有私有属性和私有方法
			只是一个语法糖，方便程序员理解和书写，Class里面定义的方法和属性都是enumerable【不可枚举的】
	        Object.getPrototypeOf 方法可以用来从子类上获取父类。

	        属性表达式：让变量成为属性
	        let methodName = 'getArea';
			class Square {
			  [methodName]() {
			    // ...
			  }
			}

			//如果Class内部想要引用自己，可以先用下面的方式，这个Me就是在自己Class内部对自己的引用，在Class外部是无法引用的
			const MyClass = class Me {
			  getClassName() {
			    return Me.name;
			  }
			};

			父类的静态方法，可以被子类继承：静态方法内部的this，指向的是这个类本身，而不是实例对象
			类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上 static 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
			

			super： 【用在子类中引用父类】
					1.super 在构造函数中作为函数调用，指向父类的constructor且默认在super执行之前会默认执行super=super.bind(this);来绑定this； super() 只能用在子类的构造函数之中
					        在构造函数中作为对象赋值，super相当于this，但是super.属性读取的时候，又是按照指向父类的原型对象来读取数据的
					2.super 作为对象时，在普通方法中，指向父类的原型对象【prototype】；在静态方法中，指向父类自身。

			子类的 proto 属性，表示构造函数的继承，总是指向父类。
			子类 prototype 属性的 proto 属性，表示方法的继承，总是指向父类的 prototype 属性



			ES6 可以自定义原生数据结构（比如 Array 、 String 等）的子类，这是 ES5 无法做到的。

			继承：
				class ColorPoint extends Point {
				}
				// 等同于
				class ColorPoint extends Point {
				  constructor(...args) {
				    super(...args);
				  }
				}

				但是如果子类要写自己的实例属性，就必须按照下面的格式写构造函数，然后再super(父类参数)【这里的参数是用父类需要的参数】后面写this.属性=...来添加子类自己的实例属性




	在 ES6 之前，社区制定了一些模块加载方案，最主要的有CommonJS和AMD两种。前者用于服务器，后者用于浏览器。ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

	CommonJS：同步，模块是对象，用require  【"运行时加载"，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。】

	AMD：seaJs，异步加载

	ES模块化：用import+export；以后浏览器会慢慢全部支持这个；ES6 的模块自动采用严格模式，不管你有没有在模块头部加上 "use strict"; 。
			import { stat, exists, readFile } from 'fs';【“编译时加载”或者静态加载】

			严格模式主要有以下限制。

			变量必须声明后再使用
			函数的参数不能有同名属性，否则报错
			不能使用 with 语句!!!!!!!!!!!!!!!!!!!!
			不能对只读属性赋值，否则报错
			不能使用前缀 0 表示八进制数，否则报错
			不能删除不可删除的属性，否则报错
			不能删除变量 delete prop ，会报错，只能删除属性 delete global[prop]
			eval 不会在它的外层作用域引入变量
			eval 和 arguments 不能被重新赋值
			arguments 不会自动反映函数参数的变化
			不能使用 arguments.callee!!!!!!!!!!!!!!!!!
			不能使用 arguments.caller!!!!!!!!!!!!!!!!!
			禁止 this 指向全局对象!!!!!!!!!!!!!!!!!!!!!
			不能使用 fn.caller 和 fn.arguments 获取函数调用的堆栈!!!!!!!!!!!!!!!!!!!!
			增加了保留字（比如 protected 、 static 和 interface ）

方法1【推荐】：import和export用{ firstName, lastName, year }格式
方法2：如果import是整体就在，就用 import * as 别名 from ...， export还是老样子
方法3：如果用了export default 方法名称；那么必须用import “随意名称” 来引入，这个引入不能加括号{}，但可以用任意名称代替import的那个函数  


所以import的时候
	1.先确定模块是否是es6模式的模块，如果是cmd模块，就得用import 模块名 from ...；和export default的模块的引用方法是一样的
	2.确定是es6模块，那么得先看对方的export的格式，如果是default，那还是用import 模块名 from ...来引用
	3.确定是es6模块，模块不是export default的方式，那么就用import * as 别名 from ...全局引用；或者{ firstName, lastName, year }部分引用，最好使用部分，因为只会加载里面的一部分





								引用的时候就通过“别名.内部方法”来调用

			//该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用 export 关键字输出该变量
			export var firstName = 'Michael';
			export var lastName = 'Jackson';
			export var year = 1958;
			或者定义好变量后直接export { firstName, lastName, year };【推荐】

			改名export {
				v1 as changedName1,
				v2 as changedName2
			}



	浏览器加载 ES6 模块：<script type="module" src="./foo.js"></script> 属于异步加载


	CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
	CommonJS 模块是运行的时候加载，ES6 模块是编译时输出接口,所以es6是部分加载，	CommonJS是全部加载



	Node.js 要求 ES6 模块采用 .mjs 后缀文件名。也就是说，只要脚本文件里面使用 import或者 export 命令，那么就必须采用 .mjs后缀名。Node.js 遇到 .mjs文件，就认为它是 ES6 模块，默认启用严格模式，不必在每个模块文件顶部指定 "use strict"。
	如果不希望将后缀名改成 .mjs ，可以在项目的 package.json 文件中，指定 type 字段为 module 。
	如果这时还要使用 CommonJS 模块，那么需要将 CommonJS 脚本的后缀名都改成 .cjs 。如果没有 type 字段，或者 type 字段为 commonjs ，则 .js 脚本会被解释成 CommonJS 模块。
	总结为一句话： .mjs 文件总是以 ES6 模块加载， .cjs 文件总是以 CommonJS 模块加载， .js 文件的加载取决于 package.json 里面 type 字段的设置。

	Node.js 对 ES6 模块的处理比较麻烦，因为它有自己的 CommonJS 模块格式，与 ES6 模块格式是不兼容的。目前的解决方案是，将两者分开，ES6 模块和 CommonJS 采用各自的加载方案。


	//package.json:知识点，默认JSON中的"main"属性对应的地址是入口文件地址；但如果又exports字段且里面的某个属性别名是.,例如"export":{".":"adf.js"};那么模块的入口地址就是adf.js
	package.json 文件的 exports 字段可以指定脚本或子目录的别名


	正常来说，es6模块用import加载，commonJS模块用require加载；如果 import 命令加载 CommonJS 模块，只能整体加载，不能只加载单一的输出项。最怕用import {}来加载commonJS模块，会报错；
	所以import之前，要确保它是es6的标准模块。虽然es6模块能兼容加载cmd模块，但是cmd的require命令不能加载es6模块

	Node.js 的 import 命令只支持加载本地模块（ file: 协议）和 data: 协议，不支持加载远程模块。另外，脚本路径只支持相对路径，不支持绝对路径（即以 / 或 // 开头的路径）
	Node 的` import ``命令是异步加载，这一点与浏览器的处理方法相同。
	ES6 模块应该是通用的，同一个模块不用修改，就可以用在浏览器环境和服务器环境。为了达到这个目标，Node 规定 ES6 模块之中不能使用 CommonJS 模块的特有的一些内部变量。



	commonJS执行原理：
		1.CommonJS 模块的重要特性是加载时执行，即脚本代码在require的时候，就会全部执行











学习地址：https://cn.vuejs.org/v2/guide/syntax.html：看到style和Class
VUE学习：Vue 组件不需要任何 polyfill，并且在所有支持的浏览器 (IE9 及更高版本) 之下表现一致。必要时，Vue 组件也可以包装于原生自定义元素之内。
	VUE功能：	1.数据和dom展示自动绑定，修改数据时候dom自动更新[基础]
				2.DOM属性，事件，是否展示【过度动画】；内容文本4大块控制
				3.V-model：html交互元素【input等可改变内容的元素】，和data双向绑定【打他修改，交互元素的内容也会变（基础）；但交互元素修改，data也自动边（这个本来需要自己监听事件然后手动修改data）】
				4.组件化+组件通信
				5.创建流程【具体看流程图】：数据监听【Proxy或者Object.definePropertyies等】，模板渲染【根据模板创建虚拟dom】，根据模板创建dom然后把数据挂载到dom上实现数据绑定【data改变，dom更新】
				6.生命周期：created，mounted,updated,destroyed;vue关联的函数上别用箭头函数
				7.模板渲染语法：mustache，{{name}}，括号里面可以是表达式，但不能是js其他语句，例如if，else，for循环；同时模板内很多全局变量都不能访问：其实模板内最好只放数据，其他逻辑都在外面做好
				8.某个标签设置v-html，相当于设置innerHtml，权限较大，容易造成xss攻击
				9.指令：  v-bind（缩写是：），v-on（缩写是@），v-if,v-for  ：这些指令都有对应的修饰符，比如v-on:submit.prevent，就是触发submit事件的时候调用preventDefault函数
						v-bind:<a v-bind:[attributeName]="url"> ... </a>,2.6版本开始，支持变量名和表达式书写动态属性


	vue的天坑：vue无法检测数组的长度，因为是用defineProperties来监控属性的，length无法监控

	侦听和计算属性：methoded，computed，watch
				10.computed和method，同样用于计算属性，method每次执行都会重新计算，重新渲染；
				   computed择会缓存，computed里面是属性是依赖于其他属性的，只要其他依赖的属性都没有变动，computed里面的属性也就不会变动
				   例如下面的reversedMessage，computed里面的reversedMessage获取的时候，只要它依赖的message没有变化，那么每次获取computed里面的reversedMessage用于渲染的时候，
				   和reversedMessage这个属性绑定的dom就不会重新渲染，但是methods里面的reversedMessage每次获取它然后渲染，就是重新渲染

					computed: {
						// 计算属性的 getter
						reversedMessage: function () {
						  // `this` 指向 vm 实例
						  return this.message.split('').reverse().join('')
						}
					}

					methods: {
						reversedMessage: function () {
							return this.message.split('').reverse().join('')
						}
					}


					computed里面的属性是依赖其他属性的，通过其他属性计算得到的，所以才叫computed，用computed比watch更加好用，多用它；而且computed可以不单单是get，还有set，
					也就是说不单单firstName或lastName改变的时候 ，会重新渲染fullName所在的dom，还可以通过修改fullName，来直接修改和他关联属性，做到数据联动更改
					computed: {
					  fullName: {
					    // getter
					    get: function () {
					      return this.firstName + ' ' + this.lastName
					    },
					    // setter
					    set: function (newValue) {
					      var names = newValue.split(' ')
					      this.firstName = names[0]
					      this.lastName = names[names.length - 1]
					    }
					  }
					}

				11.watch，监控属性，某些属性变化了，就自动执行函数，函数里面修改和他关联的操作，开销比较大，能用computed实现，就别用watch；
				   和computed的差别是，computed是里面数据类型简单的依赖，就是某个数据值依赖于其他数据，其他数据改变，它也跟着变，
				   但如果某个数据，依赖非常多的数据，而且有的时候依赖这个数据，有的时候依赖另一个，那就不是computed能解决的事情了，因为computed的前提是，依赖的数据是固定的那几个



	v-for:<div v-for="item of items"></div> 或<div v-for="item in items"></div>都可以：遍历数字或者对象内属性  <div v-for="(value, name) in object">

			1.在 v-for 块中，我们可以访问所有父作用域的 property。v-for 还支持一个可选的第二个参数，即当前项的索引。
			2.当 Vue 正在更新使用 v-for 渲染的元素列表时，它默认使用“就地更新”的策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，而是就地更新每个元素
			  	
			  	为了给 Vue 一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，你需要为每项提供一个唯一 key attribute：
				<div v-for="item in items" v-bind:key="item.id">
				  <!-- 内容 -->
				</div>
				所以，如果不改变顺序，可以不用key，来提升性能；如果要改变顺序，就必须用key



	组件：任何数据都不会被自动传递到组件里，因为组件有自己独立的作用域。为了把迭代数据传递到组件里，我们要使用 prop，例如下面的【item，index，key】
			<my-component
			  v-for="(item, index) in items"
			  v-bind:item="item"
			  v-bind:index="index"
			  v-bind:key="item.id"
			></my-component>

			异步加载组件：//然后把<login v-if="true" ></login>插入到当前vue组件或者对象的template里面,用v-if控制它的动态加载
			就是v-if里面的变量不为ture就不会加载，变量变成ture的时候，就会自动
			动态加载这个组件；
			{
				mounted:{},
				components:{
					"login": () => import('./components/login'),
					"regist": () => import('./components/regist'),
					"editor-wrapper": () => import('./components/article-edit'),
					"personal-article": () => import('./components/article-list'),
					"article-display": () => import('./components/article-display')
				}
			}


	事件：
		在click里面调用函数的方式没传入原生事件event，如果不需要，直接不加括号即可
		vue中的事件都是vue模仿原生事件，如果想监听原生click事件，可以用v-on:click.native=""
		<button v-on:click="warn($event)">
		  Submit
		</button>
		methods: {
		  warn: function (event) {
		    // 现在我们可以访问原生事件对象
			    if (event) {
			      event.preventDefault()
			    }
			    alert(message)
			  }
			}


	表单输入对应V-model：input textarea select【正常vue都是单向绑定，说到双向绑定，就是指表单输入的时候，数据也自动变化】
						v-model 会忽略所有表单元素的 value、checked、selected attribute 的初始值而总是将 Vue 实例的数据作为数据来源。你应该通过 JavaScript 在组件的 data 选项中声明初始值。

						text 和 textarea 元素使用 value property 和 input 事件；
						checkbox 和 radio 使用 checked property 和 change 事件；
						select 字段将 value 作为 prop 并将 change 作为事件

						修饰符： .number:<input v-model.number="age" type="text"> 输入数字； <input v-model.trim="msg">输入自动去首尾空格

						组件上使用v-model 【还是不太建议，最好是自己写逻辑，容易让别人搞混】，
							1.首先需要设置组件传入的值属性是value
							2.在其 input 事件被触发时，将新的值通过自定义的 input 事件抛出【很麻烦，而且还是默认逻辑必须写，不如自己写逻辑】
						v-model其实就是个语法糖，
						<input v-model="userName" />其实就是
						<input ：value="userName" @input="userName = $event.target.value" />的简写


	组件：
		Vue.component('button-counter', obj);里面的obj的数据结构和new Vue(obj)的一样
		组件定义好以后，每次在html中使用<button-counter></button-counter>，都会自动创建一个实例，所以它们是相互独立的


		//全局组件
		组件的定义：Vue.component('component-a', obj)：全局组件【因为全局，所以不设置el】
		组件使用：
					1.  <div id="app"><component-a></component-a></div>，
					2.	new Vue({ el: '#app' })来把组件绑到对应的标签里面



		//局部组件
		组件定义：ComponentA=obj;ComponentB=obj;
				new Vue({
				  el: '#app',
				  components: {
				    'component-a': ComponentA,
				    'component-b': ComponentB
				  }
				})

		基础组件的自动化全局注册：绝大部分页面要用到的基础组件，放在公共js里面，然后用vue组件语法进行全局定义，
								好处是，当前页面加载了，去下一个页面就不需要加载这个组件对于的js了，因为在公共模块里面了
								如果基础组件都各自打在自己页面的js里面，就不存在公共的抽离了。



	自定义事件定义和执行：<my-component v-on:my-event="doSomething"></my-component>  ；  this.$emit('my-event')
	不要写成<my-component v-on:myEvent="doSomething"></my-component>   this.$emit('myEvent'),因为myEvent会被自动转小写myevent
	导致this.$emit('myEvent')事件触发失败，得用this.$emit('myevent')


	组件作用域：父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。 
	           所以子模板要访问父模板的数据正常来说是不可能的，只能通过父模板传递给子模版属性，然后子模版通过props中对应的属性才能访问






	//插槽定义+组件使用的时候内部插槽内容如何填入

	插槽：slot和slot-scope全部弃用，改成统一的v-slot，详细可以看具名插槽，插槽内部是无法访问组件的具体详细的，所以需要给插槽传递数据
			<span>
			  <slot v-bind:user="user">
			    {{ user.lastName }}
			  </slot>
			</span>

		动态插槽，其实就是给插槽的名字改成变量，
		<base-layout>
		  <template v-slot:[dynamicSlotName]>
		    ...
		  </template>
		</base-layout>

		插槽定义：
			1.比如某个component名称是v-component;
				那么component内容定义的时候，就可以带入插槽<div v-bind:href="url" class="nav-link"> <v-slot></v-slot> </div>，
				使用的时候<v-component>jeffreychen</v-component>,这个Jeffreychen就会自动替换component中的v-slot，这个是最基本的

			2.如果一个组件里面带了多个插槽【用name来区分】，虽然组件定义的时候引入插槽很容易，例如
				组件v-component的定义如下：
				<div class="container">
				    <slot name="header"></slot>
				    <span>452</span>
				    <slot name="footer"></slot>
				</div>
				但组件使用的时候，如何区分插槽呢？用法如下
				<v-component>
					<template v-slot:header>
						<h1>Here might be a page title</h1>
					</template>
					<template v-slot:default>
						<span>default Content</span>
					</template>
					<template v-slot:footer>
						<span>55556666</span>
					</template>
				</v-component>

				但是这个v-slot:default有啥作用，假如v-component定义的时候没有设置v-slot的name就会使用default
				<div class="container">
				    <slot ></slot>
				    <span>452</span>
				    <slot name="footer"></slot>
				</div>




	动态组件:
				<component v-bind:is="currentTabComponent"></component>
				只要修改is后面的名称，就可以修改成对应的组件currentTabComponent是可以动态改变的，是个组件名称

				动态组件缓存：组件切换的时候，原来的组件会被缓存起来
					<keep-alive> <component v-bind:is="currentTabComponent"></component> </keep-alive>


	异步组件： 某个页面不一定会加载，只有特殊情况偶尔才会加载的组件，就做成异步组件，异步下载这个组件
		Vue.component(
					  'async-webpack-example',
					  // 这个动态导入会返回一个 `Promise` 对象。
					  () => import('./my-async-component')
					)

	组件之间的相互访问和原生dom访问：推荐通过vuex来管理组件之间的通信，而不是用下面的访问方式，vuex便于管理
			访问上层组件：
					this.$root:根组件
					this.$parent：父组件
			访问子组件：【异步加载的组件，不能通过ref来访问】
					首先给子组件定义的时候添加 ref="name1"，然后在父组件上可以通过this.$refs["name1"]来访问这个子组件
					注意:非万不得已别用$refs，$refs 只会在组件渲染完成之后生效，并且它们不是响应式的。
						 这仅作为一个用于直接操作子组件的“逃生舱”——你应该避免在模板或计算属性中访问 $refs





	注意：	多看深入响应式原理：已经看懂了，很简单

			0.Vue用到了Object.defineProperty ，它是 ES5 中一个无法 shim 的特性，这也就是 Vue 不支持 IE8 以及更低版本浏览器的原因。

			0.Vue 不能检测数组和对象的变化，所以传入的时候，属性得定义好，新增的不能被监控；Vue 无法检测 property 的添加或移除
			  所以，唯一的解决办法就是，把整个数组或者整个对象替换成新的数组或对象【指针是新的，这样才能触发data和template的重新绑定】

			0.如果出现max stack size exceeded错误，大多数是组件或者逻辑递归无限循环导致的，组件循环引用要特别注意
			1.组件里面的data是一个function，function里面返回一个对象{data:{}},这样保证每个实例调用的时候，返回的data都是独立的object
		     	如果data是一个object，那么所有组件就会共用这个object，无法做到相互独立。
		    2.每个组件只有1个根元素

		    3.父组件传递属性给子组件，子组件通过 props: ['属性名']来接受父组件的数据传递

		    	子组件属性props是从父组件那边获得的，子组件的props中定义的属性名，不能和实例属性重名【例如data，computed，methods】

		    	//父组件
		    	new Vue({
				  el: '#blog-posts-events-demo',
				  data: {
				    posts: [/* ... */],
				    postFontSize: 1
				  }
				})

		    	<div id="blog-posts-events-demo">
				  <div >
				    <blog-post
				      v-bind:post="post" 【传递post数据给子组件】
				    ></blog-post>
				  </div>
				</div>

				//子组件
		    	Vue.component('blog-post', {
				  props: ['post'],
				  template: `
				    <div class="blog-post">
				      <h3>{{ post.title }}</h3>
				      <button>
				        Enlarge text
				      </button>
				      <div v-html="post.content"></div>
				    </div>
				  `
				})


			4.注意在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 	
				来说，在子组件中改变变更这个对象或数组本身将会影响到父组件的状态。

			5.  this.$el访问到原生dom，因为vue的dom渲染队列是异步的，得用Vue.nextTick里面的callback来更新原生dom，解决异步的问题
				Vue.nextTick(function () {//意思是等vue的dom渲染完成后，在修改对应的dom，不然就算修改了dom，也可能被vue的异步的dom渲染给覆盖
				  vm.$el.textContent === 'new message' 
				})

			6.data数据结构一开始就定好，一旦和view绑定，再去添加里面的属性就没用了
			
			7.需要特别注意的是，html里面的属性是不分大小写的，所以变量attributeName的值，只能是小写的字符串，有大写的字母也会自动被转成小写！！！！！！！！！！！！！！！
			
			8.因为有些表现里面只允许存放特定的标签，比如ul里面只能放li，如果在ul里面放一个组件，这个组件会被浏览器默认为意外的标签，导致解析出错，无法正常在table里面放组件
			  所以需要is属性，作用是把这个标签替换为组件例如：<ul><li is="todoComponent" ></li></ul>,todoComponent的template其实就是li元素，用is就直接把todoComponent替换成了当前的li
			  因为如果直接用<ul><todoComponent></todoComponent></ul>,浏览器默认认为ul里面必须放li，所以会导致解析出错；但div这种标签里面放组件就完全没有问题，因为这些标签里面没有限制必须使用什么标签
			  但如国你把这些内容不是写在html里面，而是用template字符串来实现，就完全没必要用<li is="todoComponent" ></li>来代替<todoComponent></todoComponent>，模板引擎会自动解决这个问题

			  特别建议组件的html用template引入，而不是组件中写在一起






VUEX：vue-tools使用


微信小程序开发：https://www.w3cschool.cn/weixinapp/weixinapp-ft5738rb.html


微信开发主要用js，但还是有如下区别：
	1.网页开发渲染线程和脚本线程是互斥的，这也是为什么长时间的脚本运行可能会导致页面失去响应，而在小程序中，二者是分开的，分别运行在不同的线程中。
	2.小程序逻辑层是在jsCore中运行，所以和浏览器不同【BOM，DOM无法使用】；和Node环境也不太一样【依赖node环境的某些npm也无法使用】
	3.小程序的开发需要经过申请小程序帐号、安装小程序开发者工具、配置项目等等过程方可完成。













css：【css的规范版本，以及各个浏览器对css版本的支持！！！！！！！！！！！！！！】
	0.css自适应布局【2列，3列；宽度固定，不固定】
		页面由3种类型的box组成：每类box指向不同的渲染规则
			1. inline box
			2. block box
			3. run-in box
	FC:它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用；主要由BFC和IFC，BFC是相互独立，用处见下面3点

		BFC用处：
				1.设置块元素为BFC，让块元素垂直margin不和其他块元素重叠
				2.去除因为float定位造成的内容环绕
				3.子元素浮动，父元素不设置高度造成父元素高度塌陷，用BRF让父元素包含子元素

		如何触发BFC：【满足下列的任意一个或多个条件即可】：脱离文档流,overflow非默认,display特殊值
			1、float的值不是none。【脱离文档流】
			2、position的值不是static或者relative。【脱离文档流】
			3、display的值是inline-block；table-cell、table-caption；flex、inline-flex
			4、overflow的值不是visible【非默认值】


	1.html可以分：替换元素【有src或href替换展示元素内容】和非替换元素
	2.行内元素和块元素【核心是行内和块的展示，其实和元素无关，展示类型分行内和块】：行内元素可继承块元素，反之不行；块元素独立成行，后面不会跟其他任何元素
		核心：display：inline和block；inline-block；


	3.在css内支持@import url type；可以插入其他css【css文件中或style标签中使用】
	  url表示css地址，type表示css用于那种展示类型，默认是all

	//不太建议使用：查找标签已经很耗费性能了，再添加属性就更加耗费性能，一般都用class实现查找
	4.css其实还有一个属性选择器，例如a[age]{...};表示查找素有带有age属性的a标签
	  a[age="2"]{...},表示查找带有age属性为2的所有a标签
	  *[age="2"],表示带有age属性的所有标签
	  a[age="2"][name="jeff"]:多属性筛选

	5.直属子元素：例如 p>a{...} ,表示p下的第一级子元素a的样式，不是孙子或者更加后面的子孙
	6.兄弟元素：例如p+ul{...},表示和p相邻的ul元素的样式
	7.子元素：li:first-child,li:last-child,li:nth-child(2)
			  特别注意，不是li的子元素，而是li本身作为其他元素的第几个子元素

	8.伪类：css2.1下的a标签支持：link和：visited两个【未访问过（包括锚点点击都没点过）；和访问过】
			a标签伪类书写顺序：link,visited,focus,hover,active
			input有一个focus的伪类
			静态伪类：link,visited
			动态伪类：focus,hover,active
	 		动态和静态伪类可以结合，例如a:link:hover{表示没点击过且状态下}

	9.伪元素：
			例如p:first-letter{段落的第一个字样式};p:first-line{第一行样式}【只支持p标签，且只支持color，font，background，margin属性】
			:before和:after属性；伪类，放在元素内容的开头或结尾【css2中的写法】
			::before和::after【和上面功能一样，这个是css3写法】
			css2写法兼容性好，css3写法渲染效率高，pc端用css2写法，移动端建议用css3写法
			详细写法：  p:after{content:"我是谁，我在哪"，...其他样式}；content用于表示内容


	10.css元素属性的继承+权重的计算：就是层叠的意思，也是层叠样式表的由来【很关键】
		权重计算：
			css2.1支持添加important，例如 span{font-size:24px !important;}:权重超style
			内联样式style：1000
			id权重：100
			class权重：10
			标签或伪类权重：1
			通配符*权重：0
			权重计算方法：叠加算总和，比如 p a{权重是1+1}；p.classA{权重是10+1}
			如果p,a这种联合形式的声明，是不叠加的，因为它们只是简写而已，拆分成p和a各自计算权重

		继承：【不同浏览器继承都不太一样，谨慎使用：因为这样才有reset.css,让绝大部分浏览器标签表现一致】
			继承都是子孙继承父元素，只有一个特例，body的背景会传递给html
			一般行内元素可以继承块元素，反之不行；同时属性有的可以继承有的不可以；
			很杂，不建议用继承写样式，用到继承的属性也就font-size和font-style


	11.颜色color:rgb(0-255,20,20)或rgb(20%,20%,20%)
	             #555555或#222
	   web安全色指的数web浏览去可以正确展示的颜色：
	   			16进制的安全色编码是#0369CF【用这6个字母任意组成的6位数，都是安全色】：就是3的倍数

	   长度：em【相对父元素】；rem【相对html元素】，px【最常用的像素单位：rem支持ie9+，用于响应式】
	   		响应式：百分比，rem，viewport三种解决方案；特定浏览器可用flex或grid


	   背景：background-color，
	   		background-image[背景图片url]
	   		background-repeat[背景图片是否重复],
	   		background-attachment[背景图像是否固定或者随着页面的其余部分滚动。]
	   		background-position[背景图片位置]/
	   		background-size 背景图片的尺寸。
			//css3
			background-origin 背景图相对于那个区域绘制【padding-box;border-box;content-box;】
			background-clip 背景的裁剪区域【padding-box;border-box;content-box;】
							设置content-box，就是把padding和border上的背景图都裁剪掉
	   		例如：background: #fff 
	   						url("...") 
	   						no-repeat
	   						scroll [设置attachment]
	   						top left / 16px 20px 【前面是position,/后是size】
	   						border-box
	   						padding-box

	   		一般只需要写：#666 url() no-repeat top left;这几个就可以了

	   字体：font-family,font-weight,font-style,font-variant【字体变形，默认nomal】等
		   组合写法：font-size和font-family必须要有，其他没有会自动插入默认
		   font-style font-variant font-weight font-size/line-height font-family
		   例如：font:italic small-caps bold 12px/1.2em Arial;
		   常用：font:italic normal normal 12px/1.0em Georgia,serif;
		   				[多个字体，优先用前面的，前面的没有就用后面的]

		块元素行内缩进：text-indent【第一行缩进】
				例如：p{text-indent:4px;}
				text-align:块元素内的行内元素的水平对齐方式【用于块元素，针对行内元素】
				line-height：块元素内的行内元素的行高【用于块元素，针对行内元素】
				vertical-align:块元素内的文本行内元素的垂直对齐方式【默认baseline】
								对块元素的居中不起作用，除非是table中的某些块元素或inline-block
				块元素内内容垂直居中：height和line-height设置相同

		字体间距：word-spacing:normal[默认]

				text-transform:uppercase[大写] lowercase[小写] capticalize[首字母大写]
				text-decoration:underline overline linethorugh blink [字母装饰]
				text-shadow:文字阴影
				white-space:对文字中的”空格，换行，tab"的处理
							最常用的就是nowrap【不允许换行】


		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		css文本流：正常流，非正常流
		和文本流相关概念：替换元素，非替换元素；行内元素，块元素
		盒模型：content+padding+border+margin 总体相加是元素整体所占的宽高
				
			块级元素：
				正常流下，块元素所占的宽高就是盒模型中所占宽高（content+padding+border+margin）
				也等于其父元素的content的width
				块级水平属性：width,padding，margin,border的left和right
						 只有width和margin可以设置auto，其他必须是有值【无值就用默认值】
						 如果width和margin全设置了固定值，但受到限制造成了矛盾，margin-right会自动变成auto来适应！！！！
						 如果with设置了auto，margin固定，那么widh宽度就受到margin的影响

				margin设置负数，会导致元素超出父元素，虽然总和还是和父元素content一样

				如果替换元素的with设置auto，那么他的宽度是他的src链接所指元素的原本宽度；
				如果设置了替换元素的宽度或高度中的一个，比如设置了宽度，那么高度就会等比例缩放

				块级垂直属性：height，padding，margin，border的top和bottom
						只有height和margin可以设置auto；但垂直margin设置auto就自动变成0，
						无法垂直居中；所以垂直居中的方法，是把块元素的上下margin设置百分比
						垂直间距上下margin会重叠

			行内元素：行内元素的水平居中用text-align;垂直需要给父元素添加vertical-align来设置
					 或者设置line-height设置【内容区高度（等于font-size）和行内框】；
					 行内框高度是line-height;
					 行内元素也有border和水平的padding+margin


			行内元素和块元素展现形式的转变：
				display:block,inline，inline-block[对内块元素，对外行内，支持ie8+]

			//脱离文档流
				1.浮动[float]: 根据它的包含块定位【最近的块级父元素】
					相当于对内部设置了display：block；但因为脱离文档流导致可以和其他元素同行。
					  和inline-block有点类似，但也有很多区别
					  float是脱离文档流的，但inline-block没有
					  inline-block对外是行内元素，所以可以用vertical-align设置垂直居中
					  但float不可以用vertical-align设置，它仍然是块元素展示，只是脱离文档流

					  设置了浮动，其他元素会环绕这个元素：
					  行内元素自带行内框，块元素自带块级框，但是float以后，不管是什么元素
					  都是带块级框；display的inline或block也是行内框和块级框的意思

					浮动元素的包含块概念，就是最近包含它的块元素；浮动的元素是不能超过包含快的content
					清除浮动：clear：left,right，both

				2.定位[position]：static【正常文档流】，relative【文档流，偏移】，absolute，fix

						relative:不脱离文档流，只是相对于原来的位置做偏移
						absolute:脱离文档流，根据position不是static的元素来作为包含块|或body，来定位
								如果包含块是块元素，根据该元素的padding定位
								如果包含快是行内元素，根据该元素的内容来定位
								和float元素不同的是，position为absolute的元素
								它可以定位到包含块的外面
						fixed:脱离文档流，根据window窗口定位

						z-index:对非static元素或float元素才有效；
								z-index有祖先元素的概念【最近的设有z-index的float或relative或absolute元素，会产生一个层，内部所有元素都再这个层上方】；
								比如a属于祖先元素A，A的z-index【relative或absolute或float】为10
									b属于祖先元素B，B的z-index为100
									那么不管a和b的z-index如何设置，ab重叠的时候
									b肯定覆盖在a上面，因为是先比祖先元素的z-index，
									再比它们各自的z-index

				内容溢出【overflow】:auto,scroll,hidden



		ul|ol列表特定样式：[基本用不上]
			list-style-image:url(...)
			list-style-position:

		光标：cursor:pointer

		轮廓：outerline：width,style,color

		多媒体语法：
			@media screen {

			}
			@media print{

			}