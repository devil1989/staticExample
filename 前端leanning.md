1.自我介绍：制作和背诵
2.对方可能提问的问题
3.个人词汇和英语听力提升

webpack
    webpack的预加载：prefecth和preload【浏览器兼容问题，所以还是自己动态写异步加载比较好，就是用import或者require.ensure来实现模块异步加载】
    import(/* webpackPrefetch: true */ './path/to/LoginModal.js')//会生成 <link rel="prefetch" href="login-modal-chunk.js"> 并追加到页面头部：
    闲置时间预取 login-modal-chunk.js 文件只要父 chunk 完成加载，webpack 就会添加 prefetch hint(预取提示)
    preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
    preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
    preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。



    import或者require.ensure来实现模块异步加载：!!!!!!!!!!!
        由于 import() 会返回一个 promise，因此它可以和 async 函数一起使用。下面是如何通过 async 函数简化代码：
        async function getComponent() {
            const { default: _ } = await import('lodash');
            return data||{}
        }
        getComponent().then((data) => {
           加载了“lodash”模块后，继续写后面的逻辑
        });

        //在点击事件的收去异步加载模块，import返回的是一个promise，参数中可以获取到模块【如果import放在js头部，不用then，就是同步加载js模块】
        button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
         const print = module.default;
         print();
       });


    require.ensure用法：
        function getAsyncJs(callback){
            //如果里面的require是相同的，这个require.ensure不会再发请求；
            //里面所有的文件都单独打包
            require.ensure([],function(require){
                // require('util.js'); 
                require('../../components/login');
                require('../../components/article-edit');
                require('../../components/article-list');
                require('../../components/article-display');
                require('./components/regist');
                // require('./components/search-list');//搜寻列表
                
                if(callback){
                    callback();
                }
            });
        },

        使用的时候，直接getAsyncJs(callback函数)：这样callback函数就会在其他的异步js模块加载完成以后再执行


    提取页面公共模块：方法很多，下面2个方法都可以；方法1叠加“细分模块的懒加载”，可以很灵活地控制包的数量和每个包的大小和加载顺序【手动】；方法2可以自动划分包，防止重复；
        1.自己写common文件，然后在入口总手动添加公共js文件的入口，生成一个bound包，然后在所有页面的公共html上引入这个公共的js包，这个是自己手动灵活的方式；好处是灵活，坏处是需要自己手动抽离写到common文件中去
        2.添加公共模块插件设置，能自动提取出所有bound的公共模块和模块的分包；【从 webpack v4 开始，移除了 CommonsChunkPlugin，取而代之的是 optimization.splitChunks。】
            具体设置详见：https://webpack.docschina.org/plugins/split-chunks-plugin/#optimization-splitchunks
            可以把公共的模块提取出来避免重复加载，同时对于太大的js文件，会根据里面的import的不同js文件，来进行相应的拆包，比如有三个import的js文件，分别是a[100k],b[5k],c[1k];
            那么通过对最大包和最小包的大小设置和包的数量的设置，会把a单独打一个包，b和c合起来打一个包，满足每个包的大小要求和总体包的个数的要求
            optimization: {
                splitChunks: {
                    chunks: 'all'
                }
            }
        模块化最佳实践：所有的都要用到
            1.自定义common模块，放所有页面必须用到的公共js模块，并作为单独的js放到html里面【页面公共js】
            2.设置 optimization,因为有的时候每个页面都统一用到了某个业务模块，或者大多数页面用到了某个业务模块；所以得用optimization来进一步细化每个页面内的“模块数量”和“模块大小”进行限制；也就是“分包”或“代码分割”
            3.对于页面的懒加载模块和预加载模块，需要同时用import或require.ensure来异步加载对应的js模块：【webpack打包的时候把异步的js都打成了单独的js文件，请求服务器的时候也是请求这些单独的文件的缓存】







mobx管理react！！！！！！！！！！
node包开发，webpack插件开发！！！！！！！！！！！！！
git命令重新熟悉
typescript: javascript的一个超集，也就是在ts内写js完全没问题
    https://www.runoob.com/w3cnote/getting-started-with-typescript.html
    1.  类型批注，接口，类【es6】，extends继承
    2....

    后端传流文件，前端截断处理？？？？
    package.json devdepedence和depedence区别???？？？
    webpack的devServer设置跨域？？？

react-native


restfulapi含义：以http为基础，通过ajax+JSON实现交互，；url定位资源【URL中只能有名词而不能有动词】，get post等定位动作
fetch或axios的ajax库：自己写一个都可以，只是ajax而已

面向对象的三大概念、三种境界（封装，继承，多态）
封装：封装就是将数据或函数等集合在一个单元中（类）；用了类，成员函数与属性；使得代码模块化
继承：  继承可以复用以前人写的代码；js用原型继承；代码重用
多态：一个类或继承体系结构的基类与派生类中，用同名函数来实现各种不同的功能；为不同数据类型的实体提供统一的接口，说白了就是“参数类型，顺序，数量”不同，产生不同的行为：接口重用



JSBridge原理：通过JSBridge来实现H5和Native的通信，核心就是在native上开一个webview【内核是根据ios和android系统自带的webview来获取的】，通过native和webview的通信实现交互，这个JSBridge就是native和webview通信的桥梁
              一句话，JSBridge就是提供native接口给js调用，构建双向消息通道
              js在app上是运行在WebView 的 Webkit 引擎或JSCore上这个js的Context和app是隔离的；把它们之间的消息通信看成RPC（远程过程调用），前端看出客户端，native看出服务器

            1.JS调用native，有2中方式，注入API和拦截URL Scheme
                    1.1注入API的方式其实就是通过webview的开放接口，向JS Context注入对象或方法【原生方法】；js调用时（传入数据），就直接执行了native的方法（获得了js数据）；
                    1.2 URL SCHEME 是一种类似于url的链接，是为了方便app直接互相调用设计的，形式和普通的 url 近似，主要区别是 protocol 和 host 一般是自定义的。
                        例如：qunarhy://hy/url?url=ymfe.tech；其中protocol 是 qunarhy，host 则是 hy。
                        具体的流程就是webview端通过iframe.src等方式修改url，native自动拦截到请求，根据URL Scheme（包括参数）获得对应的数据，进行操作
                        scheme的参数对应native的方法，scheme变了，就执行对应的方法；
                        推荐注入API的方式调用Native的原始方法
            2.Native调用js：
                    用到就是类似JSONP机制，就是JS调用原始方法以后，传入了callback函数；native根据js提供的数据执行后得到返回data，同时之前传入的参数中也有callback；
                    直接自动生成一个唯一的 ResponseId，并存储句柄，然后和 data 一起发送给前端【就是<script>callbackName(data)</script>】，前端接收到这个callback函数【就是句柄】和对应的数据，直接就执行了。

IP代理原理：【有专门的ip代理商】
    代理服务器的工作机制与生活中的代理商相似；假设一台机器为A机，想获得由B机提供的数据，代理服务器为C机，那么具体的连接过程是这样的：首先，当A机需要B机的数据时，它会与C机建立连接，
    C机接收到A机的数据请求后，会与B机建立连接，下载A机所请求的B机上的数据到本地，再将此数据发送至A机，此时即可完成代理任务。



爬虫+node后端，是一种很好的商业模式，不是UGC，而是爬虫产生数据，然后自动展现到自己的网站上！！！！！！！！！！
常见的爬虫网站：百度和360等搜索网站，导航网站，今日头条等新闻网站，其实就是信息集合类网站，核心是爬虫如何写，完全不需要注册登录等模块，只负责信息的聚合展示
这两年火热的今日头条就是典型案例，不太严谨的说，今日头条核心就是做了三件事——
    把网络上所有的资讯文章，以及用户在社交网站上的数据爬取下来。
    把这些数据进行分类打标签，进行一一对应。
    将拥有同类标签的文章和用户进行匹配。

写爬虫不一定要用python，用js在node端也可以写爬虫：https://blog.csdn.net/qingshandaijason/article/details/116145395 ：
    简单的node搜索引擎【知乎的数据都是用node爬取的】：
        https://blog.csdn.net/qingshandaijason/article/details/116145395
        https://www.cnblogs.com/coco1s/p/4954063.html
    核心原理：
        1.写好前端页面，有input输入框等，所有搜索框
        2.点击搜索后，发送ajax请求到node端，node端通过request插件来模拟发送http请求，就是类似前端的ajax请求之类的http请求，请求类型和type之类的http头自己设置，url之类的也自己设置；
    npm i request ：发送请求的npm包
    npm i cheerio ：筛选网页信息【解析页面用的是cheerio，全兼容jQuery语法】
    npm i iconv-lite ：多种类型字符串（包括gbk，utf8）的编码与解码。
    npm i data-utils ：



前端相关：
    1.前端工程化：webpack，vite，grunt，gulp等工程化打包工具

    2.前端Framework[框架]，一般涉及到DOM，Event,Template,数据绑定等，常见的框架有React，Vue ，Angular，Backbone，Knockout，jQuery等

    3.Css相关：CSS的预处理器【Sass Less等】，css后处理器【例如autoprefixer，一般在post-css插件中用到】；css的reset；css的框架BootStrap和tailwindcss。同时包括css最最基本的选择器和属性以及最新的css3等

    4.HTML相关，HTML常用标签，以及HTML5的新标签【canvas，audio，video，header,footer,nav,article,aside等】；同时jsx语法也需要关注【react就用jsx来写】

    5.ECMAScript相关，例如ES3 ，ES5，ES6等各个版本，以及相关的polyfill工具【babel】；这里还有注意，有的项目以及用typeSctipt来写了，它是js的超集；

    6.前端Library的方法库：就是常用的js方法，不如cookie，ajax，数据类型处理相关的库，例如underscore或http请求相关的库axios等；

    7.前端Library的通用UI组件库：ant-design;antd-vue等第三方关于React或Vue的库；react-bootstrap和bootstrap-vue；jQuery UI等，这些是通用组件的UI库，

    8.前端Library的专业图形库：专门做图形展示，例如D3 ，Echart,antV等，同时echart还有对应vue和react的版本，分别是v-chart和echarts-for-react；其中d3是基于svg，兼容ie6+;echart是基于canvas，兼容ie9+；antv是蚂蚁金服的一个专业的图形库，里面有G2Plot,Graphin,XFlow,F2|F6|F2Native等分支，做各自擅长的领域

    9.DOM，BOM，ECMAScript相关知识：这个是js基础，包括数据类型，语法等，自己可以查“权威指南或小红书”看

    10.npm包和webpck插件的开发，这个是node包开发的东西

    11.小程序相关：微信小程序，支付宝小程序等，这些基本只用到了Js的ECMAScript语法；

    12.node后端：就是node后端的第三方库，V8引擎，LIBUV等这些node基础的东西，以及后端的数据库【mongodb，sql server，mySql，oracle等】，后端安全【csrf,xss，ssrf，sql注入，重播攻击，http劫持，dns劫持，ddos，文件上传安全等】，并发【多线程（worker_threads 模块），多进程（cluster 模块），事务的隔离界别，加锁】，服务器集群【负载均衡】，数据库集群和分片，服务器监控，node后端框架【koa，express】，http各个版本以及https相关，数据加密等等非常多的后端相关的东西。

    13.桌面应用：electron框架

    14.移动端小游戏：例如微信小游戏，如果选择cocos Creator游戏引擎开发，就可以用js这门语言来写微信小游戏，当然这个cocos Creator游戏引擎是基于webgl


第三方图形库：D3,echart，antv
        antv：移动端和PC端不同，而Echart基本都一样，只要自己做一些特殊的处理即可
            G2：可视化引擎：例如柱状图，折线图，阶梯，面积等，这个是最常用的，兼容IE9+
            G2Plot：图表库

            G6 : 图可视化引擎：关系数据可视化方案，树状
            Graphin：基于G6的图分析组件

            X6:极易定制、开箱即用、数据驱动的图编辑引擎：用于制作“思维导图，流程图”
            XFlow:基于X6,面向React的解决方案

            F2|F6|F2Native ：移动可视化方案！！！
            ChartCube：AntV 图表在线制作
            L7|L7plot：地理空间数据可视化

        D3:基于SVG，兼容到ie6，适合dom交互较多的内容，可以自定义事件，D3和Echart区别其实就是svg和canvas区别，d3用svg，echart用canvas；D3库直接在vue或react项目中使用
        echart【大多数都是图像展示，用echart就可以了】：图表展示，封装好的方法直接调用；兼容到ie6以及以上的所有主流浏览器；echarts通过canvas来绘制图形，依赖分辨率，兼容IE9
        v-chart：基于“vue2.0和echart”的图形库
        echarts-for-react：基于“react和echart”的图形库


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

	前端开发的时候，不要去写注释，因为中文和英文切换很花费时间，而且写注释也费时间；高手都是函数命名语义化，完全不需要写注释，等这一块功能全部开发完，再写注释
	

	代码自动折叠到第2层：ctrl+shift+x；crlt+shift+数字【自动折叠刀第几层】

	属性简写{val:25,age,name}等价于{val:25,age:age,name:name}


前端测试框架：
    ！！！！！只要用jest就可以了，测似框架使用非常简单！！！！！！
    0.Jest：Github上排名第一的测试框架；Jest具有简洁清晰的用户界面，以及高效的加载性能。在默认情况下，它能够与探查(spying)及模拟(mocking)程序一起，构建出与测试相关的全局变量
    1.Jasmine：Jasmine是Angular建议开发人员广泛使用的、最为流行的前端测试框架之一
    2.Karma：最适合在浏览器、或类似浏览器的环境中运行测试框架
    3.QUnit 【主要对于jquery】    


https://developer.aliyun.com/article/1050432
前端性能优化：lighthouse模块【npm install -g lighthouse 然后执行lighthouse 网站地址，就可以看到网站整体性能评估】【chrome插件自带这个功能】；同时chrome调试器的“网络”+“性能”模块，是可以观察站点的表现
        lighthouse：Performance；Accessibility ；Best Practices；SEO
        1.https://blog.csdn.net/c11073138/article/details/84700482
        2.浏览器的lighthouse包含如下指标：Performance；Accessibility（可访问性）；Best Practices；SEO等；

            “性能”tab上可以查看下列指标
            2.0 FP（First Paint），表示渲染出第一个像素点。FP一般在HTML解析完成或者解析一部分时候触发。
            2.1 FCP（首屏绘制）
            2.2 LCP（用于度量视口中最大的内容元素何时可见）”；
            2.3 可以查看“加载，渲染，绘制，js执行”时间
            2.4 有个时间瀑布，可以查看每个文件加载的具体时间【点击那个文件，还可以查看对于的网络等待时间，传输时间】
            
            “网络”tab上可以看其他指标
            1.加载的时间瀑布，
            2.DOMContentLoaded，load时间

前端内存泄露：
        2.在Class filter(类过滤器)文本框中输入Detached可以搜索分离的DOM树
        3.“堆快照”分析内存泄露：简单的分析是否内存泄露，比如登录操作是否内存泄露：
            3.1先登陆，然后内存，最上面有个垃圾回收站，表示清理内存，登录之前清理内存，然后登录再清理内存，看内存多少；
            3.2然后退出登录，再登录，清除内存，再看堆快照的内存；反复多次，如果内存越来越大，那就是登录操作有内存泄露
        4.“Allocation instrumentation on timeline”时间轴上的分配插桩 ：这个是最常用的判断内存泄露的方法，点击开始，然后进行各种操作，看蓝柱，蓝柱表示当前的内存占用，随着时间向后退役，之气操作的蓝柱子越来越小最后没了【变灰】
                                                                    就可以判断之前的这个操作没有泄露内存，少量蓝柱剩余也没关系，如果“某个行为”产生的蓝柱，没有随着时间的推移而大幅减少，那么就有内存泄露
                                                                    如果某个行为反复操作后，每次操作后随着时间的推迟仍然都蓝柱子残留，那就说明每次这个操作都会有内存产生，就可莪能是内存泄露
                                                                    这个时候就可以选择区间【把这个蓝柱包含进去】，在下面的构造函数内就可以看到是那些“构造函数”占用了内存，
                                                                    这个时候可以查看构造函数，函数的内存大小有2个：
                                                                        “Shallow size”【浅层大小】：对象的直接内存总数，直接内存是指对象自身占用的内存大小
                                                                        “Retained size”【保留的大小】：对象的最大保留内存，保留内存是指对象被删除后可以释放的那部分内存；就是对象删了以后，和依赖他的也会被删，一共能腾出多大内存



1.页面卸载（unload事件，safari下用pageshow 和 pagehide 事件来替代）的时候发送ajax，如何保证条跳转之前ajax请求能成功发送【因为页面跳转的时候，如果ajax还没发送数据或发送一半，就会被自动取消】：
    navigator.sendBeacon(url,data);浏览器将少量数据 异步 传输到 Web 服务器，就算tab页面关闭，也会成功发送，同时还不会阻塞页面跳转【他是把发送数据的这个功能交给了浏览器内部，不依赖于当前的tab】
    该方法主要用于满足统计和诊断代码的需要，一般再unload事件之前触发
    如果用较老的方法来实现页面卸载之前把ajax成功发送，一般就是发送同步的ajax，这样就会产生一个阻塞页面跳转或者关闭的问题，而且有的浏览器不支持这么做。
    同时有一点移动端的兼容性的问题要注意，例如在 iOS Safari 上对于页面导航的前进和后退做了优化，load 和 unload以及beforeunload 事件不会触发， Apple 官方文档建议使用 pageshow 和 pagehide 事件来替代。
    就是判断 onpagehide in window是否为true //onpagehide 事件在用户离开网页时触发。




cookie默认时间是多少：默认设置session cookie，关闭tab就会自动删除

React： 直接看一遍redux_demo里面的注释即可，下面是redux和vuex的数据管理的异同点
	1.redux同步异步是都是store.dispatch(actionCreate函数)，因为是函数，而且这个函数又是通过 store.dispatch((function (){ return actionCreate函数})(param))这种方式来调用actionCreate函数的，非常不直观
	  redux只是把store.dispatch改造了一下，让他可以接受函数，而最原始的dispatch则放在action.js里面的函数里面作为形参，最终还是通过最原始的那个dispatch来执行对应的行为，跳转到mutation
	  vuex异步是用store.dispatch({"actionName":param})的方式，直接跳转action.js里面对应的actionName的函数，最终还是调用的commit函数，非常直观；同步的话用store.commit({"actionName":param}),函数名称不同，参数都是一样的
	  所以vuex的commit函数和redux里面没有改造过的dispatch函数是一样的【不是redux的store.dispatch,这个函数已经被redux改造过了】；
	2.redux使用store.dispatch后，通过action的类型，自动跳转到对于的reduce，这个reduce是唯一能改变state的地方，action类型放在action.js中，表示执行某种行为，同时流程会自动跳转到reduce，通过reduce来修改state
		而vuex在store.commit或dispatch后，跳转到对应的mutation函数执行，修改state，也就是说，mutation是函数，和reduce类似，
		redux因为多了一个actionType数组，在reduce里面，可以按照组件名称来细化，就是把action的类型分别放到各自的组件名称下面，其实最终还是一样的，调用的时候会把所有的“action类型”全部匹配一边，找到匹配的action名称
	4.vuex中所有的state属性通过getter来访问，把getter赋值给组件computed属性中；
		而redux管理state，如何访问，？？？？？？？？？？？？？？？？，上班之前写一个React的小项目
		目前猜测是在store.js中传入初始化的state后，入口组件【最外层统一的大组件】把state通过ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Container)的方式把state中的属性一一映射到props
		也就是把已经通过Object.defineProperties监控的初始化state对象传入到最外层组件中，然后把所有state属性传递给props，这样，props一旦修改，其实就是被监控的state修改了，自动触发UI更新
		而state属性同时通过this.props来访问，通过store.dispatch来修改

网络访问流程：https://blog.csdn.net/jun2016425/article/details/81506353
	1.首先得知道物理层【为数据段设备（电脑）提供bit流数据的传输通路】，网络层【ip，icmp，igmp】,传输层【tcp，udp】，传输层【TLS|SSL（可选）】，【应用层http，ftp】
	1.本地输入网址，浏览器发送请求到附近的dns服务器【中间协议的具体操作不详细说】，查找站点对应的ip地址，这个就是dns域名解析的过程
	2.dns解析正确，最终传送到了对应的ip的网站[通过tcp或udp协议传输]，数据传送大数据库服务器，数据库服务器应用层能接受并解析http协议，然后从应用层返回数据给物理层，物理层又是重新通过网络层[ip]到传输层[tcp，udp]，
	  最终到达用户客户端这个应用层【http，tcp】
	3.浏览器接收到返回的数据，如果是https协议，那么会验证安全性，否则就直接接受http请求的数据包展示了；

https防止dns劫持和http劫持的原理：https://blog.csdn.net/ahou2468/article/details/108368246
    0.总结起来一句话，证书保证站点正确性，非对称加密保证“对称加密密钥的安全性”，对称加密保证数据传输不被看到；加密和先hash后加密的数据一起发送保证数据不被篡改
    1.浏览器向服务器发送请求，这个请求里面包含当前浏览器支持的加密算法【密钥算法套件】发给服务器
    2.服务器接受浏览器支持的加密算法后，看服务器上是否有与之匹配的加密算法，如果没有的话，就断开，有的话，就生成RSA非对称加密的公钥私钥，
        然后向客户断返回公钥【公钥里面包含“加密算法+网站ca证书【域名，ip，颁发机构，有效期等信息】”】，公钥是对这些信息使用hash加密产生的一个字符串，把公钥和hash算法传给客户端；
    3.客户端获取公钥和hash算法名称，hash算法就是客户端和服务器商定的“对称加密”的方法，同时通过对公钥的验证，获取网站的证书相关的信息，包括域名，ip，颁发时间，有效时间，颁发机构等信息；
      客户端验证“证书”的"颁发机构，ip地址等信息"，证书ip和访问网站的ip是否一致，办法机构是否合法等做验证，保证访问网站的合法性，排除dns劫持。到这里网站安全验证就结束了，接下来就是数据传输安全了
      客户端生成随机字符串，然后用公钥对随机字符串进行加密，保证这个随机字符串的安全，因为它要作为对称加密的密钥，一旦泄露就完了，所以只能是客户端和服务器才能看到，中间传输不能被其他人看到，所以要对他进行非对称加密。
      根据握手信息和服务端商定的hash算法【加密】，先对要发送的信息进行hash；然后用客户端生成“随机字符串”(这个随机字符串就是“对称加密”的密钥)对“hash内容”和没被hash的内容进行加密；
      最后把三份内容传给服务端：1.被公钥加密好的“随机字符串”；2.被随机字符串对称加密过的“原版传送内容” 3.先被hash再被“随机字符串”对称加密过的信息
                            非对称加密保证“随机字符串”密钥的安全；随机字符串进行对称加密保证数据的安全；额外传送了一份先被hash后对称加密的内容，用来验证防止数据被篡改【hash虽然不是加密，但hash可以防止被篡改】

    4.服务端接受到数据，先用私钥解密获得“随机字符串”【其实就是客户端传过来的对称加密的密钥】；然后用这个密钥去解密内容，得到一份原始数据，一份hash过的数据，然后把原始数据hash以下，看数据内容是否一致，防止数据被篡改。
      服务端完成验证然后处理完数据后，仍然使用原来的"随机字符串“，对“返回信息和返回的HASH值”进行加密，然后发送给客户端；
    5.客户端接收到数据后，用原来的"随机字符串"进行解密；再对比hash看数据是否被篡改，验证通过后，就是握手完成

前端，dns，服务器缓存策略：不同的操作【刷新，强制刷新，浏览器back返回等】，服务器可以设置不同的缓存策列？？？？？？？？？unfinish
	//一般的静态资源，都是结果下面几步
	1.本地缓存【expires头或cache-control的max-age】
	2.本地缓存过期就304缓存，就是向服务器发送请求，服务器发现没过期，就返回一个304，告诉你文件没修改，可以继续使用本地的缓存【last-modify或etag,目前基本用etag】
	3.如果服务器校验发现文件有修改，就直接返回最新的文件


计算机网络OSI模型【七层】：详见koa-node中的“OSI模型.png”,物理层【bit】,链路层【帧】，网络层【ip：包】，传输层【tcp，udp:segment，数据段】，会话层，表示层，应用层【http：消息，数据流，帧】
一般只需要记住：物理层【为数据段设备（电脑）提供bit流数据的传输通路】，网络层【ip】,传输层【tcp，udp】，应用层【http，ftp】
所谓的HTTPS，其实就是在“传输层【tcp】和应用层【http】之间，插入了SSL或TLS协议，但是这个不能放在OSI模型中，如果硬要放在OSI模型中，那么SSL或TLS应该算"会话层"

tcp协议：https://baike.so.com/doc/3381795-3560087.html 【tcp四元组确定tcp连接唯一性：本机IP，本机端口 ；服务器ip 服务器端口；】；
            建立一个连接需要三次握手，而终止一个连接要经过四次握手
            应用层向TCP层发送用于网间传输的、用8位字节表示的数据流，然后TCP把数据流分割成适当长度的报文段（通常受该计算机连接的网络的数据链路层的最大传送单元（MTU）的限制）。
            之后TCP把结果包传给IP层，由它来通过网络将包传送给接收端实体的TCP层
            端口范围：0 - 65535；一般1024 - 5000是临时端口，其他端口是固定给其他机器用的


缓存相关：数据库缓存，cdn缓存【中间商，比如某个公司在上海，成都，海南都有cdn服务器，它们只是一个中间存储资源的机器】，代理服务器缓存，浏览器缓存

css ,图片，js等，都是http请求，http2.0之前，一个域名下的tcp通道里面的http请求都是串行，但是可以开启多个tcp，所以就有了“单域名”下资源的并行下载【一般是6个tcp】；多域名让tcp连接数增多
HTTP/1.1中，单个TCP连接，在同一时间只能处理一个http请求；但是可以并发多个tcp，一般是6个tcp；下载资源是并发的，js下载完以后解析和执行不会阻塞之前的tcp下载，但是却会阻塞之后的资源下载
因为后面的资源下载之前，是需要先解析dom元素，然后再建立tcp连接的，而js执行会直接阻塞页面的渲染


https://blog.csdn.net/wu_xianqiang/article/details/105837869
关于浏览器的线程，dom解析和“js的下载，解析和执行”互斥【核心是：js的加载，解析，执行这个一个流程都会阻塞页面接下来的DOM解析和页面渲染】【阻塞了dom解析，自然就阻塞了dom渲染】
1.加载html，顺序解析html标签，DOM
2.DOM解析后出现节点，通过tcp加载资源【tcp并行】，但是因为解析的时候顺序解析，所以一旦遇到解析的dom下载js，线程就会被js阻塞，后面就无法继续解析了，后面的连接也就无法并行了；遇到js之前，图片和css都是并行下载和解析的
3.解析dom，cssom有各自的线程；不会相互阻塞，各自解析，但是cssom解析会阻塞后面的js执行，所以也就阻塞了页面


http升级流程如下：
	1.目前网上很少用http1.1，这个算比较老的版本了，大多数都是https或http2.0【2.0是基于https的】；HTTP2.0 支持明文 HTTP 传输，而 HTTP2.0中使用的升级版的SPDY 强制使用 HTTPS
	2.先把http1.1升级https【用http1.1】，也就是在tcp和http1.1之间，添加了ssl或TLS协议，完成http升级https改造
	3.然后可以在https的基础上升级到http2.0【因为http2.0只支持https，不支持http，所以要升级2.0必须先升级到https】，目前主流电商网站基本都支持http2了
	4.目前绝大多数互联网公司都完成了https的升级【https2上只支持https，不支持http】，如果有需要，仍然可以在node端开启原来的http服务，不过一般都不用了
	5.高版本浏览器都是向下兼容的，所以一个网站如果不支持https，输入网址的时候就会自动用http协议


http的各个版本：对于一个域名，浏览器一般允许链接多个tcp请求【但是有上限，chrome是6个tcp连接（断开的tcp连接就不算了，断开了就是没了）】，一个tcp连接允许并行多个http请求【http2.0】，一个http请求就是一个流；一个流里面包含多个帧
	
	http各个版本，以及https等关于协议的传输流程，详见koa-node站点下的http-https.png,详细连接是https://www.51cto.com/article/612101.html

    请求头和响应头具体信息：https://www.cnblogs.com/honghong87/articles/6941436.html

    http请求头：
        ！！！Accept：text/plain [可接受的相应内容，和响应头里面的content-type对应]
        ！！！Content-Type：请求体的MIME类型 （用于POST和PUT请求中） application/x-www-form-url  (get请求)； application/x-www-form-urlencoded （普通post请求）; multipart/form-data 【文件上传的post请求用到】
        ！！！Cache-Control:缓存机制public private no-cache no-store max-age 其实这个是服务端设置的，前端这边不设置
        ！！！Connection：连接方式【keep-alive:启动长连接；close:关闭长连接】
        Accept-Charset：utf-8【可接受的字符集】
        Accept-Encodeing:gzip, deflate [默认值：可接受的返回包的编码方式，gzip编码方式是压缩的编码]
        Authrization：验证消息，一般这个头存放的是 token，现在的登录态token基本放再cookie里面了；这个基本不用
        Cookie：
        Host：服务器的域名以及服务器所监听的端口号，写端口就是默认80端口；例如：www.itbilu.com  ：域名+端口
        Origin：发起一个针对跨域资源共享的请求（该请求要求服务器在响应中加入一个Access-Control-Allow-Origin的消息头，表示访问控制所允许的来源）。 协议+域名+端口【这个需要自己设置！！！！！】
        Referer：页面从哪个其他页面跳转过来的
        User-Agent：客户端信息

        //简单请求
        $.ajax({
            url:'http://ajax2.com:8888/index',
            type:'POST',
            data:{'k1':'v1'},
            success:function(arg){ console.log(arg); },
        });

        //非简单请求
        $.ajax({
            url:"",
            type:"put",
            data:{},
            headers:{"h1":''},
            xhrFields:{withCredentials:'true'},//如果ajax需要带上需要cookie，就需要添加 withCredentials；其实核心就是设置xhr.withCredentials=true;
            success:function(){}
        })
        

    http响应头： 关于缓存，就是先判断本地缓存机制【4种不同的行为对应的不同cache-control有不同的本地缓存机制；本地缓存过去后，接下来就是服务端的etag或者last-modified缓存机制】

        Access-Control-Allow-Origin：那些域名可以跨域源资源共享
        Cache-Control【缓存相关】：默认是private；服务端的缓存设置
                        max-age:缓存多久【这个和public是不冲突的，把cache-control设置为"public, max-age=3600"】，个人估计max-age时间是否过期，时把当前的时间和http请求的Date头的时间做差，看是否大于max-age的值
                        public:结果所有路径，都可以缓存数据【非重要数据】
                        private：发起请求的浏览器才能使用返回数据的缓存【私密数据】
                        no-store：浏览器和其他中间缓存（如 CDN）从不存储文件的任何版本

                        no-cache:浏览器每次使用 URL 的缓存版本之前都必须与服务器重新验证【也就是不走本地缓存，去服务器判断文件是否变更，如果没有变更（两个Last-Modified相同），那么仍然会返回304，让浏览器从本地缓存获取文件】
                        设置max-age后，浏览器发送这个请求的正确流程是：
                                    1.本地缓存头max-age是否过期，没过期直接走本地缓存
                                    2.过期了直接请求服务器，服务器那边判断文件是否更新；这个涉及到当前文件的Last-Modified和服务器文件的Last-Modified或者eTag，etag优先级高于Last-Modified
                                        如果两个时间相等，那就说明文件没有更新过，服务器会返回304，告诉客户端文件还是最新的，客户端最后仍然从缓存获取请求的文件
                                    3.如果Etag相同就是没过期，或者两个Last-Modified时间相同，那就是没更新了；否则就服务端重新传输文件，并返回200，浏览器接受文件后把最新的文件缓存下来覆盖原来的文件。

                        浏览器不同的行为对应的cache-control：新窗口，刷新，回退，地址按enter键：
                            详见：https://baike.so.com/doc/4806790-5023130.html

                            1.刷新：全部重新访问服务器【所以这个时候服务器返还304来提高性能就非常重要了，etag来判断文件是否有变更】那么在此值内的时间里就不会重新访问服务器
                            2.打开新窗口【偏刷新，max-age不影响】：除了public和“max-age未过期”会取缓存，其他都是重新请求；！！！！！
                            3.浏览器enter：太多了，不记了
                            4.返回【偏缓存，max-age不影响】：no-cache/no-store直接请求服务,max-age过期也请求服务，其他都不会重新访问服务器，直接从缓存获取

        ETag[缓存相关：服务器发送给客户端的HTTP请求头标签]：请求文件的资源标识符，用于和服务器做对比，看资源文件是否改变，和last-Modified的目的时一样的，都是为了判断资源文件是否改变
                        etag经常和“If-None-Match或者If-Match”头一起使用,http1.1添加的，优于last-modified
                        当你第一次发起HTTP请求时，服务器会返回一个Etag;并在你第二次发起同一个请求时，客户端会同时发送一个If-None-Match(浏览器自动添加)，而它的值就是Etag的值
                        服务器会比对这个客服端发送过来的Etag是否与服务器的相同，如果相同，就将If-None-Match的值设为false，返回状态为304，客户端继续使用本地缓存，不解析服务器返回的数据
                        如果不相同，就将If-None-Match的值设为true，返回状态为200，客户端重新解析服务器返回的数据
                        ETag 实体标签: 一般为资源实体的哈希值；且Etag的优先级高于Last-Modified。


        //Last-Modified[缓存相关：也可以直接放弃，都用etag；服务器发送给客户端的HTTP请求头标签]：请求的对象最后的修改时间，只能精确到秒；它经常和If-Modified-Since一起使用
                                                                 If-Modified-Since是浏览器发给服务端的请求头，
                                                                 客户端第二次请求此URL时，根据 HTTP 协议的规定，浏览器会向服务器传送 If-Modified-Since 报头，询问该时间之后文件是否有被修改过
                                                                 所以它是浏览器自动添加的，和Last-Modified配套使用的请求头

        //Expires【缓存相关：直接放弃不看，要用也用cache-control的max-age】：过期时间：有缺陷，“要求服务器与客户端的时钟保持严格的同步”，max-age优先级高于Expires

        Content-Encoding：资源编码
        Content-Language：响应资源的语言
        Content-Type：当前内容的MIME类型
        
        Date：消息发送时的日期；
        
        Set-Cookie：设置HTTP cookie ；例如“Set-Cookie:UserID=itbilu; Max-Age=3600; Version=1”
        Status：返回状态码，200表示成功

        Refresh：用于重定向，或者当一个新的资源被创建时。默认会在5秒后刷新重定向。
        Server：服务器名称
        
        //安全头相关，用helmet插件来完成：https://www.jianshu.com/p/f7b5b7d91238
        X-Frame-Options：防止自己的网站被插入到其他网站里面，然后被点击劫持；设置SAMEORIGIN
        X-Content-Type-Options：则 script 和 styleSheet 元素会拒绝包含错误的 MIME 类型的响应。这是一种安全功能，有助于防止基于 MIME 类型混淆的攻击。设置nosniff
        X-DNS-Prefetch-Control：dns预解析，它可以增加 5% 或更高的图片加载速度；如果关闭就没有了，默认off是设置关闭的，如果你希望通过它提升性能，可以在调用 helmet() 时传入 { dnsPrefetchControl: { allow: true }} 开启 DNS 预读取。
        X-XSS-Protection：浏览器的XSS防护机制，设置“1; mode=block”就表示“如果检测到恶意代码，在不渲染恶意代码”；设置“1; mode=block”就表示
        X-Download-Options：这个 header 仅用于保护你的应用免受老版 IE 漏洞的困扰。一般来说，如果你部署了不能被信任的 HTTP 文件用于下载，用户可以直接打开这些文件（而不需要先保存到硬盘去）并且可以直接在你 app 的上下文中执行。
        Strict-Transport-Security：如果用户一旦访问了带有此 header 的 HTTPS 网站，浏览器就会确保将来再次访问次网站时不允许使用 HTTP 进行通信。此功能有助于防范中间人攻击。


	http1.0:一个tcp里面只能有一个http请求和响应；一个域名可以开启多个tcp连接，但是不多，chrome是6个；每个tcp连接里面的http请求是串行
		1.队头阻塞：当顺序发送的请求序列中的一个请求因为某种原因被阻塞时，在后面排队的所有请求也一并被阻塞，会导致客户端迟迟收不到数据。 
		解决方案：将同一页面的资源分散到不同域名下，提升连接上限。在一个tcp连接中所有请求是串行的，在当前的请求没有结束之前，其他的请求只能处于阻塞状态
		2.传输内容不加密：容易被篡改 ：
						DNS劫持：请求网站A，但是返回给你的是网站B；dns服务器把ip和域名的mapping做修改把你多请求的域名对应到其他站点的ip上，实在dns服务器上做手脚；
								一般而言，用户上网的DNS服务器都是运营商分配的，所以，在这个节点上，运营商可以为所欲为，直接dns劫持；
						http劫持：传输层中有许多种协议，首先在tcp连接中找出http连接【如何筛选出】，然后通过网关来获取数据包进行http响应体，因为http没有加密，所以插入广告就是最简单的形式，是在网关上截取数据做手脚。
								  最后抢先发包，篡改后的数据包抢先“正常站点返回的数据包”，抢先返回到客户端浏览器，那么后到的真实的数据包就会被直接丢弃，因为前面已经有人抢先返回了
								  对于普通网民来说，网关和dns服务器都在运营商那边，网关和dns服务器可以是同一个ip，也可以是不同的ip，就看是否选同一个运营商
								  技术难点：
								  		1.如何筛选抓到http请求包，本地可以通过fiddler抓包；那么数据传输的中间节点，如何抓包，是在哪个机器上抓包
								  		2.抓完包以后，进行数据篡改很容易，但是如何返回给客户端浏览器，因为客户端浏览器肯定会有校验，tcp本身就有三次握手协议

	
	http1.1:谷歌提出的
		SPDY：主要是“长连接”【请求资源请求适合用长连接，默认基本都是长连接】和Etag
			1. 长连接：Connection:keep-alive = true，因为tcp三次握手有时候太麻烦【http是基于tcp协议的】，短时间内经常交换数据，用长连接更为高效
                    使用场景，一般默认都是用长连接，偶尔用的ajax可以不设置长连接；长连接的好处是，比如js，css,图片等静态资源，如果每次都用tcp三次握手，那就建立一次tcp连接就需要三次握手，
                    一个http建一次tcp连接，这样很费事；如果改成长连接，那么一个tcp内就可以串联多个http请求，不需要再频繁断开了；
                    可以再http的header中设置长连接时效，比如1分钟之内，tcp连接里面没有发送http请求，那么就自动断开。这样避免产生大量的tcp连接，因为一个域名下的tcp连接是有限的
                    
			2. 节约带宽：支持只发送header信息（不带任何body信息）；比如401返回客户没有访问权限，压根就不需要body，支持不发送body信息就节省带宽；
						允许请求某个自由的某一部分，虽然不支持“断点续传”，但它是“断点续传”的基础。
			3. 添加了部分错误状态码例如409（confilct）：请求资源和当前资源冲突
			4. 添加了部分缓存策略，例如Entity tag，If-Unmodified-Since, If-Match, If-None-Match等更多可供选择的缓存头来控制缓存策略等缓存策列
			  

	http2.0:
		基于SPDY：2015年3月份百度开始率先支持HTTPS，但不支持SPDY。下半年阿里的淘宝和天猫也开始支持HTTPS，同时支持SPDY3.1。
		添加的东西有：
			0.多路复用【一个tcp连接上允许多个流并发，一个流里面有多个帧】，允许在一个连接上无限制并发流；解决了“队头阻塞”问题，
				多路复用【解决串行的文件传输和连接数过多】：一个域名对应一个tcp连接，
						连接【connection】：就是一个tcp连接，里面可以并发多个流，就是“多路复用”
						流【stream】：一个流代表一个完整的http请求[包括http请求+服务器响应]，虚拟信道，可以承载双向消息，多路复用就是一个tcp连接可以并发多个流，也就是并发多个http请求，但是并发请求数量不同浏览器都会有限制
						消息【message】：逻辑上的HTTP消息，比如请求、响应，流是一个完整的请求，一个完整的请求里面分2部分，“请求和响应”，而一个消息实际上就等价于“一个请求或者一个响应”，是逻辑上的“http请求”或“http响应”
						帧【frame】：最小的单位，多个帧组成一个流【数据流：stream】，帧最小的通信单位，承载特定类型的数据，比如HTTP首部、负荷等等，每个帧都采用二进制格式编码；
							帧的类型：
								1.Data:传输http消息体
								2.Headers：用户传输关于流的额外的首部字段
								3.Ping:计算往返时间，执行“活性”检查。
								4.....
							帧的存放：结果HPack压缩


						多路复用也造成了一些缺点：比如服务器压力上升，可能产生延迟

						关于http请求的header中的Connection:keep-alive = true，只要tcp连接不断开（默认2小时），一直可以进行http请求；也就是这个http请求存在的话，tcp请求是不会断开的
			1.二进制分帧【性能增强的核心】：也就是在应用层使用“二进制分帧”，引入了新的通信单位：“帧，消息，流”，一个流表示一个完整的请求；一个流里面包含多个帧；
			  而分帧，实际就是把一个流分成多个帧【frame】；比如一个http请求里面有header【chorme中的请求头】和请求数据data【chrome荷载里面的内容】，这个http请求在2.0中是分为“Headers帧”和“数据帧”
			  HTTP1.1 采用文本格式，http2是二进制格式
			2.使用Hpack对header的数据进行压缩
			3.服务器推送，服务器可以直接把资源文件推送给客户端，客户端有权利选择是否接收 ！！【比如一个ajax请求，后端处理事件很长，可以先返回一个提示信息，然后等后端处理完了，直接用服务器开启socket给客户端推送信息】！！！！
			4.请求优先级，每个 stream 都可以设置依赖 (Dependency) 和权重，可以按依赖树分配优先级，部分解决了关键请求被阻塞的问题！！！！！！
			缺点：队头阻塞没有完美解决，在http3.0中解决了

	http3.0：核心是UDP和QUIC，解决”队头阻塞“，添加了"快速握手"
		1.把TCP协议改成了UDP，也就是物理层 ， 网络层【IP】 ，传输层【UDP】，额外添加【QUIC】+Qpack和stream，应用层【http】
		2.TLS从1.2升级到1.3，并且在TLS1.3同一层添加了QUIC
		3.QUIC是把TCP重新实现了一遍，并加上了一些额外的性能优化【包括之前的队头阻塞】：
            QUIC用UDP实现快速握手，因为tcp是四元组【自己ip和端口，服务器ip和端口】，任何一个变化都会断开后重新建立连接，连接需要三次握手，而UDP是无连接的，只要ID不变【服务器IP和端口不变】，就不需要重新建立连接；
            所以快速握手核心还是UDP和TCP的区别
            QUIC既然是面向连接的，也就像TCP一样，是一个数据流，发送的数据在这个数据流里面有个偏移量offset，可以通过offset查看数据发送到了那里，这样只有这个offset的包没有来，就要重发。








        substr(开始下标，长度)和substring(开始下标，结束下标记)

        Map:类似Object，但是key可以是一个对象，对象内存地址作为key；
        weakMap ：只允许对象内存地址作为key

        (a == 1 && a == 2 && a ==3) 有可能是 true 吗？ 可以，如果a是对象，调用的是toString或者valueOf方法，方法内可以写具体逻辑，每次对比，都是调用方法


        set map object区别

        时间复杂度【指的是计算次数和变量的关系】：常数阶O(1), 线性阶O(n)，对数阶O(log2n)，平方阶O(n^2),指数阶O(2^n),双阶乘[n!，也就是n^n]
        			
                    常数阶【不管变量输入多少，区块内的js语句执行次数都是一次】：就是普通的js执行语句，例如sum=n*(n+1),console.log(sum);因为不管输入n是多少，计算次数都是“常数”
        			
                    //对数阶【 log2^8=3，log2^n=m,就是2^m=n：2的m次方等于n】：int number=1;while(number<n){number=number*2;}：其实计算次数是lon2^number
        			
                    线性阶【单循环，设置n，块内的js语句的执行次数就是n次】：for(i=0;i<n;i++){...};因为n决定了循环次数，所以决定了计算次数
        			
                    平方阶【双嵌套循环】：fun cal(n){var rst=1;while(n--){while(n--){rst+1;}}}:时间复杂度就是n*n,就是n^2
        			
                    指数阶【递归调用:2^n时间复杂度】：
        							func cal(n){
        								if(n<0){
        									return 1
        								}else{
        									return cal(n-1)+cal(n-2)
        								}
        							}
        			双阶乘[n!，也就是n^n]：
        							func cal(n){
        								if(n<0){
        									return 1
        								}else{
        									var rst=0;
        									wihle(n--){
        										cal(n-1)	
        									}
        									return rst
        								}
        							}
        			时间复杂度面试题：如何获取n^m的最后两位;时间复杂度是线性【n】；
        							for(i=0;i<m;i--){
        								n*=n;
        							}
        							(n+"").substr(n-2,2)
        							//如何简化，降低计算次数；


         Observer：数据监听 Object.defineProperty或new Proxy//无法监控原型内的熟悉

         Compiler：模板解析， AST 【抽象语法树】
         Watcher：...
        vue和react底层渲染原理，虚拟dom，diff算法原理：
        			0.都是把template字符串解析成AST【抽象语法树】后，在根据AST用render函数产生的“虚拟节点”【vue下是VNode】，然后在虚拟节点上展开diff算法；虚拟节点原生是js对象，不是DOM节点，所以不会触发repain和reflow消耗性能
        			1.都是深度优先遍历，同级节点对比【不会跨层，默认原生的dom渲染会跨层（性能不高）】
        			2.数据更新后，都是结果虚拟节点对比后，返回一个patch对象【补丁】，用来标记两个节点不同的地方，然后再通过patch对象来修改真实DOM；
        			3.同层对比算法应该是相同的，就是新虚拟节点从左开始遍历“同层老节点”，遇到“相同的节点”就把老的节点移到和新节点对应的位置，如果没有，就在老节点处创建和新节点相同的节点
        			  注意，patch对象保存的是操作，也就是一个patch对象是一个action行为的描述，然后按照顺序把patch对象串起来，最后要修改真实dom的时候，是统一把patch补丁按照之前的顺序依次执行
        				详见https://www.csdn.net/tags/MtTaMg4sNjYyOTg1LWJsb2cO0O0O.html
        			4.节点判断后是重建还是修改的方式不同：

                        如何移动，React和Vue的节点移动区别：貌似没区别，这个不看了
        				2.1 react比较：同层比较，type相同既是同类型节点，只修改节点属性

        				2.2 vue比较：同层比较,当节点元素类型相同，但className不同时，vue认为是不同类型元素，会删除重建；type类型和className都相同才会认为是同节点

                        2.3 原始diff：原始diff算法就是,两个虚拟dom树,进行逐一对比,而且是不分层级的,对比量很大



        			在标准dom机制下：在同一位置对比前后的dom节点，发现节点改变了，会继续比较该节点的子节点，一层层对比，找到不同的节点，然后更新节点。
        			在react的diff算法下，在同一位置对比前后dom节点,只要发现不同，就会删除操作前的dom节点（包括其子节点），替换为操作后的dom节点。


        vue2以及以前，数据绑定用的是Obejct.defineProperty ;vue3用的是new Proxy(obj,{get,set})//监控绑定数据
        			vue2用defineProperty只能监听已经列举出的属性，所以数组的增加，属性的增加都是不会自动响应的，需要重新复制整个对象或者数组
        			而Proxy是下面的形式，所有的属性不管有没有定义，都会自动走到get和set公共函数，而非某个属性特有的get和set，完美解决新增属性无法监控的问题，同时这种属性监控是所有属性的代理，所以内存也会减少很多
        					new Proxy(obj, {
							  get(target, key, receiver) {
							    console.log("查看的属性为：" + key);  
							    return Reflect.get(target, key, receiver);
							  },
							  set(target, key, value, receiver) {
							    console.log("设置的属性为：" + key); 
							    console.log("新的属性：" + key, "值为：" + value); 
							    Reflect.set(target, key, value, receiver);
							  },
							});



        ！！
        样式核心函数：document.defaultView.getComputedStyle()||window.getComputedStyle(ele);ie下用ele.currentStyle,获取当前元素最终的样式


        渲染流程：document.addEventListener("DOMContentLoaded",...)
            1.整个html文档解析完成：DOMContentLoaded  
            2.页面所有资源加载完毕，包括css，js,图片，iframe，vedio等：onLoad

            其中async和defer脚本的区别：它们的脚本加载都是异步的
            1.async：立即异步加载并异步执行，下载的时候不会阻塞DOM渲染，不会影响DOMContentLoaded事件触发；
                    一旦js开始执行【异步执行，意思js下载完成后，插入异步队列，什么时候执行这一段js得看前面的同步流程啥时候结束】，所以它不会阻塞页面，以为页面DOM解析和渲染时同步的，在他前面；
                    同步在前执行，异步在后执行，就像ajax请求发出去，后面还有js逻辑，会继续先执行后面的同步js，等到执行完了，才会去看异步的请求是否返回，如果返回了就执行。
            2.defer：立即异步加载，同步延迟执行【需要在前面所有的dom和cssom完成解析之后，DOMContentLoaded之前执行，他和原来dom渲染以及js是同一个进程】，支队非内嵌的script脚本有效； 一般js都是同步立即加载立即执行，他是延迟执行
            核心：下载，解析，执行
            	0.js下载，解析，执行完成之前，会阻塞后续dom的解析【阻塞解析自然阻塞渲染】，包括其他资源的下载
            	0.css和图片是可以并行下载的，但是css后面如果有js，那么css就会阻塞这个js的执行，js阻塞后面dom的渲染，所以css直接就把页面阻塞了
                1.因为渲染树会因为cssom而改变，但是就算没有cssom，渲染树照样会渲染，css加载和解析输不会阻塞dom渲染的，但是会阻塞js执行，而js会阻塞dom渲染，所以css后面不能有js
                2.因为js可能依赖于之前css样式和dom节点，所以样式表会在js执行之前加载和解析，也就是说js依赖之前dom和cssom，前面的css会阻塞后面的js执行；
                3.dom css 和js都是按照在html文件中的位置，按照顺序来的；js会阻塞后面的dom解析，css会阻塞后面的js执行【不管后面的js是否有用到css的内容，css都会阻塞js】！！！。
                4. DOMContendLoaded是页面的所有dom解析完成触发【在生成渲染树之前就触发了】，不是渲染后触发，但是js会阻塞渲染，defer属性的js也会阻塞【所以如果defer属性的js不是在页面底部，还是会阻塞页面，他在DOMContenLoaded之前执行】，async属性的js不会，
                5. DOMContendLoaded不会等待图片，视频，iframe以及页面底部的css加载和解析【css非页面底部，就会影响后面的页面展示】。
                6. css加载不会阻塞DOM树的解析，css加载会阻塞后面js语句的执行【css加载阻塞js执行，自然就会阻塞DOM树的渲染】

        具体流程：
            1. html文件下载完成后，解析html生成dom；同时并行解析css生成cssom；
            2. dom和cssom合并生成渲染树，执行layout和paint
        详见// https://blog.51cto.com/u_15127592/4299317


        package-lock.json作用：因为 package.json里面的版本， ^是定义了向后（新）兼容依赖，指如果 types/node的版本是超过 8.0.33 ，
                              并在大版本号（8）上相同，就允许下载最新版本的 types/node库包，例如实际上可能运行npm install时候下载的具体版本是 8.0.35。
                              有时候大版本相同可能出现不兼容，所以用package-lock.json来锁定小版本，列出各个包之间详细的依赖关系
                                主版本号.次版本号.补丁版本号
                                主版本号： 当API发生了改变，并与之前的版本不兼容的时候。
                                次版本号【大版本】：当增加了功能，但是向后兼容的时候。
                                补丁版本号【小版本】：当做了缺陷修复，但是向后兼容的时候。
                                "1.2.3", // 安装指定版本的1.2.3版本
                                "~1.2.3", // 安装1.2.X 中的最新的版本【最近的小版本依赖包】，1.23，1.24等都是小版本：1.1；1.2；1.3之类的是大版本
                                "^1.2.3", // 安装1.x.x中是最新的版本【最近的大版本依赖包】；^1.2.3会匹配所有1.x.x的包，包括1.3.0，但是不包括2.0.0
                                "*1.2.3", //安装目前的最新版本
                                建议使用～来标记版本号，package-lock.json也会锁定小版本号

        ？？？？？？？？？？？？？？如何在一个项目中安装多个不同的框架版本，比如同一个项目同时安装Vue2.0和Vue3.0？？？？？？？？？？？？？？？？？？？？？？？？？


        如何监控DOM变化：有的时候前端开发再调试器上恶意修改dom节点，而有些数据是从dom节点的内容中获取，导致绕开一部分前端校验。
        new MutationObserver(callback).observe(需要监控的dom节点, {
          childList: true,  // 观察目标子节点的变化，是否有添加或者删除
          attributes: true, // 观察属性变动
          subtree: true     // 观察后代节点，默认为 false
        });


        性能优化：模板性能 https://cnodejs.org/topic/50e70edfa7e6c6171a1d70fa
            1.加载时间优化：ssr，缓存策略,预加载，懒加载，压缩，文件合并，首屏优化；交互优化【减少reflow，例如虚拟dom createDocumentFragment 】，事件委托
                0.后端的优化：涉及到"缓存策略"，除seo外的其他部分用前端渲染，缩短响应时间；服务器中间键的选择，尤其是template的选择【dot， Handlebars ，ejs（koa框架用），jade，nunjucks（koa框架用）】；服务器集群和负载均衡；数据库集群+分片+负载均衡；服务端gzip压缩
                2.前端和后端，就是服务器渲染和前端渲染的抉择，seo部分用服务器渲染，其他前端渲染；
                3.前端优化：
                            缓存：cdn静态资源缓存，浏览器缓存
                            请求数量和总量：js,css,图片【 css spirit；图片转base64，iconfont代替图片，图片压缩】;分割代码按需加载【预加载和懒加载】，文件合并和压缩，公共资源提取；渲染优化【非必要的js和css放底部】
            2.交互体验优化：界面抖动，点击或滚动的时候反应慢【涉及repaint refolw js计算量】，减少频繁的dom操作，事件委托；html语义化
            3.开发环境优化：webpack热替换,不同运行环区分"境运行时包和线上包"；oneOf，resolve,dll优化,压缩，HappyPack【任务分解成多个子进程】;tree-shaking剔除js死代码

        父子组件什么周期：父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted


        vue相关知识：修饰符

        vite知识点：和webpack grunt gulp一样是前端构建工具
                vite性能提升的原因：
                    1.公共的npm包全部缓存，编译的是频繁更改的那部分js

        vue的三大核心：模板编译【AST】，数据绑定，虚拟dom【性能优化，diff】
        compiler表示template编译成树状的数据结构，即AST抽象语法树【抽象语法树本质上就是一个JS对象】，生成虚拟DOM[VNode就是AST抽象语法树产生的对象后再转化生成的新js对象，该js对象是用来描述DOM节点]。
        reactivity表示data数据可以被监控，通过 Object.defineProperty。或new Proxy()
        runtime表示运行时相关功能，虚拟DOM(即：VNode)、diff算法、真实DOM操作等。
            虚拟dom本质上就是一个普通的JS对象，用于描述视图的界面结构，和AST是两回事：
            template字符串 》 AST 》 render渲染函数【AST的产物，也是VNode的起点】 》 VNode虚拟节点 【涉及diff算法】 》 界面

        AST是指抽象语法树(abstract syntax tree)，或者语法树(syntax tree)：说白了就是把template字符串，转化成对应树状的一个数据结构（这里是js对象，但是如果换一个场景，不是vue，而是编译器产生AST，那就是其他对象了）
        【AST是描述树状结构的数据结构，不是描述dom节点的js对象】，VUE的AST是用一个js对象来表述一个树状结构的数据结构对象。
        是源代码的抽象语法结构的树状表现形式，然后，经过generate(将AST语法树转化成render function字符串的过程)得到render函数，返回VNode。VNode是Vue的虚拟DOM节点【用于描述dom节点的js对象】，就是用js原生对象来“描述真实DOM”


        tcp和udp区别：
            1.都基于tcp/ip 协议，传输层协议【ip才是网络层协议，http是应用层协议】
            2.tcp一对一，可靠，连接，三次握手，四元组【本地地址和端口，服务器地址和端口：缺点tcp唯一性】；udp可以一对一，一对多，多对多，不可靠，无连接
                TCP四元组中的服务器地址，一般就是服务器ip，以为服务器是固定ip；
                而TCP的客户端地址，一般有2个组成【外网ip和内网ip】，外网ip网关ip，也就是客户端的外网ip地址；因为一个局域网内，所有人的外网ip都是相同的；
                还有一个内网ip，就是我们ipconfig里面出现的192.168.x.x这个内网地址；网关记录了内网地址是哪一台机器的。
            //3.http是基于tcp协议
            //4.http是应用层的协议，tcp和udp是传输层

        

        服务器返回码：
            1 开头：临时响应，并继续
            2 开头：正常访问，200 是请求成功
            3 开头：重定向，301 表示网页被移动到新的位置：304缓存【表示可以使用本地的缓存，本地缓存是最新的文件】
            4 开头：请求错误； 400 表示错误请求，服务器无法理解请求参数 ；401【身份验证错误】；403【禁止访问】；404【未找到】
            5 开头： 服务器内部错误， 500 表示服务器出错

        get和post区别：
            get请求是url后面带参数，长度有限制(url限制2048个字符)，没有对数据库进行修改，用于查，有缓存 ，不安全
            post：用于增删改数据库，没有缓存，安全【请求参数放在body里面】
            GET的Content-Type是application/x-www-form-url   ；  POST的Content-Type是 application/x-www-form-urlencoded或multipart/form-data。
            application/x-www-form-urlencoded ：这种就是一般的文本表单用post传地数据，只要将得到的data用querystring解析下就可以了，一般就是简单的表单请求
            multipart/form-data ：用于文件的上传 【表单种包含上传文件用到】：它既可以发送文本数据，也支持二进制数据上载

        window.requestAnimationFrame 【还有一个 cancelAnimationFrame有的浏览器是cancelRequestAnimationFrame】 详解：  兼容性【webkitRequestAnimationFrame，mozRequestAnimationFrame;cancelAnimationFrame也类似】
            基础：动画涉及屏幕刷新频率【最佳状态就是和屏幕刷新率同步，因为如何大于屏幕刷新率，也没啥用】，一般是60hz，1 秒60帧，所以一般setInterval用的时间间隔都是1000/60
            如何提高性能：requestAnimationFrame就是把所有的dom操作以1帧为单位进行repain和reflow，和屏幕刷新率同步；而setInterval首先只能手动同步为60【很多屏幕不是60刷新频率】
                        1.同步频率
                        2.每一个帧上尽量减少多次dom操作，因为再怎么变，也都只是1帧而已，；1 帧只执行一次就是repain或reflow的渲染【reflow里面肯定包含repaint】，屏幕刷新频率同步
                        3.一旦页面不处于浏览器的当前标签，就会自动停止刷新。这就节省了CPU、GPU和电力
            requestAnimationFrame用法：和setTimeout一摸一样


        


        事件冒泡，捕获，对应的参数：e.target=e.srcElement;e.preventDefault(),e.returnValue=false；e.stopPropagation()=e.cancelBubble；e.currentTarget等价于this，ie中没有对应的

        布局：
        		左侧固定右侧自适应：左侧absolute，右侧margin；做float，右侧margin；左侧设置宽度，右侧设置flex-grow为1
        		两边固定中间自适应：2边absolute 中间设margin  ； 左float 右float 没有浮动的第三个块
        		垂直居中：position：absolute  top:50%  margin-top:-一般的高度;   display:inline-block vertical-align:middle;前面需要有个span  ；display:flex ; align-items:center

        flex布局：
        	//盒属性
        		display：flex
        		align-items:center//垂直剧中
        		justify-content:center：水平居中
        		行内元素使用flex布局，要用display:inline-flex
        		flex-direction:row row-reverse column colume-reverse
        		flex-wrap:nowrap wrap换行
        		flex-flow: direction wrap
        		justify-content:center居中对齐 flex-start flex-end flex-between【两端对齐】 flex-around[间距相等]
        		align-items:center 垂直居中 flex-start flex-end flex-baseline stretch[不设置高度的时候，全部自动给设置为100%高度衍生
        		align-content：多条轴线

        	//内部元素属性
        		order:1 2 3 展示顺序
        		flew-grow：宽度占比，比如4个1，一个4，就表示一个元素占宽度一般，其他4个各占1/8；//如果元素总宽度加起来超过了父元素宽度，那么这个flew-grow的设置就不能按照比例了，必须给每个元素设置with为100%，才能让flew-grow生效
        		flex-shirnk:默认为1 ，空间不足宽度等比例缩小




        BFC: 块级格式化上下文，元素布局的规则:防止margin上下重叠，防止高度坍塌
            float：
            overflow：hidden
            position：absolute，fixed
            display:flex，table-cell,inline-block

        this:当前对象的引用，是一个关键字，不是调用对象的属性
            一般情况下：this指向的是调用这个函数的对象，如果没有对象调用这个函数，那么this指向window；

            特殊情况：
                箭头函数内的this：箭头函数定义位置的父作用域【也就是外面的函数】的this，不是箭头函数调用时所处的对象
                构造函数内this是创建的对象
                事件中的this是目标元素，currentTarget
                bind，call，apply都可以改变this指向：func.apply(obj,arguments);func.call(obj,arg1,arg2...)


    存储相关：
        web存储：
            Cookie：每个cookie内容不能大于4K ，服务器最多20个cookie，浏览器最多保存300个cookie 未过期就有效，同源可访问
                    cookie 的httpOnly和sameSite：Strict Lax None
                            Lax：防御的状态如下：不发送cookie
                              1.post表单【在其他站点发送post请求】【post的action指向被攻击站点，也就是之前登录的那个站点】 ：
                              2.<iframe src="..."></iframe>
                              3.ajax
                              4.image

                            不预防的操作如下： 仍然会发送cookie
                              1.链接<a href="..."></a>
                              2.预加载<link rel="prerender" href="..."/>
                              3.Get表单 <form method="GET" action="...">

                    cookie的name path domain结合在一起作为cookie的唯一标识用于更新cookie；一般的cookie都是直接通过name获取cookie来修改对应的属性即可
                    document.cookie=..，是添加或者更新cookie，自动会去cookie里面寻找是否对应的cookie，存在就更新，不存在就添加，cookie的删除只能是通过设置有效期让cookie过期来删除
                        name:cookie名称
                        domain:如果设置.baidu.com 那么www.baidu.com h5.baidu.com baidu.com都可以访问这个cookie；默认就是服务器主机名
                        path:cookie所属路劲，不同路径下访问权限不同，默认是/,就是主机下所有路劲都可以访问，但是如果设置为/center，那么www.baidu.com/就无法访问了，但是www.baidu.com/center和www.baidu.com/center/page可以访问
                        max-age|expires：有效期，max-age是秒数，expires是事件字符串，比如new Date().toGMTString()
                        secure:安全性，设置为true的话只允许在https或其他安全的协议链接是才被传输

            localStorage:每个浏览器对localstorage的支持大小是不一样的，chrome是5M ，IE10是1630K;同源 set get removeItem clear()
                            localStorage超出最大限制会增样：报错，写不进去，所以一旦报错，需要清空一部分；各条业务线最好氛围不同的子域名，这个样localstorage就分开了，

            sessionStorage:5M 浏览器关闭就没了，只有同一个浏览器窗口下可用【一个url就只有一个窗口】

        应用程序存储：
            html5的manifest：离线浏览 - 用户可在应用离线时使用它们；浏览器将只从服务器下载更新过或更改过的资源
                            每个指定了 manifest 的页面在用户对其访问时都会被缓存


    html5的drag事件： https://blog.csdn.net/hsl0530hsl/article/details/88344225
                1.图片，链接，选中文字默认都可以拖拽
                2.其他元素要拖拽，需要添加draggable属性 <div dragable="true" ></div>;如果某个元素可以拖拽，那么内部文字就不可再选中

                //在拖动节点上触发
                document.addEventListener("dragstart",function(){})
                document.addEventListener("drag",function(){})
                document.addEventListener("dragend",function(){})

                //在拖入拖出某个元素目标节点的时候触发，和上面的触发节点不是同一个
                document.addEventListener("dragenter",function(){})
                document.addEventListener("dragover",function(){})：这个需要event.preventDefault()，阻住默认不让拖入
                document.addEventListener("dragleave",function(){})
                document.addEventListener("drop",function(){}) 这个也需要preventDefault

    网页乱码：
        页面的编码保存是utf-8；同时html页面的 charset="utf-8";保持一致


    svg和canvas区别：
        svg：矢量图，可缩放不会失真，类似xml，可以操作各个dom和事件处理，适合大型渲染区域，因为是dom，所以随着dom节点的增多，性能会越来越差；文本渲染能力抢
        canvas：html5添加的东西，整个画布作为一个元素，所以里面的事件处理，得自己通过区域计算才能得出具体的点击位置，绝对是否触发事件，就是不支持内部dom，因为只有一个节点
                文本渲染能力弱，可以保存为图片，也可以制作视频，适合区域较小且频繁repaint的操作
    label定义表单空间，选择设置了for属性的label，自动会把焦点转移到id为label标签的for属性对应的值的input输入框

    iframe优缺点：
        优点：可以实现post跨域，可以并行加载数据
        缺点：阻塞onload事件，加载内容过多；如果iframe第三方站点内部不受我们控制，出现不友好的用户体验就很麻烦，尤其是iframe站点如果被黑客黑掉，然后利用浏览器安全漏洞下载木马或其他危险的程序，或者加载垃圾资源占用带宽，频繁alert影响用户体验，如果本站被黑，本站可以直接搞”点击劫持“来搞那个iframe站点：比如上方设置一个小游戏，然后把iframe站点透明度设置100%覆盖在上面；点击下游戏的时候其实是点击上面我们的网站，可能就是支付或者其他敏感详细。


    文件上传攻击：前端能做的很有限[用postman fiddler，或者chrome调试器上都可以伪造请求]，如果是图片，可以是前端直接转base64上传数据；服务器把base64转图片保存。
                名称内包含 .php .jsp .asp .aspx .js 0x00 %00 eval( 直接过滤掉；
                0x00 %00 后台转换数据的时候换变成 chr(0) ，即空字符，从而阶段了后面的文件后缀比如文件名称为1.php.0x00.jpg 以为保存的是图片，其实是php，用户访问这个图片的时候，实际是激活执行了php程序，上传文件夹要取消可执行权限
    csrf:跨站请求伪造，cookie设置httpOnly和sameSite【lax或strict】
    xss：跨站脚本攻击，后端：启用白名单和黑名单策略，最好是白名单，周特定的数据才不会转译，其他都转换，有可能导致用户数据展示不正确；上传文件路径固定不可以修改，文件夹没有执行权限 “0644”
                      前端：数据请求返回的数据，不要用innerHTML，或者vue的v-html，react的angerouslySetInnerHTML；不能启用
                      css内最好别写express，里面可以写js；同时最好别用外展js和css链接，直接本地化保存使用
                      数据提交的时候也校验【虽然意义不大，可以通过前端请求伪造来发送】；最重要的就是数据渲染的时候，对于用户产生的数据，不能用innerHTML和v-html；
                      react中的富文本输入【类似vue的v-html】是dangerouslySetInnerHTML【危险地设置innerHTML】，<div dangerouslySetInnerHTML={{ __html: novelMsg.content }}></div>
                      核心源头在于用户提交的数据详细内包含危险链接或者js代码：







    基础：
        var声明的变量不能用delete
        基本类型：bool，number，string，null，undifined
        typeof:bool，number，string，null，undifined, object function,typeOf null 是object
        instanceof: {} instanceof Obejct 某个对象是否是某个构造函数的实例
        Object.prototype.toString.call:"object Number" "object String" "object Boolean" "object Undefined" "object Null" "object Object" "object Function" "object RegExp" "object Array" "object Date" ;
        引用类型：Object，Array，Function，ExgExp，Date
        作用域【定义变量和函数的被使用的区域】：函数的作用域就是该函数的调用对象；变量的作用域看变量定义的位置，全局变量作用域是全局；函数内的变量，作用域知识函数内部【包括函数内部的函数】
                                          改变作用域的语句：with添加一个调用对象到作用域链头部，try-catch的catch的前端添加调用对象【调用对象包含“被抛出的错误对象”】，eval【把字符串改为js执行，如果内部有函数，就会创建js执行环境，js执行环境里面自然就有自身的作用域】
        js的执行环境：js解释器执行函数，都会为函数创建一个执行环境；js允许有多个全局执行环境【比如页面内有iframe，一个iframe内就是一个全局执行环境】；
                    js的执行环境内有一个调用对象，改对象包含了里面定义函数内的局部变量，且该调用对象不能直接被访问，函数内输入某个变量，先从这个调用对象上去找，没找到再向上一级函数的调用对象找，每个函数都有一个调用对象，
                    调用对象的链就是作用域链【最外层是window全局对象】
                    frame之间相互访问详细，可以用top.frames[x]或者parent.frames[x]相互访问【js访问前提是要同源】，没有iframe，那么top.frames或parent.frames就是window

        条件对比：相同类型好比较，不同类型，有一个是引用类型，调用toString或valueOf【优先toString】获得返回值，如果返回值仍然不是基础类型就不等，如果返回的是基础类型；
                接下来就按照不同的基础类型做对比； 基础类型null==undefined,但不和其他任何基础类型相等，NaN连自己都不相等；剩下的只有number，boole，string对比了，有数字优先转数字，其次优先转boole
            
        for in无法列举出那些：只读，不可列举的属性 【可访问原型链上所有属性，用hasOwnProperty判断是自己的数字而非原型上的属性】
                            for in可以获取对象的原型中的属性，但是却不能获取原型prototype这个属性，比如obj={age:24};obj.prototype.name="d";
                            for (key in obj){}的时候，可以访问到age和原型中的name属性，但是无法访问prototype这个属性

        function：只有在后面加上了(),此时函数才会被编译(JIT编译器)，产生函数的执行环境和调用对象

        关于V8的知识：编译器，解析器，AST，字节码，JIT【即时编译器】 ：https://blog.csdn.net/lovermeiy/article/details/110985294
                    编译型和解释型编程语言：
                    编译型：会把文件编译成2进制文件，编译一次即可，后续直接运行二进制文件；
                            代码进行“词法分析【分词】，语法分析【解析】”生成AST【先分词，后解析，最终生成AST】；然后在优化代码，最后生成2进制机械码
                    解释型：在运行的时候，需要通过“解释器”动态解析和执行
                            因为没有编译，所以执行的时候，是靠“解释器”对代码进行“词法分析，语法分析”生成AST【抽象语法树】，然后再基于AST生成字节码【或其他中间码】，最后根据字节码来执行程序

                    V8既有编译器，又有解释器：
                            把代码转化成AST抽象语法树，生成一个 AST的过程和渲染引擎将 HTML 格式文件转换为计算机可以理解的 DOM 树的情况类似；AST 看成代码的结构化表示而不是源代码
                            AST 是非常重要的一种数据结构；
                            以前的V8是没有字节码的，直接是机械码，但是因为机械码占内存太大，后来就加了字节码，不用机械码，用于解决手机上的内存占用过大的问题。
                            解释器把AST转成“字节码”然后执行，重复的字节码会保存成“机械码”【其他机械码都不保存】
                            我们把“字节码配合解释器和编译器”这种技术称为“即时编译”JIT【就是V8用编译器编译产生AST，AST通过解释器转成“字节码”然后解释器再执行字节码

                    代码处理流程：源代码--编译器-→抽象语法树[AST]--解释器-→字节码[最后解释器执行（重复代码还会编译成机械码来执行）]
                                源代码---→抽象语法树[AST]---→本地代码【机械码】：通过JIT【即时编译】来实现重源码到机械码的过程，

                                之前V8是没有“字节码”，直接编译产生“机械码”，后来为了减少内存，有了字节码整个环节，且默认开启，减少手机上的V8引擎的内存占用；但是在Node端，可以关闭来提高性能
        


        执行环境：函数调用（）的时候，创建的扎堆这个函数的执行环境
        ！！！！！
        闭包【嵌套函数】：有权访问另一个函数的作用域中变量的函数，说白了就是函数里面嵌套的函数！！！！！！！！！！
            闭包内存泄露：最常见的就是，函数返回的闭包，返回值保存到外部全局对象中，就是内存泄露。
                        本质是，js执行环境内部的引用类型变量赋值给外部环境【外部js环境依赖内部js环境的数据】，如果外部函数的执行环境不释放，内部js执行环境也就不会销毁“调用对象”释放内存【内部的所有变量都会保存】！！！！！！！！！！！！
            闭包经典案例：执行var arrst=exp();会造成内存泄露，因为执行环境不会被释放；因为函数返回一个闭包【闭包就是内部嵌套函数】给了外部函数的一个变量，那么这个函数作用域将会一致保存在内存中，
                        直到外部函数的执行环境被销毁的时候才会释放，如果或者外部函数的变量就是全局变量，那么只要这个全局变量还在，函数exp的作用域就会一直保存在内存中

                    function exp(){
                        var arr=[],rst;

                        for(var i=0;i<10,i++){
                            rst[i]=function(){
                                return i
                            }
                        }
                        return rst
                    }
                    而且var arrst=exp();执行后，数组内每一个函数执行，返回的都是10，因为都指向同一个执行环境内的变量，如何让 arrst数组内的每一个函数返回的i不是同一个【使用场景就是循环条件中发送ajax，参数不能相互影响】
                    修改方式如下
                    function exp(){
                        var arr=[],rst;

                        for(var i=0;i<10,i++){
                            rst[i]=(function(num){//内部嵌套一个执行环境，包数据拷贝进这个执行环境，这样数据就不依赖于闭包内的变量了
                                return num
                            })(i)
                        }
                        return rst
                    }


        作用域：就是调用对象
        作用域链：调用对象链
        调用对象|变量对象：就是函数执行的时候，保存这个函数内部所有的数据的一个对象，该对象不可访问，访问函数中的变量，都是按照这个该函数的调用对象链【作用域链】，一层层向上访问的，当前调用对象内没有，就访问上一层的调用对象，含是否包含这个属性，this不包含在调用对象里面

        块级作用域：(function(){
            //不给匿名函数设置引用，执行完成就会自动销毁【作用域链】，可以减少闭包占用内存;如果把匿名函数的执行结果保存到外面的全局变量中，而这个结果恰好是匿名函数内部的一个引用类型的变量，那么外面的全局变量就依赖了匿名函数内部的，就无法释放了，如果不是引用类型的话，返回的时候把简单类型变量传给外部，这个传递的过程是传值，所以外部不会对函数体内有依赖，函数是会被销毁的

        })();匿名函数执行完毕，内部的任何变量都会销毁，外面无法访问该函数内的任何变量

        prototype和constructor：
                1.prototype是一个对象，是构造函数的原型，构造函数才有【对象.__proto__才是构造函数的prototype】
                2.constructor是一个函数，是对象的构造函数，对象才有；
                3.最最容易搞混的就是构造函数，因为既是对象又是函数，作为对象它有自己的构造函数，作为函数它又有自己的原型！！！！！！！！！！！！！！！！！
                3.所有es的基础对象，构造函数都是Object，ie8以及以下的DOM和BOM节点对象最基础的构造函数不是Object【是COM，用引用技术，造成内存泄漏】，ie9以及以上就是原生javascript对象；所有的Object的构造函数都是Function，也就是所有的对象最终的构造函数是Function【dom元素也不例外，dom元素节点第一个构造函数是对应的Node类型的构造函数，比如div的构造函数是HTMLDivElement】
                4.因为非DOM和BOM的基础对象的构造函数是Object【IE9以上的DOM和BOM也是Object类】，因为Object是所有最基本的空对象{}的构造函数，
                    {}实际是new Object(),本质一样;所以Object.prototype是所有基础对象的原型，因为new Object()中，构造函数内部自动会调用类似下面的代码
                    var a={};
                    a.__proto__=Object.prototype;
                    this=a;
                    ...构造函数的内部逻辑
                    return this;



        类的基础：详见koa-static里面的util.js的Class方法，
                    大概流程 function Class (parentConstructor,childConstructor){
                        function resultConstructor (){
                            parentConstructor.apply(this,arguments);//父类的实例属性和实例方法继承：借用构造函数
                            childConstructor.apply(this,arguments);//自己的实例属性和实例方法
                        }
                        resultConstructor.prototype=parentConstructor.prototype //继承父类的原型：基础原型对象
                        resultConstructor.prototype.constructor=resultConstructor;//需要指自己！！！！！！！！！！这个很关键，函数的构造原型上的构造函数就是自己；resultConstructor.constructor是Function类
                        return resultConstructor
                    }

        Array对象常用方法：push pop shift unhsift reverse sort concat join slice splice forEach map some every filter：其中sort要注意，内部的function返回值作为排序以及，是正负判断进行排序，不是false和true 【小于0升序】
                          indexOf lastIndexOf
        字符串常用方法：
                        非正则：charAt，substr(startIdx,length)和substring(startIdx,endIdx),indexOf，trim,toUpperCase,toLowerCase
                        支持正则:search,match(不支持分组，支持g),replace,split

        Obejct：
            Object.constructor prototype
            Object.propertyIsEnumerable ,hasOwnProperty,toString,valueOf
            Object.defineProperty(obj,key,{多属性配置}) defineProperties(obj,{key:{},key:{})
                    属性包括：
                        value：值
                        writable：能修改
                        configurable:能否删除，修改其他属性特性，就是修改writable enumerable
                        enmuberable :能for in
            
            


        Date:
            +new Date()==Date.now()
            getFullYear,getMonth,getDate,getDay,getHours,getMinutes,getSeconds,getMillionSeconds;getUTCFullYear[GMT不用了]
        正则方法：exec(在字符串中寻找匹配的内容)；test(在字符串中寻找是否包含匹配的内容)
                其中g对exec的作用不是全局匹配，是记住上次匹配的下标，下次从原来的地方开始继续匹配；exec支持分组

        正则：
            1.字符类：
                [...]:包含
                [^...]:不包含
                .:除了换行符和Unicode的终止字符，其他所有
                \w:ASCII[a-zA-Z0-9_] 注意，阿斯克码是包含下杠的
                \W:[^a-zA-Z0-9_],和\w取反
                \d:数字
                \s:unicode空白字符，一般就是空格
            2.重复：
                *：0+
                +:1+
                ?:{0,1} 可有可无
                {n,m}:
                {n,}:
                {n}:

                重复次数后面再加一个?，表示非贪婪匹配

            3.选择，分组，引用
                选择：|表示从左向右选，只选一个
                分组：(),是独立的一组，结果会出现在匹配项中；其中有个特殊分组(?:内容)，(?:)这个表示“只组合”，分组不用于引用，一般不太用到这个
                引用：\1 ,和分组对应，引用第一个括号内的内容就是\1,字符类里面不能放引用

            4.边界匹配，向前声明（?=）和反向前声明(?!)：比如java（?=Script）,匹配javaScript 不匹配javaSc或java等，对后面跟随的字符串做了条件限制
                ^:开头，这个要特别注意，千万别和字符类里面的^混淆了
                $:结尾
                \b:边界， 比如\bJava\b,就表示Java是单独的词，千万别把\b和^$混淆
                fsdf(?=...):向前声明
                fsdf(?!...):反向前声明
            5. g全局匹配，i不计较大小写，m多行匹配

            6. 拓展使用
                var reg=/(\d)jeff(id)/;reg.test("d898jeffid"); 然后就可以在RegExp这个构造函数中发现匹配的第一个和第二个组，分别是RegExp.$1和RegExp.$2 RegExp.input是源字符串

                ！！！！！！！！！！！！
                "2015-08-55 12:52:33".replace(/(\d{4})\-(\d{2})-(\d{2})\s(\d{2})\:(\d{2})\:(\d{2})/,"$1/$2/$3/$4/$5/$6")，最终变成了'2015/08/55/12/52/33'然后用split来获得各个"分组"
                ！！！！！！！！！！！！


                

    DOM：
        document.compatMode=="backCompat" ：混杂模式
        document.referrer cookie url domian
            domain 不可以从松散变严格，但能从严格变松散：比如document.domian原来是p2p.baidu.com；可以把他设置为baidu.com;但如果原来是baidu.com，那么就不能再变为p2p.baidu.com
            js的不同子域名之间是无法访问的，同源策列的限制，也就是说p2p.baidu.com和h5.baidu.com之间是存在跨域问题的；想要跨域，可以把它们的domian都设置baidu.com!!!!!!!!!!!

        ！！！！！！！！！！！！！！！！
        跨域：同源策列
            协议(http或https),（主机）域名（www.baidu.com）,端口（80或其他端口）:三个有一个不同就是跨域
            JSONP： 
                    var updateList=function(data){window.isFeedBack=true;...}
                    var ele=document.createElement("script");ele.src="www.baidu.com?callback=updateList&param=5" ;
                    document.body.appendChild(ele);
                    setTimeout(function(){
                        if(!window.isFeedBack){
                            alert("请求失败，服务器没反应");
                            请求失败的业务逻辑
                        }
                    },50000);//超过50秒就停下用户请求失败


                    //[不需要，和cors搞混了]noded端需要设置，this.set("Access-Control-Allow-Origin", "http:localhost:8080/");//允许特殊域名跨域；
                    因为返回的是script，所以node端还得添加this.set("Content-Type", "text/javascript");，否则浏览器不知道用什么方式打开接受的文件

            iframe ：
            		跨域就是创建iframe，把参数传过去，然后iframe因为和ajax请求同源可以请求数据，拿到数据后再把数据从ifmame传送给原来的页面，这里数据传送的方法有3种
                    数据传输用location.hash或window.name或window.postMessage
                    window.name原理：iframe的src修改后，window.name数据不会变，所以把请求的数据保存到window.name，再把iframe的src指向和本页同源的空白页，因为同源，本页就可以拿iframe的window.name的数据了



            postMessage：
                A页面执行：window.postMessage(data,url);
                B页面添加监控：
                    window.addEventListener("message",function(e){
                        if(e.origin=="http://www.baidu.com"){//获取数据
                            var data=e.data;
                            ....
                            e.source.postMessage(data,url)
                        }
                    });
            修改domain：这个是在相同主域名下，但在不同子域名下，比如一个是在h5.baidu.com，另一个在pc.baidu.com下，不同源，可以把document.domain修改为baidu.com，就可以实现跨域

            CORS跨域：简单请求和非简单请求
                请求方法是以下三种方法之一：
                    HEAD： HEAD和GET本质是一样的，区别在于HEAD不含有呈现数据，而仅仅是HTTP头信息。
                    GET
                    POST
                HTTP的头信息不超出以下几种字段：

                    Accept
                    Accept-Language
                    Content-Language
                    Last-Event-ID
                    Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain  【这三个常用于表单，所以一般的表单都是CORS跨域的简单请求】

                对于简单请求，浏览器直接发出CORS请求。具体来说，就是在头信息之中，增加一个Origin字段。



        nodeType:
            Element:1
            attr:2
            text:3
            document:9
        Node节点的关联： offsetParent 【position为relative或absolute或fixed祖先节点或body节点,样式定位也是根据offsetParent来的】,parentNode，childNodes，firstChild lastChild,nextsibling previousSibing
        Node节点增删：document.createElement createTextNode createAttribute createDocumentFragment【虚拟节点，文档碎片节点】;父节点.appendChild,父节点.removeChild，父节点.insertBefore(新节点，插入位置锚点节点),父节点.replaceChild(新节点，老节点)；
        Node节点属性修改：getAttribute，setAttribute,removeAttribute
        Node节点操作：innerHTML，outerHTML，ele.insertAdjacentHTML()可操作文档节点
        Node克隆：ele.cloneNode(true|false),设置true就是深度克隆（子节点也克隆）；ie下克隆的时候会把事件都克隆进去，所以需要提前把事件移除；

        类型基础：最基础是Node类，Element Attr Document CharacterData 继承自Node；
                Node -- Element -- HTMLElement --  HTMLHeadElement HTMLBodyElement HTMLDivElement HTMLInputElement ....
                Node -- CharactorData -- Text Comment
                Node -- Document -- HTMLDocument 【是document的构造函数】

        ele.scrollIntoView()：HTML5，滚动到可视区域
 
        createNodeIterator 和createTreeWalker： 遍历所有页面元素,DOM2支持这个接口，深度优先
            var iterator=document.createNodeIterator(documnet.body);
            iterator.nextNode()；iterator.nextNode()多次调用，会有记忆

        document.createDocumentFragment【dom的type是11】:文档碎片，在内存中不再dom树中；创建临时节点，不会造成repaint和reflow，插入文档树后才会成为真正的dom节点；
                                                        一般创建一个新节点，createElement和createDocumentFragment性能上区别，因为都没有添加到DOM树；
                                                        当请求把一个DocumentFragment节点插入文档树时，插入的不是DocumentFragment自身，而是它的所有子孙节点
                                                        var li="查找获取文档中已经存在的节点"；
                                                        var newFrag = document.createDocumentFragment();
                                                        newFrag.appendChild(li);
                                                        li.innerHTML=...;//操作li节点
                                                        最后document.body.appendChild(newFrag);//就会把newFrag文档碎片的所有子元素依次全部插入到body中，这个
        document.createElement【dom的type是1】和createTextNode

        //下面三个集合都是动态集合,哪怕已经保存在了变量里面，每次访问变量都会重新查询
        NodeList【实时更新立即反应】: childNodes，document.querySelectAll（）
        NamedNodeMap：getAttribute获取，类似NodeList,也是动态更新的，对这些返回内容的处理是很消耗性能的，最好是通过createDocumentFragment创建好节点然后统一插入
        HTMLCollection:getElementsByTagName()、getElementsByClassName()、getElementsByName()；children、document.links、document.forms


        document.documentElement:指向html元素
        document.body:指向body
        很多兼容性问题，比如scrollTop，scrollLeft都是通过document.documentElement.scrollTop||document.body.scrollTop来实现的

        !!!!!!!!!!!!!!
        元素宽高核心是：scrollHeight[实际摊开来高度] offsetHeight【元素可视区域包含边框高度】 clientHeight【可视区域不包含边框高度】，scrollLeft[横向滚动了多少]
                       文档和元素，都拥有上面的几个属性，只是文档的滚动需要兼容，有时候是document.body，有时候是document.documentElement
        关于界面的宽高和位置：
            screen：height，width,availHeight(减去屏幕上的“系统任务栏”高度，不是浏览器任务栏),availWidth 整个显示器，和浏览器大小缩放无关
            (document.body||documentElement).scrollTop scrollLeft:文档滚动位置
            (document.body).scrollWidth scrollHeight:文档宽高【包含滚动距离】
            (document.body).offsetWidth offsetHeight:文档可视宽高【不包含滚动距离，但包含边线宽高（比如滚动时最右侧有一个滚动栏，那个栏的宽度也算进去）】
            (document.body).clientWidth clientHeight:文档可视宽高【不包含滚动距离，不包含边线宽高（比如滚动时最右侧有一个滚动栏，那个栏的宽度也算进去）】

        关于元素的宽高和位置
            ！！！
            位置核心函数：ele.getBoundingClientRect ele.scrollIntoView()
            判断元素是否在可视区域内：在IE中，默认坐标从(2,2)开始计算，导致最终距离比其他浏览器多出两个像素，我们需要做个兼容。
            ele.getBoundingClientRect()返回{top,bottom,left,right,x,y,height,width},是相对于视图窗口的信息
            getBoundingClientRect的兼容问题：IE和Idge浏览器不支持x、y属性；IE9版本以下的浏览器不支持width、height属性。没关系，只要有top left bottom right即可其他都可以计算得到
            用这个实现懒加载无限滚动

            元素节点的位置：DOM2 支持
                ele.offsetTop offsetLeft:border到offsetParent节点【上层的第一个position为absolute或relative，就是offsetParent节点】的距离：ele.offsetParent
                ele.scrollTop scrollLeft:节点滚动位置【节点设置固定宽高和滚动边框，自然就会产生滚动位置，注意和文档的滚的位置做区分】
                ele.scrollHeight scrollWidth:实际高度【就是把滚动都摊开来，实际的宽高】
                ele.offsetHeight offsetWidth:包含border的宽高
                ele.clientHeight clientWidth:包含border的宽高
                




        位置和z-index，盒模型

        DOM1 DOM2 DOM3的兼容性支持



        事件：IE9自持DOM3，ie78支持DOM2，ie6以及以下支持DOM0【只有onclick之类的事件】
            DOM0：onclick
            DOM2：addEventListener：

                    事件模块：HTMLEvents MouseEvents UIEvents；DOM3中还添加了MutationEvents  
                    事件接口:Event MouseEvent UIEvent
                    事件类型:laod change upload unload abort submit scroll resize focus blur ; click mousedown mouseup mouseover mousemove mouserout

                    其中 blur focuse unload load这四个事件不冒泡！！！！！！！！！！，不能用事件代理！！！！！！！！！！！！！

                    事件兼容：
                        HTMLEvent:
                            document.addEventListener和document.attachEvent
                            e和window.event[ie的event内的this是window，而]
                            e.currentTarget 等价于this; ie9之前没有这个属性，ie的this是window对象，绑定事件的时候可以用bind this ：触发事件的当前所在的dom节点
                            e.target ;event.srcElement :触发事件的源头的元素是那个
                            e.stopPropagation ;event.cancleBubble=true
                            e.preventDefault ; event.returnValue=false

                        MouseEvent：
                            e.clientX clientY :不考虑滚动位置，相对于客户端浏览器窗口
                            e.screenX screenY :相对于显示器
                            relatedTarget： ie中有fromElement和toElement【事件只有一个，离开某个元素的时候有toElement，进入某个元素的时候有fromElement；都等价于relatedTarget】

                    ie下，元素删除后，事件不会删除，内存泄露，所以得删除事，对于那些频繁更新innerHTML或outerHTML或使用insertAdjacentHTML方法的，尤其要注意！！！！！！！！！！！
                    document.getElementById("btn1").insertAdjacentHTML("afterEnd",'<br><input name=\"txt1\">');

                    ie8以及以下只支持事件冒泡
                    事件流：事件捕获，处于目标阶段，事件冒泡
            DOM3：ie9+支持DOM3
                键盘事件：keyup keydown keypress事件，以及e.keyCode,13表示enter
                    backspace:8
                    tab:9
                    enter:13

            DOM变动监听事件【有很多，这里只写一部分】：DOM3添加，就是Mutation事件： DOMNodeInserted 和 DOMNodeRemoved,DOMAttrModified
                DOMNodeInserted，DOMNodeInsertedIntoDocument：元素插入后触发
                DOMNodeRemoved，DOMNodeRemovedFromDocument：元素删除的时候触发
                DOMAttrModified ：属性修改触发的事件
                new MutationObserver(callback).observer(ele,{childList,attributes,subtree})//用于水印防篡改，比如把水印对应的变量保存在window上，只要水印对应的html属性被修改了，直接在callback中重写水印

            HTML5事件：
                    contextmenu事件：自定义“鼠标右键点击元素”菜单展示事件。 ele.addEventListener("contextmenu",function(e){e.preventDefault(); 自定义逻辑})
                    beforeunload：一般再window上添加该事件，页面离开,刷新或关闭之前调用；window.addEventListener("beforeunload",function(e){e.returnValue="";});//目前个性化消息提示以及被大多数浏览器厂商禁用了

            设备事件：
                移动端：
                    横竖屏旋转：window.orientation,手机横竖屏旋转；【orientationchange事件|MozOrientation事件|deviceorientation事件：一个事件，为了兼容多个设备才用到的】
                    触摸事件：touchstart touchmove touchend touchcancel
                            事件属性：
                                        e.target altKey,shiftKey,screenX【屏幕中的位置，有的时候文档只占屏幕一半】，clientX【文档视觉窗口中的位置】,pageX【在页面中的位置，包含滚动距离】,identifier
                                        e.touches【整个屏幕上的接触点数组】 targetTouches【当前触发元素上的接触点数组】 changeTouches【上次触摸到现在的触摸，改变的那些touch触点】
                                        e.bubbles:冒泡类型
                                        e.cancelable：e.preventDefault()是否可用
                    手势事件：gesture事件
                            gesturestart[手势开始：一个手指已经按屏幕上，另一个手指刚接触屏幕时触发]，gestureend【任意一个手指从屏幕上移开，就触发】， gesturechange【任意一个手指触点位置发生变化就触发】
                viewport：！！！！！！！！！！！！
                    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
                    可以通过这个设置来改变viewport，达到自适应
                    width：宽度设置
                    user-scalable：是否开启缩放，yes|no
                    initial-scale：初始缩放
                    maximum-scale：最大缩放
                    minimum-scale：表示最小的缩放比例
                    


            自定义事件：DOM3级才可以使用   ； document.createEvent,是全局注册，对所有元素都有效
                //非IE浏览器用下面的
                    var evt=document.createEvent("MouseEvent"):鼠标2次点击事件：自定义事件不会自己触发，需要自己再js逻辑中主动调用
                    evt.initMouseEvent("click",true,true,document.defaultView,....)
                    上面的自定义事件，其实就是把自定义事件绑定到已有的时间上去，因为自定义事件肯德是基于已有的事件，比如2次点击事件，肯定是基于点击事件，
                    所以只要在点击事件中判断场景逻辑【和上次点击事件时间间隔小于100ms且在同一个dom节点，就执行document.getElementById("jef").dispatch(evt)即可】

                    //这些都是基于DOM原生事件的拓展事件
                    自定义鼠标事件：document.createEvent("MouseEvent").initMouseEvent； 
                    自定义键盘事件【有兼容性问题，所以写了2个】：document.createEvent("KeyEvents").initKeyEvent||document.createEvent("KeyboardEvent").initKeyboardEvent
                    自定义通用事件：document.createEvent("Events").initEvent(type,bubble,cancelable)
                    自定义Mutation事件：document.createEvent("MutationEvents").initMutationEvent
                    ele.dispatch(evt)调用事件

                    //自定义DOM事件
                    document.createEvent("CustomEvent").initCustomEvent(type，bubbles，cancelable,detail);自定义事件的type不是“click”之类的原生事件类型
                    //IE浏览器有自己的自定义事件
                    evt=document.createEventObject()
                    evt.screenX=....,只能自己一个个手动添加参数，不像上面的，可以在init函数里面设置；
                    document.querySelector(".jef").fireEvent(evt);用fireEvent方法，非IE浏览器用的是ele.dispatch(evt)

            性能问题：onunload事件，离开之气前把所有的事件全部移除，尤其是ie下
        ajax：

            XMLHttpRequest和 ActiveXObject
            xhr.timeout=1000[毫秒，ie8+支持]
            xhr.open(type,url,true异步|false同步);：开启
            xhr.setRequestHeader("content-type",value)：设置请求头，可以多次调用里设置多个请求头
            xhr.send(data|null)：发送数据，post请求数据放里面，get请求数据不需要放，get请求的数据放在url后面
            xhr.abort():停止，在readyState==4之前都可以停止
            xhr.onreadystatechange=function(){
                xhr.readyState==0 1 2 3 4 
                    0：未open
                    1：open但未send
                    2：send但未response
                    3：部分response，正在接收数据
                    4：完成response
                xhr.status==200 返回成功
            }
            xhr.upload.addEventListener("precess",function(){...})//监听上传进度

    MIME【说穿了其实指的就是文件后缀名，用什么方式打开查看】：MIME【maɪm】类型就是设定某种扩展名的文件用一种应用程序来打开的方式类型，当该扩展名文件被访问的时候，浏览器会自动使用指定应用程序来打开。

    DOM：1 2 3 【ie9】
    ES：3 5【ie9】 6
    BOM：没有规则，一般就是history，location，screen，navigator；XMLHttpRequest ActiveXObject   cookie 【可有的说是bom，有的说是dom，个人觉得是dom，因为是document.cookie】
        下面都是全兼容的属性
        navigator.userAgent plugins cookieEnabled platform【win32系统】
        history.go back forward pushState replaceState
        screen【屏幕显示器，不是dom，不是浏览器】.height width  availHeight【height-系统部件高度（也就是任务栏高度）】 availWidth【width-系统部件宽度（一般window下没有系统部件宽度，其他系统或许会有）】

        html5中给history添加了pushState replaceState
                history.pushState({page: 1,这个对象是用来存放该页面的特定数据的}, 'title 1', '?page=1');
                window.onpopstate=function(e){//事件，history对象出现变化时，就会触发popstate事件
                    history.state属性返回的就是上次history.pushState方法的第一个对象参数。
                }
                或者window.addEventListener('popstate', function(event) {}
                页面第一次加载的时候，在load事件发生后，Chrome和Safari浏览器（Webkit核心）会触发popstate事件，而Firefox和IE浏览器不会。

        单页面引用程序的模仿浏览器前进回退功能：https://www.gxlcms.com/ajax-71289.html

            方法1：使用hash，监控hash变化
                hash修改：不会刷新页面但会改变浏览器的histroy
                window.onhashchange 事件监控hash变化；location.hash获取当前hash
            方法2：使用history.pushState方法，replaceState方法；以及window.onpopstate事件来完成前进后退，pushState和replaceState需要浏览器支持html5
                前进的时候用pushState，后退的时候用

    标志性：ie9：dom3 + es5


    浏览器内核引擎：
        opera：
        webkit:safari,chrome
        KHTML：
        Gecko：Firefox，Netscape
        IE:
        如何判断：必须按照下面的先手顺序
            opear:window.opera
            webkit:AppWebKit判断ua
            khtml：KHTML判断ua
            Gecko：Gecko判断ua
            IE：MSIE判断ua

    Math:
        ceil：向上舍
        floor：向下舍
        round：四舍五入
        random:随机，随机0.***小数

    Number:
        toFixed
        toString(2),转化成2进制数字对应的字符串

    window.parseInt parseFloat ,解析的是字符串




    表单：
        form.reset():重置
        blur,change,focus事件

        input：text元素：通过<input type="text" size="25" maxlength="50"> 显示25个字符，最多输入50个字符
                text类型的input有select事件：
                    selectionStart，selectionEnd：选择内容的开始下标和结束下标；Ie9+都支持！！！！
                    ie8虽然不支持，但是ie8有document.selection，是全局的，和时间无关，就是获取选中的那部分文档
                    高级浏览器也有：document.getSelection().anchorNode.textContent，获取选中文本

        表单序列化：  发给服务器的时候，浏览器会自动序列化表单，流程如下
            1.表单字段的名称和value进行url编码，使用&分隔数据
            2.禁用表单字段不上传
            3.只发送勾选的复选框或但单选框，不勾选的不发
            4.不发送type为reset和button这类按钮，因为不是数据
            6.说白了就是只发送有用的数据，然后把数据转化成key和value的形式，类似name=value&name=value%....


    canvas: html5中添加的

        2D上下文：
            <canvas id="cav"></canvas>
            var ele=document.getElementById("cav")
            var ctx=ele.getContext("2d");//也可以用ele.getContext("3d")
            var url=ele.toDataURL("image/png");url是base64字符串，可以直接用于img的src
            ctx.fillStyle:设置填充内容，可以设置渐变对象或模式对象
                渐变对象：ctx.createLinearGradient(), 返回一个CanvasGradient的实例对象
                            ctx.createRadialGradient:放射渐变对象
            ctx.strokeStyle:设置描边内容
            
            //矩形
            ctx.clearRect(0,0,cutWidth,cutHeight); fillRect执行填充,strokeRect执行描边
            ctx.drawImage(img,startX,startY,cutWidth,cutHeight,0,0,cutWidth,cutHeight);


            绘制路径：
                ctx.beginPath(),moveTo lineTo arc或arcTo画圆弧,rect画矩形路径
                fill()执行填充,stroke()执行描边
                ctx.isPointInPath():判断某个点是否在路径上
                fillText,strokeText
                ctx.save和restore，来保存和返回之前的保存

        3D上下文：WebGL，基于canvas，这个太复杂了，直接用线程的图像引擎 three.js制作3D动画 


    Electron.js[ɪˈlektrɒn] ：可以使用前端+node制作桌面应用
    cocos Creator：游戏引擎 ，制作2d游戏  ，目前不太擅长3D游戏




    HTTP请求头：  
        Accept:浏览器能处理的内容：application/json
        content-type：请求内容的数据格式，text/plain  application/x-www-form-url  application/x-www-form-urlencoded multipart/form-data application/json
        Accept-Encoding：浏览器能处理的压缩方式，gzip
        Connection:连接类型，colse,keep-alive之类的
        Cookie:当前页面的Cookie,自动带上的
        Host：请求页面所在的域
        Referer:请求页面的URI地址
        User-Agent:ua








    JS高级技巧：
        0.高阶函数：函数作为参数传入或者函数内返回函数
        1.懒加载
        2.函数绑定，call，bind，apply
        3.函数柯里化【目的是代码解耦，把各自的逻辑拆分到不同的函数】：是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数而且返回结果的新函数的技术
            普通： function add(x, y) {return x + y }

            柯里化函数：
                function curryingAdd(x) {
                    return function (y) {
                        return x + y
                    }
                }
            传入callback，从而减少函数参数，就是把多个参数的函数转化为多个函数嵌套调用，把参数一个个独立出来
        4.Object.preventExtentions():防止添加属性；
            Object.seal()密封：就是把configurable设置为false，不能删除，也不能用Object.defineProperty来修改属性设置
            Object.freeze()冰冻： 不能做任何修改
        5.数据分块 ，防止单个数据处理太久或者超出浏览器限制
        6.函数节流：onresize事件，或者连续在input框内输入内容，不断连续发送ajax是没有必要的，用setTimeout和clearTimeout来减少计算
        7.观察者模式：subject就是被观察者，subject.subscribe()里面的函数就是观察者；
        8.web worker：来多线程处理数据【js是单线程的，有的浏览器支持web worker 多线程处理数据】； 主要是同源限制和dom限制
                    8.1 同源限制：分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。
                    8.2 DOM 限制：Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用document、window、parent这些对象。但是，Worker 线程可以navigator对象和location对象。
                    8.3 通信联系 ： Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。
                    8.4 脚本限制 : Worker 线程不能执行alert()方法和confirm()方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。
                    8.5 文件限制： Worker 线程无法读取本地文件，即不能打开本机的文件系统（file://），它所加载的脚本，必须来自网络
            
            用法：注意，和window.postMessage的跨域通信做区分
                //主线程上
                w=new Worker("demo_workers.js"); 
                worker.onmessage = function (event) {
                  console.log('Received message ' + event.data);
                  doSomething();
                }
                worker.postMessage('Work done!');
                w.terminate();//终止

                //子线程上【可以多个子线程，然后主线程和子线程之间通过onmessage和postMessage通信】
                self.addEventListener('message', function (e) {
                  self.postMessage('You said: ' + e.data);
                }, false);
                self.close()//用于在 Worker 内部关闭自身


            //被观察者
            var subject = {
                eventTypes : [], //被观察者的所有事件，[{key:'',actionList:[]}],里面的actionList是订阅这个事件的观察者列表

                //发布
                publish: function(actionType, newVal) {
                    (this.eventTypes || []).forEach(function(evt) {
                        if (evt.key == actionType) {
                            (evt.actionList || []).forEach(function(action) {
                                action(newVal);
                            });
                        }
                    });
                },

                //订阅：key是订阅的事件，callback就是观察者
                subscribe: function(key, callback) {
                    var tgIdx;
                    var hasExist = this.eventTypes.some(function(unit, idx) {
                        tgIdx = (unit.key === key) ? idx : -1;
                        return (unit.key === key)
                    });
                    if (hasExist) {
                        if (Object.prototype.toString.call(this.eventTypes[tgIdx].actionList) === "[object Array]") {
                            this.eventTypes[tgIdx].actionList.push(callback);
                        } else {
                            this.eventTypes[tgIdx].actionList = [callback];
                        }
                    } else {
                        this.eventTypes.push({
                            key: key,
                            actionList: [callback]
                        });
                    }
                },

                //取消订阅：函数没写完，key是事件类型，name是观者者名称【其实就是函数名称】，这里是把key这个事件整体删除了，如果设置了name的话，只要删除里面的actionList里面对应的function即可
                remove: function(key,name) {
                    var removeIdx;
                    this.eventTypes.forEach(function(evt, idx) {
                        removeIdx = evt.key === key ? idx : -1;
                        return evt.key === key
                    });
                    if (removeIdx !== -1) {
                        this.eventTypes.splice(removeIdx, 1);
                    }
                }
            };

            subject.subscribe("click",function(){});//  function(){}就是观察者，这个观察者订阅这个事件，一旦subject.pushlish("事件名称"，val)触发事件，所有的观察者都能获得通知以及发布者提供给的数据，执行function











BOM接口：
	window.performance:兼容ie9+和android4.0+；可以统计页面加载性能+页面是否通过back按钮返回【window.performance.navigation.type】
    type的值对应的含义：
        0：网页通过点击链接、地址栏输入、表单提交、脚本操作等方式加载，相当于常数performance.navigation.TYPE_NAVIGATE。
    　　1：网页通过“重新加载”按钮或者location.reload()方法加载，相当于常数performance.navigation.TYPE_RELOAD。
    　　2：网页通过“前进”或“后退”按钮加载，相当于常数performance.navigation.TYPE_BACK_FORWARD。
    　　255：任何其他来源的加载，相当于常数performance.navigation.TYPE_RESERVED。
        performance.navigation.redirectCount：表示网页经过重定向的次数。





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
	过度动画： transition 【属性名称，过度时间，过度方式（线性过度），延迟多久开始】：e.addEventListener("transitionend", function() {})//监控动画，每部可以通过e.target来判断是那个元素，就可以判断是那个动画了
                .originstyle{
                    width:100px;
                }
                .animat{
                    width:200px
                    transition: width 2s linear|ease-in|ease-out|ease-in-out 1s;
                }
                原来有一个originstyle的class，然后添加animat；这个里面的动画就会按照transition的描述效果转变
	自定义动画【有from和to，可以设置时间百分比，更加自由】： keyframes 【定义动画名称和大概的变化】+animation【名称（和keyframes对应），时间，过渡方式，延迟，播放次数，是否下一个周期逆回放，是否运行】
            @-webkit-keyframes haha1 {
              0% {
                -webkit-transform: rotate3d(0, 0, 0, 0deg);
              }
              50% {
                -webkit-transform: rotate3d(0, -0.5, 0, 180deg);
              }
              100% {
                -webkit-transform: rotate3d(0, -1, 0, 360deg);
              }
            }

             .img{
                width: 200px;
                height: 200px;
                border-radius: 50%;
                -webkit-animation: haha1 3s linear infinite;//这里需要兼容写法哈我这里没处理
              }

              object.addEventListener("animationend", myScript); //监控animation事件，通过e.target目标不同，来判断是那个动画


            
	//布局
	
	inline-block
	响应式设置：max-width，min-width，百分比宽度
	width:calc(100% -50px) 意思是总宽度减去50px后的宽度

    flex-box：弹性盒子，用于弹性布局！！！！！！！
    普通盒模型：content+padding+border+margin：设置的width就是content
    box-sizing属性[不包含margin，是css的3属性]:
            #example1 {
              box-sizing: border-box;//
                            默认content-box  :设置的width是content的width
                            border-box：设置的width是content+padding+border的总宽度，不是content的宽度
            }



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
				              		0.遍历器对象调用next()返回数据【就是yeid表达式的值】，和函数内部的yeid后表达式赋值，是两回事，千万别搞混
				              		1.它是暂停的意思，他后面接一个表达式，执行next(),返回的是一个{value:当前 yield 表达式的值，done：是否结束}，
				              		2.yeid停顿是按照语句来停顿的，下一句语句里如果包含yeid，那它就会在下一句包含yeid的语句之前暂停【以语句为单位，语句是以；为结束的】
				              		3.每次执行next(),里面如果赋值了

				              最后一个yield后面如果没有return，那执行最后的哪个next()返回的就是{value:undefined,done:true}




				Promise: 本质上来说，Promise构造函数创建一个promise对象只是用来规范异步操作的流程，把异步操作和回调函数赋值拆分成2断操作，promise对象构建的时候里面写ajax，
						并把ajax的成功和失败的回调函数赋值给默认的resolve和reject；对象创建，就是执行ajax然后获取对应状态的过程，这个对象再用then函数来存放成功和失败的回调函数
						相当于添加了then的时候，如果ajax请求已经有结果了，就会执行里面对应的状态的函数，没有调用then的时候，promise对象就算获取了ajax数据，也只是改变了状态，并且被阻塞，
						因为then还没有调用
						本质一句话：用Promise构造函数去封装异步，把异步的回调函数独立出来保存到promise的接口；然后接下来的通过then定义和执行回调函数都是同步的过程。
									new Promise(function(reject,resolve){
										var param={};
										发送ajax请求；

										//在ajax的回调函数里面写下面的内容
										if(请求成功){reject(返回数据)}else{resolve(返回的数据)}
									});
                                    特别注意，promise的状态，无法获取，只能在对应的resolve，reject绑定的函数中，才能确定她的状态是fulfiled，reject，pending
						
						pending,reject,fulfiled三种状态，只执行一遍，一旦出结果，接下来即使再添加异步函数监听，还是出相同的结果，这个和事件的异步不一样
						promise对象的then方法来自定义resove和reject的回调函数【成功和失败】


						 p=Promise.all(p1,p2).then(回调函数)：所有都fulfilled,才执行回调函数
						 p=Promise.any(p1,p2).then(回调函数)：只要参数实例有一个变成 fulfilled 状态，包装实例就会变成 fulfilled 状态
						 Promise.race(p1,p2).then(回调函数)：只要一个实例率先改变状态， p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数。
						 【es2020才加入】Promise.allSettled().then():等到所有这些参数实例都返回结果，不管是 fulfilled 还是 rejected ，包装实例才会结束









	Set：无重复的类数组对象；就是和数组差不多，但是里面没有重复的数据
			去除数组重复数据然后再转回数组：[...new Set(array)]


	Map：	也是个类数组对象，new Map([[1,2],[3,"4"]])，因为对象的属性只能是字符串，map的属性可以是“对象”等其他类型
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
			用于字符串转数组：str="jeffrey";arr=[...str];这个是很变态的方法，最后得到["j","e","f","f","e","r","y"]！！！！！！！！！！！！

		Array.from(arrayLike)：把类对象数组arrayLike转换成真正的数组，Map，argumets,Set,NodeList等，等价于[...arrayLike]

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

								！！！不支持正则结构的时候，一般用"55,656_1234".replace(/\d{2},\d{3}\_\d{4}/g,"$1-$2-$3"),返回"55-656-1234";做到获取特定数值，然后再用"55-656-1234".split("-")获取各个正则对于的参数，类似下面
								正则解构【这个是最强的功能，没有之一】： let {groups: {one, two}} = /^(?<one>.*):(?<two>.*)$/u.exec('foo:bar'); ；把"foo"赋值给one，"bar"赋值给two ：整个太难记，还是用原生好

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

require是CMD的方案:require导入，module.exports导出
import和export是es6模块化的方案：
核心：ES6的import可以导入CMD的模块，但是CMD的require方式无法导入ES6模块；除非你在自己的ES6模块的尾部在加一个module.exports={...};就是给ES6的模块添加了CMD的导出方式

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
	CommonJS 模块是“运行的时候加载”，ES6 模块是“编译时输出接口”,所以es6是部分加载，	CommonJS是全部加载



	Node.js 要求 ES6 模块采用 .mjs 后缀文件名。也就是说，只要脚本文件里面使用 import或者 export 命令，那么就必须采用 .mjs后缀名。Node.js 遇到 .mjs文件，就认为它是 ES6 模块，默认启用严格模式，不必在每个模块文件顶部指定 "use strict"。
	如果不希望将后缀名改成 .mjs ，可以在项目的 package.json 文件中，main是cmd入口，module是es6入口
    
    "main": "lib/index.js", CMD加载入口
    "module": "es/index.js", ES6模块加载入口

	如果这时还要使用 CommonJS 模块，那么需要将 CommonJS 脚本的后缀名都改成 .cjs 。如果没有 type 字段，或者 type 字段为 commonjs ，则 .js 脚本会被解释成 CommonJS 模块。
	总结为一句话： .mjs 文件总是以 ES6 模块加载， .cjs 文件总是以 CommonJS 模块加载， .js 文件的加载取决于 package.json 里面 type 字段的设置。

	Node.js 对 ES6 模块的处理比较麻烦，因为它有自己的 CommonJS 模块格式，与 ES6 模块格式是不兼容的。目前的解决方案是，将两者分开，ES6 模块和 CommonJS 采用各自的加载方案。


	//package.json:知识点，默认JSON中的"main"属性对应的地址是入口文件地址；但如果又exports字段且里面的某个属性别名是.,例如"export":{".":"adf.js"};那么模块的入口地址就是adf.js
	package.json 文件的 exports 字段可以指定脚本或子目录的别名


	正常来说，es6模块用import加载export输出，commonJS模块用require加载module.exports输出；如果 import 命令加载 CommonJS 模块，只能整体加载，不能只加载单一的输出项。最怕用import {}来加载commonJS模块，会报错；
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
				6.生命周期：beforeCreate,created,beforeMount mounted；vue关联的函数上别用箭头函数
				7.模板渲染语法：mustache，{{name}}，括号里面可以是表达式，但不能是js其他语句，例如if，else，for循环；同时模板内很多全局变量都不能访问：其实模板内最好只放数据，其他逻辑都在外面做好
				8.某个标签设置v-html，相当于设置innerHtml，权限较大，容易造成xss攻击
				9.指令：  v-bind（缩写是：），v-on（缩写是@），v-if,v-for  ：这些指令都有对应的修饰符，比如v-on:submit.prevent，就是触发submit事件的时候调用preventDefault函数
						v-bind:<a v-bind:[attributeName]="url"> ... </a>,2.6版本开始，支持变量名和表达式书写动态属性

                10.事件修饰符：修饰符可以串联，比如@click.stop.prevent=...
                    .stop ：不冒泡
                    .prevent ：阻止默认事件
                    .capture 【事件捕获模式，按照事件捕获先处理外面绑定这个元素，再向里面传递】，
                    .self：点击自己，不是冒泡点击
                    .once：支触发一次
                    .passive： 用于滚动时候提高性能，v-on:scroll.passive="onScroll"    ；.passive 和 .prevent 一起使用，因为 .prevent 将会被忽略，同时浏览器可能会向你展示一个警告

                    顺序很重要，v-on:click.prevent.self 会阻止所有的点击，而 v-on:click.self.prevent 只会阻止对元素自身的点击。



	Vue深入：模板解析【涉及AST】，数据绑定,虚拟DOM[VNode]，diff算法[深度优先遍历，同层对比]
	vue2.X的天坑：vue无法检测数组的长度，因为是用defineProperties来监控属性的，length无法监控

	侦听和计算属性：methoded，computed，watch
				10.computed和method，同样用于计算属性，method每次执行都会重新计算，重新渲染；
				   mothods无缓存，computed择会缓存，computed里面是属性是依赖于其他属性的，只要其他依赖的属性都没有变动，computed里面的属性也就不会变动
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
				   但如果某个数据，依赖非常多的数据，涉及异步操作之类的，复杂的计算，用watch
				   watch用于观察和监听页面上的vue实例，当然在大部分情况下我们都会使用computed，但如果要在数据变化的同时进行异步操作或者是比较大的开销，那么watch为最佳选择。watch为一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。直


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
			  v-for="(item, index) in items"  //输出多个my-component
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


	事件： ！！！！！！下面好像说得不对，我自己写js的时候，直接可以正常绑定@click=函数句柄，参数中依然可以获得事件e！！！！！！
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
		组件使用： <div id="app"><component-a></component-a></div>，



		//局部组件
		组件定义：ComponentA=require("...");ComponentB=require(...);require返回的是一个Object对象，例如Login={data(){},computed:function(){},methods:{funcA:function(){}},template:require("..templatePath")}
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
	导致this.$emit('myEvent')事件触发失败，得用this.$emit('myevent')!!!!!!!!!!!!


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
    {//父组件对象
		components:{
            "login": () => import('../../components/login'),
            "regist": () => import('./components/regist'),
            "article-edit": () => import('../../components/article-edit'),
            "article-list": () => import('../../components/article-list'),
            "article-display": () => import('../../components/article-display'),
            "search-list": () => import('./components/search-list'),
            "user-pop": () => import('../../components/user-pop')//通用的右上角的个人登陆状态按钮组件
        },
    }
		然后在组建调用的时候用v-if即可，例如 <async-webpack-example v-if="needLoad"></async-webpack-example>  needLoad是变量，控制这个组件什么时候加载，它在store里面被设置为true的时候，组件就异步加载了

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
    css和模型类型：
                    0.普通盒模型，就是content padding border margin ;设置的width=content的width；而box-sizing属性可以设置另一个盒模型，就是border-box,width=content+padding+border
                    1.box-sizing:content-box和border-box

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
			2、position的值不是static或者relative。【脱离文档流:absolute和fixed】
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

			//脱离文档流[float非none；position为absolute或fixed，都会脱离文档流；脱离文档流是会触发BFC的]
				1.浮动[float]: 根据它的包含块定位【最近的块级父元素：相对最近的块级父元素浮动】！！！！
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

				2.定位[position]：static【正常文档流】，relative【文档流，偏移】，absolute，fixed

						relative:不脱离文档流，只是相对于原来的位置做偏移
						absolute:脱离文档流，根据position不是static的元素来作为包含块|或body，来定位
								如果包含块是块元素，根据该元素的padding定位！！！
								如果包含快是行内元素，根据该元素的内容来定位
								和float元素不同的是，position为absolute的元素
								它可以定位到包含块的外面
						fixed:脱离文档流，根据window窗口定位

						z-index:对非static元素或float元素才有效；【float://或position: absoulte relative fixed 】
								z-index有祖先元素的概念【最近的设有z-index的float或relative或absolute或fixed元素，会产生一个层，内部所有元素都再这个层上方】；
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






	