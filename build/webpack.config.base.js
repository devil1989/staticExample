//unfinish：es3ify-loader,dll【基本完成，现在需要拓展js库，所以到时候还得改】，图片等静态资源的路径正确访问【在项目中正确访问】
//qa，yz,线上三个版本的打包
// unfinish：ant-design框架接入,vue,react使用，验证cookie和fastclick，zepto是否正常使用，验证es8和ie8已经通过babel设置兼容了


/*天坑：首先以为dev-server的原因，ie里面的js报错是无法正确得到具体的js地址的，所以必须关闭它才能找ie下的兼容错误是什么引起的，
      然后因为html-loader默认开启了 esModule ，会导致ie浏览器下报错，这个问题定位出来是html-loader的问题就很麻烦，我一开始还以为是webpack5的兼容设置有问题，一直在修改target属性
      关闭html-loader的esModule属性后，因为自己的js里面仍然在用require的方式引入html模块，导致报错；就以为 esModule 禁用以后导致html-loader不能使用了，其实只是不能模块化加载html而已，还是可以用import 的方式引入html的
*/

/*
    关于图片链接相对地址在js,css,html文件中的处理
    js中，如果用到某个图片的相对地址： import imgurl from "../dirname/imgname.png";然后在js中使用imgurl即可
    css中用到图片相对地址：和原来一样使用即可
    html中使用图片相对地址：和原来一样，但是有一个特别特别坑的问题，html-loader默认启用esModule的，也就是可以通过require的方式来引入html模块，构建模块的过程中用到了new URL()来构建url,而URL是不支持ie12以下的浏览器的
                          所以，为了兼容，必须把在html-loader中把esModule禁用掉，这个禁用了以后，在js中不能用require的方式来引入html，只能通过import的方式来引入html文件，得到的是html字符串
 */

/*
 dev文件里面没有添加html生成插件和html热替换，这个文件里面添加html热替换，这样可以把前端开发环境完全独立出来，就算没有后端，也可以直接进入前端开发，需要用到的后端数据都用mock数据
 */


// 关于各个插件的详细应用，大多数在vew-component项目里面，一部分在这里，以这里的为主！！！！！！！！！！！

// webpack5弃用了raw-loader 、url-loader 、file-loader ：如果要继续使用，需要添加type:"javascript/auto"来禁用新添加的assets功能，具体详见https://blog.csdn.net/wu_xianqiang/article/details/117171900
// webpack5打包完成后，最外层的js用到了箭头函数等es5的语法，这个无法用babel转化，只能在webpack5中通过设置target或environment来解决


//webpack打包详细使用，详见个人的vue2.0站点

/*css修改后热替换不成功的解决方案（extract-text-webpack-plugin插件的原因导致的）： add by jeffreychen
console中会出来一个[HMR] Nothing hot updated.的提示，可以查找对应的js，发现他在webpack-hot-middleware里面的process-update.js文件里面
既然这个console能打出来，那么只要在这个console的前面，自己写js来替换本链接中的link即可
为什么只要改link的hash就可以了呢，因为这个bug是ExtractTextPlugin插件导致的，他会把css抽离成link文件，这个link文件中的css会动态随着css的改变而改变，
虽然link中的css改变了，但是这个link在document中的链接没有变，这时候需要刷新html页面，或者刷新html中的所有link链接，这样就可以了，详细代码如下

document.querySelectorAll('link[href][rel=stylesheet]').forEach((link) => {
  const nextStyleHref = link.href.replace(/(\?\d+)?$/, `?${Date.now()}`)
  link.href = nextStyleHref
});


webpack的详细设置（不包括插件）：都在webpackOptionsSchema.json这个文件中,查看对应的源代码就可以知道是如何设置的！！！！！！！！！！！！！



//配置环境：“webpack 5.x | babel-loader 8.x | @babel 7.x”


*/

//插件的详细使用方法在node_modules对应文件加下的readme中都有介绍

let evn=process.env.NODE_ENV;
let path = require("path");
let MiniCssExtractPlugin = require('mini-css-extract-plugin'); //从js中抽离css形成单独css文件的插件
let configInfo = require("./js/config");
let utilInfo = require("./js/util");
let localAddress = configInfo.localAddress;
let workingDir = configInfo.workingDir;
let getPages = utilInfo.getPages;
let getEntries = utilInfo.getEntries;
let folderName = "recommend";
function getAllEntries() { //app和common文件夹都得打包
    var app = getEntries(getPages("app"));
    var common = getEntries(getPages("common")); //common下的dll文件夹不作为入口，同时需要把dll文件夹原封不动得拷贝到dist
    return Object.assign({}, app, common);
}

function getLoader(type){
    //loader的顺寻：style-loader,css-loader,postcss-loader,sass-loader；解析是从右到左解析，顺序不能乱
    let loaderConfig = [
        // { loader: "style-loader" },
        { //需要什么样的loader去编译文件
            loader: "css-loader", // 找出@import和url()导入的语法，告诉webpack依赖的资源。同时支持css modules、压缩css等
            options: { //配置详见http://www.css88.com/doc/webpack/loaders/css-loader/
                // [path][name]__[local]__[hash:base64:5]
                // importLoaders:1,

                modules: { //这个和以前不一样了，以前只是给modules设置true，localIdentName和modules平级，现在是嵌套，真坑爹
                    localIdentName: "[local]" //给html和react中的class重命名，例如.content 会变成.content-__index__loading__3kD3xzqc，后面的参数是什么在这里设置
                },
                sourceMap: (evn=="production")?false:true
            }
        }
    ]; //css-loader!postcss-loader!sass-loader (postcss要放在css-loader之后，sass-loader之前)

    let commonCssLoader = [{ //需要安装postcss，postcss-loader， autoprefixer 三个插件 ,其中插件的设置，在根目录的postcss.config.js里面
        //postcss可以理解为一个处理css的插件平台，里面可以用到众多插件，一般用到autoprefixer，当然它也可以使用插件去做sass或less类似的功能，但没有必要，一般也就用以一个autoprefixer
        loader: 'postcss-loader'
    }, {
        loader: "sass-loader", //把scss装换成css
        options: {
            sourceMap: (evn=="production")?false:true
        }
    }];

    //pc的不需要px2rem-loader
    let pcLoaderConfig = [MiniCssExtractPlugin.loader].concat(loaderConfig.concat(commonCssLoader));

    let mcLoaderConfig = [MiniCssExtractPlugin.loader].concat(loaderConfig.concat({
        loader: 'px2rem-loader',
        options: {
            remUnit: 37.5, //把页面中实际的px值/(37.5*2)
            remPrecision: 8 //rem精确到几位
        }
    }).concat(commonCssLoader));


    return type=="mc"?mcLoaderConfig:pcLoaderConfig
}



// __dirname表示当前文件所在的目录;workingDir是当前目录
let config = {
    //指向src目录；相关目录匹配映射的地方有：devServer的static设置静态资源匹配，config.output设置入口文件和浏览器访问地址匹配；
    // 这里把context这位src作为根目录，是为了让静态在原的[path]从src目录下开始生成，这样静态资源的[path][name].[ext]就是以src为根目录的地址了
    context: workingDir,
    entry: getAllEntries,
    // target: ['web'],//解决webpack5的最外层的箭头函数没有被解析成es5的问题
    //webpack打包时候依赖的环境，比如用node，那么webpack打包用到的js代码里面就会自动有node环境下才能用的代码，如果写了node，结果在浏览器环境下打包，那么就会因为浏览器不支持node环境支持的那些变量而报错
    target: ['browserslist'],
    module: {
        rules: [ //LoaderOptionsPlugin.js文件中设置对应值

            // asset/resource 将模块单独导出一个文件，并提供一个 URL 来使用该文件。之前通过使用 file-loader 实现
            // asset/inline 。将文件通过 base64 编码转为 Data URI 的格式 ，并内联到使用它的文件中。之前通过使用 url-loader 实现。
            // asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
            // asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。


            //dev环境下，图片放在了`${localAddress}/recommend/`这个地址下，在css的图片里面，对应的url就是`${localAddress}/recommend/`+[path][name].[ext]；文件小于于4096就自动转base64
            //   可以设置publicPath来覆盖output的publicPath
            { //功能包含2个：html和css中的url解析转义以及对应的文件拷贝；js中如果出现图片问题需要在js文件开头，用url=require(图片url)；得到对应的图片url后，放到对应的js逻辑代码里面，或react的jsx里面
                test: /\.(png|jpe?g|gif)$/i,//只会拷贝js或css中引用到的文件
                type: "asset",
                generator: {//图片在html上产生的url路径是publicPath+filename；最后这样能否访问到静态资源，得静态资源的配置【devServer的static配置】
                            //图片生成的路径config的output.path+filename;其实所有的生成都是按照config的out里面的publicPath和path为依据的，当然这里也可以自定义设置，但没必要
                            //想让静态资源正常访问，唯一要做的就是把静态资源服务器的static属性里面publicPath和directory设置成config文件的output里面的publicPath和path
                    // publicPath: '//localhost:8080/' + folderName + '/' ,
                    // filename: "[name][ext]"//这个path，是以config.context作为根目录来获取的，context设置的是koa-static文件夹作为根目录，所以这个path就是：src/app....
                    // context:workingDir,
                    filename: "[path][name]-[hash:5][ext]"//这个path，是以config.context作为根目录来获取的，context设置的是koa-static文件夹作为根目录，所以这个path就是：src/app....
                },
                parser: {
                    // esModule:false,
                    dataUrlCondition: {
                        maxSize: 4096 //小于这个size就自动转base64
                    }
                }
            }, 
            {
                test: /\.(ttf|eot|svg|woff|woff2)(\?[a-z0-9]+)?$/,//只会拷贝js或css中引用到的文件
                loader: "asset",
                generator: {
                    filename: "[path][name]-[hash:5][ext]"
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 4096 //小于这个size就自动转base64
                    }
                }
            }, { //支持preest-env支持es版本【里面的target属性可以设置支持哪个浏览器，到什么版本，还有loose设置】；preset-react支持react的jsx语法，preset-typescript支持typescript语法
                test: /\.m?js$/,
                use: {
                    loader: "babel-loader",
                    //babel插件分2种，语法插件【把typescript，es6，jsx等语法转换成es5或这个es3的语法，stage-0就表示转换到es3（最基础的版本，所有浏览器都支持）】，
                    //babel插件的第二种就是转译插件，就是比如promise等非语法的函数，就是用这类插件转译的
                    options: {
                        sourceMap: true,
                        babelrc: false, //因为设置了false，所以自己删除了.babelrc文件，如果有问题，到时候再加回来
                        presets: [
                            "@babel/preset-react", //支持react的jsx语法

                            //@babel/env这个里面包含了stage-0；stage-1....等所有包，就是全兼容；但是babel会根据“业务外码文件中自己用到的js函数和函数，和开发者使用的浏览器版本，来自动兼容对应的语法和额外函数
                            //用到@babel/preset-env和@babel/plugin-transform-runtime这两个插件，其中@babel/plugin-transform-runtime依赖babel-runtime，所以要安装这三个插件
                            ["@babel/preset-env", {

                                // useBuiltIns和targets结合，useBuiltIns设置"usage",解决了自动添加需要用到的polyfill函数；
                                // babel会根据基于targets基础浏览器支持的函数和es版本，和自己js中用到的不被这些浏览器支持的函数和语法做对比，自动添加那部分不被支持的语法和语法之外的函数【例如promise】
                                // "useBuiltIns": "usage", //usage:按需使用,不用自动import；  false：不引入polyfill，所以只支持es新版本的语法，不支持Promise等额外的函数；entry：在公共文件出自己一次性引入整个polyfill
                                "useBuiltIns": "usage", //usage:按需使用,不用自动import；  false：不引入polyfill，所以只支持es新版本的语法，不支持Promise等额外的函数；entry：在公共文件出自己一次性引入整个polyfill
                                // "targets": { //这个是转义的基础，就是babel在这些浏览器的基础上去转义，因为很多浏览器自己就支持了es6，如果用polyfill全兼容打包，就太浪费了，所以打包是基于哪些浏览器，写在这里
                                //     "browsers": ["ie>=9", "chrome>=52", "safari>=60", "firefox>=20", "edge>=17", "android>=4.4", "ios>=7", "node>=6.0"] //node还没设置；支持node环境几点几版本，一般前端不用兼容node，后端才需要
                                // },
                                "targets": {
                                    chrome: '52',
                                    firefox: '60',
                                    ie: '9',
                                    safari: '60',
                                    edge: '17'
                                },
                                // // "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | false, defaults to "commonjs"
                                // "modules": false,
                                "corejs":"3"
                                // "corejs": 3.4 //这个设置用到了@babel/runtime-corejs3插件，版本有2和3，必须用到，否则js报错;useBuiltIns设置为usage必须要和corejs属性结合使用【corejs就是替代polyfill的，按需转化js】

                            }]
                        ],
                        cacheDirectory: false//从缓存中获取，加速webpack打包编译速度（babel转化很影响速度）
                    },
                },

                //这个千万别放错位置，之前放在了babel-loader的options里面，错误提示都没有，调试webpack都快把自己调试瞎了，

                //有些nodemodule的插件，引用用到自己的js里面，但是没有转化，需要include进来
                // include: [path.resolve(__dirname, '../src'),
                //             path.resolve(__dirname, '../mock'),
                //             path.resolve(__dirname, '../node_modules/quill'),
                //             path.resolve(__dirname, '../node_modules/quill-image-drop-module'),
                //             path.resolve(__dirname, '../node_modules/quill-image-drop-module'),
                //             path.resolve(__dirname, '../node_modules/quill-image-resize-module'),
                //             path.resolve(__dirname, '../node_modules/vue-quill-editor'),
                //             path.resolve(__dirname, '../node_modules/ant-design-vue')
                //             ],
                exclude: /(node_modules|bower_components)/ //不需要转码的文件【只需要用babel转码自己的项目中用到的文件即可，其他插件不需要它来转码，不然一堆没用的log看都看不过来】

            }, {
                test: /\.(sass|scss|css)$/, //.scss|sass|css文件编译：正常编译顺序为顺序 style-loader|mini-css-extract-plugin； css-loader 和 sass-loader 来编译处理;use里面是一个loader数组
                oneOf: [{
                    resourceQuery: /mc/, //在js中用import styles from "./index.scss?mc";//不同后缀，解析不同的rem，每个页面的rem对应的px可能不一样"./index.scss?l"，解析的时候，做不同的处理
                    use: getLoader("mc") //如果js中require了多个css文件，nameExtractTextPlugin会把多个css文件合并成一个，这个css是否压缩，主要看use里面的第一个匹配项的设置是否压缩
                }, {
                    use: getLoader()
                }]

            }, {
                test: /\.html$/, //js里面直接通过import或者require加载的html，会自动转化成html字符串存储在js里
                loader: 'html-loader',
                options:{
                    // publicPath:""
                    //启用/禁用 ES modules 语法,这个设置为false，那么在html里面都没法以模块的require("...")方式加载html了【require方式返回的是模块，模块.default可以拿到html字符串】,但还是可以通过import来获取html字符串
                    esModule:false//默认为true，禁用它，就会导致无法用esModule的方式引入html，需要通过require的方式来引入

                    //禁用html里面的img标签的src属性的处理，因为在ie11下webpack5会执行new URL(),而URL这个web api不支持ie11，这个问题非常难搞，干脆就把所有的图片的src都不做任何处理，加载为原来的url
                    //  这样有一个坏处，就是html文件中的图片的相对地址是以html页面所在的目录为更目录【更目录就是localhost或者https://github.com/】，而不是以原来的html文件，所以写相对地址要特别注意
                    // 统一用/recommend访问src，比如图片在common下，写img地址就用/recommend/common
                    // sources: {
                    //     list:[{
                    //         // Attribute name
                    //         attribute: "src",
                    //         // Type of processing, can be `src` or `scrset`
                    //         type: "src",
                    //         // Allow to filter some attributes (optional)
                    //         filter: (tag, attribute, attributes, resourcePath) => {
                    //           return tag.toLowerCase() !== "img";
                    //         }
                    //     }]
                    // }
                }
                // options:{//,/(['"])https:\/\/[^'"]*\1/,/(['"])\/\/[^'"]*\1/
                //     minimize: false,
                //     interpolate: true //可以再html文件里面通过${require('../components/layout/footer.html')}来插入html片段，打包的时候会打在一起
                //     // ignoreCustomFragments: [/(['"])https:\/\/[^'"]*\1/],//忽略某些字段里面的选项，双括号一般是template里面的语法
                //     // root: imageRoot,
                //     // attrs: ['img:src']
                // }
            }
            // {//不需要任何处理的html的template，用file拷贝；前端请求的时候，会把这个资源按照html静态资源加载；
            //     test:/template\.html$/,
            //     loader:"file-loader",
            //     options:{
            //         name:"[path][name].[ext]"
            //     }
            // }
        ]


    }
};

module.exports = config



// mini-css-extract-plugin：把js中import导入的样式文件，单独打包成一个css文件，结合html-webpack-plugin，以link的形式插入到html文件中。