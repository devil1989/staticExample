// unfinish：ant-design框架接入,vue,react使用，
// unfinish:ie8兼容和es3兼容【基本不用，现在都只兼容ie9+】；验证cookie和fastclick，zepto是否正常使用

/*
 dev文件里面没有添加html生成插件和html热替换，这个文件里面添加html热替换，这样可以把前端开发环境完全独立出来，就算没有后端，也可以直接进入前端开发，需要用到的后端数据都用mock数据
 */


// 关于各个插件的详细应用，大多数在vew-component项目里面，一部分在这里，以这里的为主！！！！！！！！！！！

// webpack5弃用了raw-loader 、url-loader 、file-loader ：如果要继续使用，需要添加type:"javascript/auto"来禁用新添加的assets功能，具体详见https://blog.csdn.net/wu_xianqiang/article/details/117171900



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



//
    配置环境：“webpack 5.x | babel-loader 8.x | @babel 7.x”
    desc:开发环境打包，因为webpack-dev-server的存在，实际的文件全部在内存里面改动，不会有任何文件变动；如果想看dev环境下的文件结果，
    可以执行命令 npm run dev，然后去dist文件夹查看，这个操作是针对dist文件夹里面的文件
    dist下的dll是开发环境下用到的dll文件，
    dist下的recommend是开发环境下的其他所有项目文件

*/

//插件的详细使用方法在node_modules对应文件加下的readme中都有介绍


let webpack = require("webpack");
let path = require("path");
let MiniCssExtractPlugin = require('mini-css-extract-plugin'); //从js中抽离css形成单独css文件的插件
var CopyWebpackPlugin = require('copy-webpack-plugin'); // 拷贝文件
let configInfo = require("./js/config");
let utilInfo = require("./js/util");
let localAddress = configInfo.localAddress;
let workingDir = configInfo.workingDir;
let getPages = utilInfo.getPages;
let getEntries = utilInfo.getEntries;
let HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动写入将引用写入html
let folderName = "recommend";
let HtmlWebpackPluginArray = getAllHtmlWebpackPlugin();
let baseConfig=require("./webpack.config.base");



function getAllHtmlWebpackPlugin() { //多个页面入口，需要有新建多个HtmlWebpackPlugin插件对象
    var arr = [];
    // entrysInfo=resolveEntry('./src/app/js/*.js', '.js', __dirname);//resolveEntry('./scripts/!(ui|mock|_)*.js', '.js', __dirname);【可以忽略某些，也可以多选】
    var app = getEntries(getPages("app"));
    var enteryObj = Object.assign({}, app);;

    for (chunkName in enteryObj) {

        //html的图片，css，js，以及css中的图片和@import的css，他们的路径发包方式：
        //html生成后html里面自动插入的js=output.publicPath+output.filename(其实就是和output打包的输出路径一致)
        //html文件里面的css路径=output.publicPath+ExtractTextPlugin 的路径设置（因为css通过插件特殊处理了）
        //html里面的image路径,.css文件中的img的url路径=output.publicPath+图片在html中的路径src目录中的相对路径，因为这个原因，publicPath只能设置成和build，dist的父层；当然也可以重设url-loader的publicPath，例如publishImagePath这个变量
        //他的html-loader用的就是webpack的html-loader，包括压缩操作
        var configObj = { //生成html （热插拔：配置1（没有这个动态生成html文件，热插拔无法正常监控））
            filename: path.resolve(__dirname, "../dist/" + folderName + "/" + chunkName + "/index.html"), //html放到哪个文件夹下
            template: path.resolve(__dirname, "../src/" + chunkName + "/index.html"), //对应的html，必须制定，否则就产生一个内容为空，只有js引用的html文件；这个html用的是html-loader插件
            chunks: [chunkName],
            hash: true
        };
        arr.push(new HtmlWebpackPlugin(configObj)); //该插件作用是按照入口的chunk名称，生成对应的html文件，该html文件可以指定对应的html（这个html文件中，会自动插入该chunk的js）
    };

    return arr;
}


// __dirname表示当前文件所在的目录
let config = {
    mode: 'development',
    devtool: 'source-map',
    output: {
        // environment: {
        //     arrowFunction: false
        // },
        path: path.join(workingDir, "../dist/" + folderName + "/"), //path指定了本地构建地址(打包后的输出路径)
        filename: "[name]/bundle.js", //文件打包后的名字【这个name就是entry里面的key，把key做成"app/react_demo"这种类型，因为浏览中的entry文件访问地址是publicPath+filename
                                      //fileName这样设置，会造成一个问题，这样相当于把入口文件的根设置在了folderName这个文件夹下；要让其他静态资源打包后生成的位置和这里的文件匹配
                                    // 就必须修改图片，wof等这些所有静态资源的filename的格式，它们如果设置成[path][name].[ext]，虽然访问没有问题，但是文件结构和entry入口的js以及css文件错开了
        publicPath: '//localhost:8080/' + folderName + '/' //publicPath指定的是构建后在html里src和href的路径的基础地址（HtmlWebpackPlugin这个插件就是用这个publicPath来生成对应的html），也是url-loading加载的图片和iconfont的基础路径
                                                           //同样也是只它在浏览器中访问时的基础地址，基础地址+filename就可以在浏览器中访问到对应的文件了【只针对entry里面的文件】
    },

    plugins: HtmlWebpackPluginArray.concat([

        new webpack.DllReferencePlugin({//引用dll文件，对于那些vue，react,zepto等基本不变第三方库，走本地的dll文件，需要在html中自己引入dll文件
            context: __dirname,
            manifest: require('../src/dll/dev/manifest.json')
        }),

        new CopyWebpackPlugin({
            patterns:[{ //文件拷贝，如果拷贝了webpack其他插件（例如HtmlWebpackPlugin生成的html），它就会影响HtmlWebpackPlugin的执行，导致热替换失败
                from: path.resolve(__dirname , '../src/dll/dev'), 
                to:  path.resolve(__dirname , '../dist/recommend/dll/dev')
            },{ 
                from: path.resolve(__dirname , '../src/common/assets/ico'), 
                to:  path.resolve(__dirname , '../dist/recommend/common/assets/ico')
            }]
            // {
            //     ignore:["*.js"] //忽略.js文件
            // },
        }),

        
        new MiniCssExtractPlugin({ //html里面的css路径=output.publicPath+这里设置的路径;也可以自己设置插件自定义的publicPath
            filename: "[name]/bundle.css"
        }),

        //过滤掉antd vue除了中文以外的语言包，因为不做i18国际化
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),

        new webpack.HotModuleReplacementPlugin(), // HMR插件将HMR Runtime代码嵌入到bundle中，能够操作APP代码，完成代码替换

        new webpack.ProvidePlugin({
            'window.Quill': 'quill/dist/quill.js',
            'Quill': 'quill/dist/quill.js'
        })
    ]),
    resolve: {
        modules: [ //import或者require的时候入口简写，可以直接引用下面文件夹下的文件
            path.resolve(__dirname, '../node_modules'),
            path.resolve(__dirname, '../src/common'),
            path.resolve(__dirname, '../src/lib'),
            path.resolve(__dirname, '../src/components')
        ],
        alias: { //给对应的模块取别名:不会影响文件打包大小，不会因为别名而导致dll重复加载对应的库
            // "Zepto":path.resolve(__dirname, '../node_modules/zepto-webpack/zepto.js'),
            // 'Cookies': path.resolve(__dirname, '../node_modules/cookies'),
            // 'React': path.resolve(__dirname, '../node_modules/react'),
            // 'ReactDOM': path.resolve(__dirname, '../node_modules/react-dom'),
            'vue': path.resolve(__dirname, '../node_modules/vue/dist/vue.esm.js'),//默认是运行时版本，没有compile，dev环境下引入需要完整版，vue.esm.js，有编译器才能编译template
            "@ant-design/icons/lib/dist$": path.resolve(__dirname, "../src/icon/index.js"),
            // 'Redux': path.resolve(__dirname, '../node_modules/redux'),
            // 'ReactRedux': path.resolve(__dirname, '../node_modules/react-redux'),
            // 'ReduxThunk': path.resolve(__dirname, '../node_modules/redux-thunk'),
            'core-js/library/fn':path.resolve(__dirname, '../node_modules/core-js/features'),//因为ant-design用到了core-js2.6.11，不兼容core-js3.X版本，导致报错
            'js-base64':path.resolve(__dirname, '../node_modules/js-base64/base64.js')
        }
    },
    optimization: { //替代webpack.optimize.OccurrenceOrderPlugin()
        chunkIds: 'named', //打包出来的文件根目录名称【dist下的一级子文件夹】
        minimize: true,
        minimizer: [] //不压缩

    },
    devServer: {
        host: "localhost",
        port: 8080,
        liveReload: true,
        // static:["src"],
        // watchFiles:true,
        // open: true,
        // watch:true,//默认就开启的，文件修改，页面会自动刷新
        // watchFiles:["文件路径"]：监听特定的页面
        hot: true,
        client: {
            logging: 'info',
            progress: true
        },

        /*
            static设置和output一一对应上，然后把dist打包产生的recommend和本地的scr对应上；
            这样，就保证了静态资源【图片，字体，dll打包好的静态资源等】的dev环境访问路径和webpack打包后js和css入口的访问路径是一致的；
            devServer模式启动的时候，静态资源访问路径和“webpack的js，css入口文件访问路径,html页面访问路径”是不同的，所以需要static设置
            这样做还有一个好处就是，线上的静态资源，只要把host/recommend同样定位到dist下的recommend，产生和开发环境一样的效果
            保持开发环境和线上环境除了host之外的所有访问路径是一样的
         */
        static:[
        {//这个映射是自己再本地开发的时候用的，本地开发文件变了，效果对应也变
            publicPath:'/' + folderName + '/' ,//和output的publicPath保持一致
            directory:path.join(__dirname , '../src/')//和output的path保持一致
        }
        // {//这个是为了和node端联调的时候，node端的html访问的都是压缩文件的地址，所以设置这个静态资源地址
        //     publicPath:'/' + folderName + '/' ,//和output的publicPath保持一致
        //     directory:path.join(__dirname , '../dist/'+folderName+"/")//和output的path保持一致
        // }
        ]
        // open:true
    }
};

config=Object.assign({},baseConfig,config);

module.exports = config



// mini-css-extract-plugin：把js中import导入的样式文件，单独打包成一个css文件，结合html-webpack-plugin，以link的形式插入到html文件中。