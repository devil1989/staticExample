/*
 如何设置动态dll：提升webpack热替换速度和打包速度
 1.添加此文件夹，执行npm run dll，就只执行这个脚本：会在对应目录/src/dll下生成app.js和manifest.json这两个文件【压缩的】
 2.在webpack打包脚本的plugins中添加如下插件，这个插件告诉webpack，遇到manifest.json中设置的import模块后（就是这里的entry里面的模块），自动忽略
 		new webpack.DllReferencePlugin({//引用dll文件，对于那些vue，react,zepto等基本不变第三方库，走本地的dll文件，需要在html中自己引入dll文件
            context: __dirname,
            manifest: require('../src/common/dll/manifest.json')
        }),
 3.既然js中自动忽略了这些模块，那么就得在html的head中，引入步骤1中生成的app.js
    注意dll文件这里已经通过babel打包过了，所以别再webpack.config.dev.js和webpack.config.product.js中的entry里面再次引入打包，否则就打包2次，会报错的
    dev环境和prod环境，引入的地址不一样，dev实在本地的html上引入，而prod是在node端的公共html中引入
 4.虽然删除了入口，但是本地的静态资源服务器上还需要这个js，所以得把这个app.js和json文件拷贝到压缩目录dist的对应文件夹中去（这个月localhost才能访问这个js）
 5.注意：dev和prod环境的dll是相互独立的，以为dev环境下的dll包里面，包含了外部框架的编译器，为了方便调试；而prod环境下的ll包里面只有运行时代码
 
 操作的是src>dll>prod文件夹里面的文件
 */



/*前端项目构建：现在移动端网速都很快，不管是4G还是5G
            1.C端项目【基本很少用了，除非是极个别的场景】：超轻量级H5：zepto.js,underscore[自带templte]，最原始的架构，自由度高
            2.一般H5项目：vue【里面集成了template+event+dom操作】，mvvm架构【如果可以的话，添加vuex来状态管理，提高开发效率】
            3.大型H5项目|PC端项目【支持到ie9】：vue+vuex+  “ant-design-vue”：组件库丰富，书写简单 【组件库可以按组件添加，所以肯定是这个方案】
            4.BC端项目都可以：react+redux|mbox+"ant-design":因为react本身较大，所以引入mbox和redux对文件本身大小已经不是特别care，更在意的是开发效率和舒服程度
                             ant-design有用polyfill支持到ie9的3.X版本，也有更高版本的ant-design只支持高版本浏览器，看项目选择*/

var path = require("path");
var webpack=  require("webpack");
let fs=require('fs');
let MiniJs=require("terser-webpack-plugin");
let date=new Date();
let version=date.getFullYear()+"_"+(date.getMonth()+1)+"_"+date.getDate()+"_"+ Date.now();

//dll-mapping文件，指向当前的dll文件的mapping，dll文件偶尔才发，所以不和其他文件的mapping放一起，只有框架修改了，这个才会修改，然后assets-mapping构建的时候以他为基础，
//只要它没变，获取的就是原来的dll文件
function dllMappingPlugin() {
    this.hooks.done.tap("dllMap",function(stats) {
        const output = {};
        output["/recommend/dll/prod/dll.js"] = "/recommend/dll/prod/dll_"+version+".js";
        fs.writeFileSync(
            path.join(__dirname, "../src/dll/prod/dll_mapping.json"),
            JSON.stringify(output)
        );
    })
}

module.exports = {
    context: __dirname,
    mode:"production",
    target:['web', 'es5'],//解决webpack5的最外层的箭头函数没有被解析成es5的问题
　　entry: {//名称的key不可以有-;webpack.DllPlugin这个插件只支持一个entry，不然生成的json会报错
        "dll":["vue","vuex"]//js压缩后134K，gzip后43k，主要是vue和jsencrypt分别是60k和50k
        // "react_prod":'react-dom',
        // "vue":"vue",
        // "vue_prod":"../node_modules/vue/dist/vue.runtime.esm.js"
        // "fastclick":'fastclick'
        // "fastclick_prod":'fastclick'
　　},
　　output: {
　　　　path: path.join(__dirname, "../src/dll/prod"),
　　　　filename: "[name]_"+version+".js",
       library: '[name]'//这个和webpack.DllPlugin的name保持一致
　　},

    module: {
        rules: [ //LoaderOptionsPlugin.js文件中设置对应值
            { //支持preest-env支持es版本【里面的target属性可以设置支持哪个浏览器，到什么版本，还有loose设置】；preset-react支持react的jsx语法，preset-typescript支持typescript语法
                test: /\.m?js$/,
                use: {
                    loader: "babel-loader",
                    //babel插件分2种，语法插件【把typescript，es6，jsx等语法转换成es5或这个es3的语法，stage-0就表示转换到es3（最基础的版本，所有浏览器都支持）】，
                    //babel插件的第二种就是转译插件，就是比如promise等非语法的函数，就是用这类插件转译的
                    options: {
                        babelrc: false, //因为设置了false，所以自己删除了.babelrc文件，如果有问题，到时候再加回来
                        presets: [
                            "@babel/preset-react", //支持react的jsx语法

                            //@babel/env这个里面包含了stage-0；stage-1....等所有包，就是全兼容；但是babel会根据“业务外码文件中自己用到的js函数和函数，和开发者使用的浏览器版本，来自动兼容对应的语法和额外函数
                            //用到@babel/preset-env和@babel/plugin-transform-runtime这两个插件，其中@babel/plugin-transform-runtime依赖babel-runtime，所以要安装这三个插件
                            ["@babel/preset-env", {

                                // useBuiltIns和targets结合，useBuiltIns设置"usage",解决了自动添加需要用到的polyfill函数；
                                // babel会根据基于targets基础浏览器支持的函数和es版本，和自己js中用到的不被这些浏览器支持的函数和语法做对比，自动添加那部分不被支持的语法和语法之外的函数【例如promise】
                                "useBuiltIns": "usage", //usage:按需使用,不用自动import；  false：不引入polyfill，所以只支持es新版本的语法，不支持Promise等额外的函数；entry：引用一次
                                "targets": { //这个是转义的基础，就是babel在这些浏览器的基础上去转义，因为很多浏览器自己就支持了es6，如果用polyfill全兼容打包，就太浪费了，所以打包是基于哪些浏览器，写在这里
                                    "browsers": ["ie>=9", "chrome>=52", "safari>=60", "firefox>=20", "edge>=17", "android>=4.4", "ios>=7", "node>=6.0"] //node还没设置；支持node环境几点几版本，一般前端不用兼容node，后端才需要
                                },
                                // // "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | false, defaults to "commonjs"
                                // "modules": false,

                                "corejs": 3.4 //这个设置用到了@babel/runtime-corejs3插件，版本有2和3，必须用到，否则js报错;useBuiltIns设置为usage必须要和corejs属性结合使用

                            }]
                        ],
                        plugins: ['@babel/plugin-transform-runtime'] //解决下面2个问题：1.多个文件重复引用相同helpers（帮助函数）-> 提取运行时;2.新API方法全局污染 -> 局部引入
                        // cacheDirectory: false//从缓存中获取，加速webpack打包编译速度（babel转化很影响速度）
                    },
                },

                //这个千万别放错位置，之前放在了babel-loader的options里面，错误提示都没有，调试webpack都快把自己调试瞎了，
                exclude: /(node_modules|bower_components)/ //不需要转码的文件【只需要用babel转码自己的项目中用到的文件即可，其他插件不需要它来转码，不然一堆没用的log看都看不过来】

            }
        ]
    },

　　plugins: [
        new webpack.DllPlugin({//指定需要忽略的js文件的json地址，生成json
            path: path.join(__dirname, "../src/dll/prod", "manifest.json"),
            name: "[name]"
        }),
        dllMappingPlugin
    ],
    resolve: {
        alias: { //给对应的模块取别名:不会影响文件打包大小，不会因为别名而导致dll重复加载对应的库
            'vue': path.resolve(__dirname, '../node_modules/vue/dist/vue.runtime.esm.js'),//默认是运行时版本，没有compile，dev环境下引入需要完整版，vue.esm.js，有编译器才能编译template
            'vuex': path.resolve(__dirname, '../node_modules/vuex/dist/vuex.min.js')
        }
    },
    optimization: { //替代webpack.optimize.OccurrenceOrderPlugin()
        chunkIds: 'named', //打包出来的文件根目录名称【dist下的一级子文件夹】
        minimize: true,
        minimizer: [new MiniJs()] //压缩
    }
    
}; 

