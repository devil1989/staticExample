项目构建原则：一个项目对应一个package.json，不能在多个项目放在同一个package.json里面，否则一旦某个项目要升级，其他项目因为文件的影响就会导致错误；
            所以一个项目原则上是用同一个技术框架，如果技术框架不相同，最好单独切另外一个仓库，这样保证各子项目的技术框架升级的时候，能相互独立



浏览器调试的时候，如何排除f11跳转到框架代码里面：
    1.点击chrome的调试器右上角的机械齿轮
    2.会出现：偏好设置，工作区，实验，忽略列表，设备，节流...等选选个
    3.点击“忽略列表”，设置需要跳过拿一些类型的js；把框架代码的js添加进去
    4.比如我f11的时候经常跳转到vue.esm.js这个文件【跳转的时候鼠标移上去就知道时什么文件了】
      只要在忽略列表内添加vue.esm.js，下次就直接跳过这个文件了



//执行命令
本地开发启动命令 ： npm start
dev环境打包命令：npm run dev（基本不用，如果自己想看打包后的文件结果，可以执行该命令）
生产环境打包命令：npm run prod（cli里面会自动执行这个打包命令）


//qa ，yz ,线上打包的区别：没有区别，都是用prod打包，因为publicPath被设置成了相对地址，所以请求无所谓qa还是yz，所有环境通用；
  ajax请求会自动根据host来获取当前的环境，然后用对应的host地址去请求api，所以前端静态资源，只有dev和prod两套打包
  但是node端就不一样，node端虽然不需要打包，但是执行环境命令是区分qa，yz和线上的；因为给html文件里面的所有链接添加host的时候，需要根据不同的环境添加qa，yz等前缀



//调试命令（需要先进入chrome://inspect/#devices地址，然后在执行下面的命令）
npm run debug ： 调试某个js文件【浏览器下可以查看fs，path等node接口】 
npm run debug-webpack : 调试webpack文件，包括webpack插件的调试，只要把插件放入webpack的plugins，就可以调试webpack插件：



注意事项：
    1.node和webpack的版本要对应，很多插件依赖于webpack，而webpack版本依赖于node版本；而且命令行中执行webpack命令，需要全局安装webpack-cli
    2.外部框架版本改动后，需要在webpack.config.dll.dev.js中添加对应的代码，然后再执行 npm run dll-dev  来打包最新的dll文件，这样在本地开发中才能看到最新的外部框架
        外部框架版本改动后，如果准备上线，首先要在webpack.config.dll.prod.js中添加对应的框架【注意，必须添加运行时框架，不要添加包含编译器的框架，那个太大了】
        再执行npm run prod打包之前，应该执行 npm run dll-prod 这个是打包dll文件用于线上引用，和dev的不同，dev环境下的dll文件是包含编译器的，太大

    3.运行dll的时候，在dev环境，要用到运行时版本，不然有些调试或者template的编译无法执行，会报错
      所以webpack.config.dll.dev.js里面需要添加resolve，给vue设置到包含有编译器的js
      同时webpack.config.dev.js里面也需要设置相同的resolve，这个很关键，否则虽然dll文件里用的是编译版本，但是在执行npm start的时候，运行的是webpack.config.dev.js里面的内容，它没有设置的话，运行的时候还是会因为没有vue的template而报错



devDependencies里面的插件，是在本地开发环境的时候才需要额外用到，而dependencies里面，是在准备打包上线的时候【npm run prod】需要用到的所有插件；
这样分离，是为了去服务端打包的时候，服务端需要重新安装package.json里面所有的插件来重构node_modules,所以这样分开可以节省时间；所以自己本地更新插件的时候必须用--save，来更新package.json
否则服务端根据package.json安装插件的时候和实际开发用到的插件不一致，就会报错。





//文件结构说明
build：本地打包服务启动相关的js文件/
dist：打包后的文件夹(这个文件一般不需要本地打包，cli会自动在服务器打包，所以这个文件夹不需要上传):这个只是本地打包产生的文件，
      执行webpack-dev-server的时候，把文件放在内存里，如果想看打包后的真实的文件结构，可以执行 npm run dev，就可以看到打包后的文件是啥鸟样了
      本地打包和压缩打包，都放在dist里面
      
mock：mock数据文件夹
src:开发目录
	app：具体的业务目录，里面每一个子文件夹代表一个页面
	common：所有页面的公共js，scss，图片，iconfont等
		pc：pc公共部分
		mc：移动端公共部分

	components：所有页面的公共组件
	libs：公共的js基础函数库
		device.js：设备环境判定
		ie8-hack-less.js:ie8的hack文件，只是hack了ie8常见的一些问题
		ie8-hack.js:ie8hack文件，文件比较大而完整，因为用了babel-polyfill
		react.js:window对象上注入react
		redux.js:window对象上注入redux
		urlMap.js:开发环境相关，local，qa，qa1，yz，prod；webapi相关
		util.js:url处理，cookie处理，date处理等
		validate.js：校验


.babelre：babel设置文件
.gitignore:git提交代码时候的设置文件，哪些文件不需要默认不提交
package.json:工程文件，里面包含了项目启动以来的插件，项目启动命令，项目简介等详细

webpack-assets.json:
	本地打包，一个页面会有一个js和css，格式是bundler-hash值.js/css ,这个静态资源文件需要发送到静态资源服务器；
	但是node端每个页面的js和css都是不带hash值的；所以需要这个文件来做mapping，替换node端的链接





//热替换说明：

//连html都是静态的纯前后端分离
1.如果是纯前端的站点，html文件也是自己用webpack-dev-server来生成，那么开发的时候文件产生变动，可以设置自动刷新html页面，不需要自己手动刷新
这种纯前端站点，连html文件都是静态生成放到cdn服务器上，在html生成的时候，所有和服务端有关的数据，都需要通过ajax来请求，当然一般也只有登录的auth数据，
因为数据都是ajax来获取的，所以相对来说安全性不会特别好，html文件的加载速度监控等各方面的数据，都会有点问题，所以这样的站点，一般都是公司内部的网站管理系统，是B端的站点。


//除了html，其他前后端彻底分离，打包生成前端的静态文件价包含【js,css,图片等静态数据】，这个文件夹如何引用，就无脑交给后端去集成，其实这里就有一个服务端动态数据放在html里面集成的问题，所以
  还是没有彻底分离，其实就是第2中没什么用，还是得用第3种，在服务端下独立前端文件夹，完成前后端联调，后端只用到dist文件夹下的打包好的数据文件
2.如果是C端的站点，那么一般页面都是服务端生成的，服务端还会在页面里添加各种初始数据，包括监控，权限等，这样的站点前后端也是分离的，但因为html生成是后端的，所以修改前端静态开发文件的时候
  是不能让后端html自己刷新的，资源文件其实已经更新了，但是html需要自己手动刷

//混合环境下的独立开发：迁徙的时候，也只要动项目的publicPath【在打包文件种的入口处修改】和统一的ajax的host前缀。
3.混合型，其实还是后端动态生成html，但有时候如果后端服务没做好【不一定是node】，前端开发依赖后端环境，那就很扯淡了，可以在dev环境动态创建静态html文件，文件结构就类似后端的html文件，内容几乎一摸一样
  这样后端没好的时候，前端照样可以进入开发阶段，而且还能实现热替换；如果后端部署完成了，就用后端启动html【如果后端恰好是node，直接用nodemon实现服务端自动刷新，开发更加顺畅】；
  如果后端已经提前部署好了【一般所有公司后端肯定已经部署好了，不然业务怎么运行？】，只要再后端文件夹下开一个前端静态文件夹作为前端项目，前端的所有业务和打包都在这里处理，包括html的生成；
  但是又一个问题，线上的html访问的都是其他文件夹里面后端html页面【这个html是动态生成的,不再自己的前端文件夹里面】，那后端的部署运行，就是后端要做的事情，后端工程师部署一次即可，和前端说页面如何运行起来；下次有新项目的时候，前端自己现在自己文件夹中开始开发，包括调试用mock数据，都不依赖后端，等后端有时间创建html文件了，再去前后端联调，在后端的开发环境中把数据走通；
  不过前端项目的文件结构已经要和后端一起确认好，因为后端服务获取前端静态数据，都是需要配置路径的；后端用到的路径，肯定有一段前缀是指定到前端文件夹的，把它设成publicPath，就完成了前端和后端路径的一致
  这样的情况下，如果后端要迁移，在后端api接口数据结构都不变的情况下【接口的host可以变，但是对应的api的路径不能动】，前端要和后端一起配合，
  前端只要修改统一的ajax的host地址，以及项目的publicPath【在打包文件种的入口处修改】；其他都毫无变化，项目打包，业务，都不需要改动。






//babel使用介绍： http://www.ruanyifeng.com/blog/2016/01/babel.html

命令：
	<!-- node: 输入node, 进入repl环境之后，可以直接运行javascsript表达式 -->
    <!-- babel：babel基础【注意，babel的7.0以上版本，名称变了，变差@babel】，直接用@babel/cli,@babel/core -->
    babel-node：babel-cli工具自带一个babel-node命令，提供一个支持ES6的REPL环境。它支持Node的REPL环境的所有功能，而且可以直接运行ES6代码


	@babel/cli: 安装好babel-cli后，可以直接通过babel命令来转码，前提是根目录一定要有.babelrc（babel用于命令行转码，使支持babel命令，可以单独执行babel命令转码）
	
	@babel/core：让babel支持对代码段进行转码，而不单单是js文件或者文件夹
	@babel/register 实际上为require加了一个钩子（hook），之后所有被 node 引用的 .es6、.es、.jsx 以及 .js 文件都会先被 Babel 转码。
    

	//babel转移转译代码的三个插件：babel-polyfill【大礼包，全都有，按照es6，7，支持到版本级别】，babel-runtime，babel-plugin-transform-runtime
	@babel/polyfill：因为Babel只会转换es6和es7的JavaScript语法，但是不会转换新的API，例如Generator，Iterator，Set、Maps、Proxy、Reflect、Symbol、Promise，
				    也不会转换一些全局对象上的方法，例如Object.assign，Array.from。而babel-polyfill，就是做这些事情的，只要在js头部添加import 'babel-polyfill'即可,pc下添加，移动端不添加
				    babel-polyfill这个文件非常大，好几百k，在多人大项目中，大家都用es6且方法都不固定，所以为了兼容的需要，用babel-polyfill；
				    但是如果是个人开发项目，自己用到的es6的方法就那么几个，拿直接用babel-plugin-transform-runtime这个插件，能减少非常多的代码
	
	@babel/runtime：部分babel/polyfill功能，自己手动加载；包含core-js 、regenerator等 poiiyfill插件，完成es6转es5，每个转换都需要自己设置，手动档，
					建议用“babel-plugin-transform-runtime”，他是在babel-runtime的基础上，使用了自动挡，也就是用了哪些es6语法，就会自动从babel-runtime中加载对应的代码块来兼容

    @babel/plugin-transform-runtime：babel-runtime的一个优化；多次使用函数会独立打成一个包；且有些es6设置兼容的时候，不会污染全局环境



    @babel/preset-react：让babel支持react的jsx转换es5，需要在.babelrc文件中设置，然后再对.js文件使用babel-loader；他依赖babel-loader和babel-preset-es2015
    @babel/preset-env：包含了下面所有，等价于babel-preset-latest，现在babel-preset-latest被babel-preset-env替换了，不用babel-preset-latest了
                       就是转译语法的同时，还增加了一个自动从babel/runtime库载入polyfill的功能

    babel最重要的几个插件介绍：https://blog.csdn.net/sinat_34056695/article/details/74452558
                                这个最重要：https://www.cnblogs.com/moqiutao/p/12980258.html


    大概介绍：preset只要是做语法转换，比如把react，es6，typescript等转成es5语法；es高版本转低版本，用babel-preset-env这一个就够了，react语法转es5用到babel/preset-react等，不一一列举
            stage-0....也是preset操作，因为es5到es6或者更高版本之间过度的时候，会有不同的阶段，所以不同阶段支持的新api数量多少有区别，stage-0支持所有，就是包含了后面所有的stage的语法
            babel-preset-env里面可以针对浏览器做语法兼容，还可以把useBuiltIns设置成usage来自动加载在js中用到的接口，不需要手动import

            polyfill就是针对除了语法之外的新函数的兼容，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，babel/polyfill非常大，全兼容这些语法，但是太大了
            babel/runtime相对较小，但是需要手动添加，所以需要在babel-preset-env中设置对应的useBuiltIns来实现自动加载，在babel中设置plugins: ['@babel/plugin-transform-runtime']
            
            babel/plugin-transform-runtime能去除polyfill的全局污染，同时把公告方法抽离出来

<!-- 	babel-preset-es2015：babel把es6转化成es5，需要这个插件支持
	babel-preset-es2016: 可以将es7的代码编译为es6 
	babel-preset-es2017: 可以将es8的代码编译为es7 
	babel-preset-latest: 支持现有所有ECMAScript版本的新特性
	babel-preset-stage-0：stage是一个阶段的意思，比如es6到es7之间，es7方案还没制定完，会在es6的基础上有stage-0-1-2-3等多个阶段，，因为es7还没出来，所以stage-0-1-2出现的是对es7的部分支持
                          但随着env环境的出现，里面有target和useBuiltIns基于浏览器的自动兼容，所以就不再需要stage-0之类的了，会自动支持
                          ”stage-0"是对ES7一些提案的支持，他里面包含了stage-1, stage-2以及stage-3的所有功能，
						  还支持transform-do-expressions和transform-function-bind
						  transform-do-expressions用于支持react中jsx支持if和else
						  babel-preset-stage-0只在本地编译时候用到，不会加载到js中去
						  一般也用不到

	babel-plugin-transform-decorators-legacy: 用于支持decorators，可以暂时不用
	babel-plugin-transform-es2015-modules-commonjs：装了这个插件，就可以单独支持es6的modules(import export)，一般安装了balel就可以，这个不用安装

	console-polyfill：为了代码中能转移console.log();
 -->

	jsencrypt：前端加密框架
	core-js：兼容es新版本新函数的代码库
	create-hmac：hma算法加密
	"css-loader": "^0.28.4",//处理css中的url（）等
	extract-text-webpack-plugin：项目的样式能不要被打包到js脚本中，单独抽离独立出来作为.css
	"es5-shim"：es5-sham依赖es5-shim，做的是es5-shim无法完成的任务；es5-shim就是让es5代码兼容es3，通常是为了支持ie8兼容才加载这个库，同时还差一个'es5-shim/es5-sham'，补充另外一些es5转es3的问题



//特别注意：
	1.有些插件是依赖python的，得安装python最新版本
	2.git命令行权限不够，需要用管理员权限打开cmd，才能安装和执行命令





package-lock.json的原理和意义






前端工程化，出现冲突的核心就三个，node版本，babel版本，webpack版本，webpack插件都依赖于webpack版本，webpack版本依赖于node版本；




//和webpack可能相关的插件

	"webpack": "^3.0.0",
    "babel-loader"：webpack使用这个插件，来完成babel对es6的转义
    "file-loader": "^0.11.2",
    "url-loader": "^0.5.9",
    "css-loader": "^0.28.4",
    "html-loader": "^0.5.1",
    "px2rem-loader": "^0.1.7",
    "sass-loader": "^6.0.6",
    "style-loader": "^0.18.2",
    "postcss-loader": "^2.1.5",
    "babel-loader": "^8.2.5",
    
    
    "node-sass": "^4.7.2",
    "copy-webpack-plugin": "^4.5.2"
    "autoprefixer": "^7.1.1",
    "postcss": "^6.0.22",
    


    "react": "^0.14.3",
    "react-dom": "^0.14.3",
    "react-redux": "^4.4.0",
    "redux": "^4.2.0",
    "redux-logger": "^3.0.6",
    "redux-thunk": "^2.4.1",
    
    

    "koa": "^1.2.0",
    "koa-cors": "^0.0.16",
    "koa-router": "^5.4.0",
    "koa-static": "^2.0.0",
    "koa-webpack-dev-middleware": "^1.2.1",
    "koa-webpack-hot-middleware": "^1.0.3"

    
    webpack5下，用MiniCssExtractPlugin代替"extract-text-webpack-plugin"  ExtractTextPlugin
    






//插件关联分类：

    //和node版本关联
    "babel": "^6.23.0",
    "babel-cli": "^6.3.17",
    "babel-core": "^6.0.0",
    "babel-plugin-transform-runtime": "^6.0.0",
    "babel-polyfill": "^6.13.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-es2015-loose": "^6.1.4",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-0": "^6.0.0",
    "babel-register": "^6.0.0",
    "babel-runtime": "^6.0.0",
    "console-polyfill": "^0.3.0",
    "core-js": "^2.5.5",
    "es5-shim": "^4.5.9",

    //基本不管node怎么变都不会变，因为是前端框架的nmp版本，以及系统的操作，node升级也会向千兼容，同时它们和webpack也没关系，所以下面这些是最好安装的
    "jsencrypt": "^3.0.0-rc.1",
    "create-hmac": "^1.1.7",
    "fastclick": "^1.0.6",
    "ip": "^1.1.3",
    "jquery": "^1.12.4",
    "js-base64": "^2.4.5",
    "zepto-webpack": "^1.2.1",
    "path": "^0.12.7",
    "yargs": "^4.7.1",
    "fs": "^0.0.2"




    //webpack未完成的内容：
    1.babel-preset-es2015弃用，直接使用babel-preset-env，可以代替babel-preset-es2015|2016|2017等所有版本，可以自己设置
    2.postcss支持












    服务端压缩：gzip，需要在html的header设置服务端输出的压缩类型，这样浏览器会获取到资源就能识别