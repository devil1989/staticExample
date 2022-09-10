/*
 注意：dev和prod环境的dll是相互独立的，以为dev环境下的dll包里面，包含了外部框架的编译器，为了方便调试；而prod环境下的ll包里面只有运行时代码
    1.dll文件需要自己通过npm run dll-dev来打包生成dev环境下新的dll文件
    2.dll文件需要在前端开发的html文件里面自己加入,地址是localhost:8080/recommend/dll/dev/dll.js，host可能会变动，看webpack.config.dev.js的output的publicPath

    操作的是src>dll>dev文件夹里面的文件
 */


var path = require("path");
var webpack=  require("webpack");


module.exports = {
    context: __dirname,
    mode:"development",
    target: ['web', 'es5'],//解决webpack5的最外层的箭头函数没有被解析成es5的问题
    // target: ['browserslist'],//解决webpack5的最外层的箭头函数没有被解析成es5的问题
　　entry: {//名称的key不可以有-;webpack.DllPlugin这个插件只支持一个entry，不然生成的json会报错
        "dll":["vue","vuex"]
        // "react_prod":'react-dom',
        // "vue":"vue",
        // "vue_prod":"../node_modules/vue/dist/vue.runtime.esm.js"
        // "fastclick":'fastclick'
        // "fastclick_prod":'fastclick'
　　},
　　output: {
　　　　path: path.join(__dirname, "../src/dll/dev"),
　　　　filename: "[name].js",
       library: '[name]'//这个和webpack.DllPlugin的name保持一致
　　},

    module: {
        rules: [ //LoaderOptionsPlugin.js文件中设置对应值
            { //支持preest-env支持es版本【里面的target属性可以设置支持哪个浏览器，到什么版本，还有loose设置】；preset-react支持react的jsx语法，preset-typescript支持typescript语法
                test: /\.m?js$/,
                use: {
                    // 详见：https://blog.csdn.net/lunahaijiao/article/details/119156972
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
                                // "targets": { //这个是转义的基础，就是babel在这些浏览器的基础上去转义，因为很多浏览器自己就支持了es6，如果用polyfill全兼容打包，就太浪费了，所以打包是基于哪些浏览器，写在这里
                                //     "browsers": ["ie>=9", "chrome>=52", "safari>=60", "firefox>=20", "edge>=17", "android>=4.4", "ios>=7", "node>=6.0"] //node还没设置；支持node环境几点几版本，一般前端不用兼容node，后端才需要
                                // },
                                // // "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | false, defaults to "commonjs"
                                // "modules": false,
                                "targets": {
                                    chrome: '52',
                                    firefox: '60',
                                    ie: '9',
                                    safari: '60',
                                    edge: '17'
                                },
                                "corejs": 3 //这个设置用到了@babel/runtime-corejs3插件，版本有2和3，必须用到，否则js报错;useBuiltIns设置为usage必须要和corejs属性结合使用
                            }]
                        ],
                        // plugins: ['@babel/plugin-transform-runtime'], //解决下面2个问题：1.多个文件重复引用相同helpers（帮助函数）-> 提取运行时;2.新API方法全局污染 -> 局部引入
                        cacheDirectory: false//从缓存中获取，加速webpack打包编译速度（babel转化很影响速度）
                    },
                },
                include:[ path.resolve(__dirname, '../node_modules/vue/dist/vue.esm.js'),path.resolve(__dirname, '../node_modules/vuex/dist/vuex.esm.js')]
                //这个千万别放错位置，之前放在了babel-loader的options里面，错误提示都没有，调试webpack都快把自己调试瞎了，
                // exclude: /(node_modules|bower_components)/ //不需要转码的文件【只需要用babel转码自己的项目中用到的文件即可，其他插件不需要它来转码，不然一堆没用的log看都看不过来】

            }
        ]
    },
    
    plugins: [
　　　　new webpack.DllPlugin({
　　　　　　path: path.join(__dirname, "../src/dll/dev", "manifest.json"),
　　　　　　name: "[name]"
　　　　})
　　],

    resolve: {
        alias: { //给对应的模块取别名:不会影响文件打包大小，不会因为别名而导致dll重复加载对应的库
            'vue': path.resolve(__dirname, '../node_modules/vue/dist/vue.esm.js'),//默认是运行时版本，没有compile，dev环境下引入需要完整版，vue.esm.js，有编译器才能编译template
            'vuex': path.resolve(__dirname, '../node_modules/vuex/dist/vuex.esm.js')//默认是运行时版本，没有compile，dev环境下引入需要完整版，vue.esm.js，有编译器才能编译template
        }
    },
　　
    optimization: {
        chunkIds: 'named'
    }
}; 

