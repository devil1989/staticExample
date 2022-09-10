/*
 desc:线上环境打包，为发布用的，操作的是dist文件夹下的文件
 */

let webpack=require("webpack");
let path=require("path");
let MiniCssExtractPlugin = require('mini-css-extract-plugin');//从js中抽离css形成单独css文件的插件
let CssMinimizerPlugin = require("css-minimizer-webpack-plugin");//css压缩插件
let MiniJs=require("terser-webpack-plugin");//js压缩插件，其实webpack只要在webpack.DefinePlugin设置production，就可以自动压缩js，但是在压缩css的时候，js就不会在压缩了，所以得用这个额外插件
var CopyWebpackPlugin = require('copy-webpack-plugin'); // 拷贝文件
let configInfo=require("./js/config");
let utilInfo=require("./js/util");
let localAddress=configInfo.localAddress;
let workingDir=configInfo.workingDir;
let getPages=utilInfo.getPages;
let getEntries=utilInfo.getEntries;
let HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动将引用写入html
let fs=require("fs");
let folderName="/recommend/";//项目文件夹名称，放在dist文件夹下
let date=new Date();
let version=date.getFullYear()+"_"+(date.getMonth()+1)+"_"+date.getDate()+"_"+ Date.now();
var HtmlWebpackPluginArray=getAllHtmlWebpackPlugin();
let baseConfig=require("./webpack.config.base");
// let FileMap=require("./plugin/fileMap.js");


//prod环境下，不需要生成html文件，因为入口文件是从服务器那边返回的html文件，这个是用于没有node后端服务器的情况下，前端用dev-server来模拟后端服务器，才需要用这个HtmlWebpackPlugin生成html文件【可以自定义】
function getAllHtmlWebpackPlugin (){//多个页面入口，需要有新建多个HtmlWebpackPlugin插件对象
    var arr=[];
    // entrysInfo=resolveEntry('./src/app/js/*.js', '.js', __dirname);//resolveEntry('./scripts/!(ui|mock|_)*.js', '.js', __dirname);【可以忽略某些，也可以多选】
    /*entrysInfo的内容格式是
    {
        "common":"D:/myGit/VueWeb/backendsite/vue-demo/src/pages/common.js",//chunk的名称就是文件名（不包括后缀）
        "index":"D:/myGit/VueWeb/backendsite/vue-demo/src/pages/index.js"
    }*/
    var app=getEntries(getPages("app"));
    var enteryObj=Object.assign({},app);;

    for (chunkName in enteryObj){

        //html的图片，css，js，以及css中的图片和@import的css，他们的路径发包方式：
        //html生成后html里面自动插入的js=output.publicPath+output.filename(其实就是和output打包的输出路径一致)
        //html文件里面的css路径=output.publicPath+ExtractTextPlugin 的路径设置（因为css通过插件特殊处理了）
        //html里面的image路径,.css文件中的img的url路径=output.publicPath+图片在html中的路径src目录中的相对路径，因为这个原因，publicPath只能设置成和build，dist的父层；当然也可以重设url-loader的publicPath，例如publishImagePath这个变量
        //他的html-loader用的就是webpack的html-loader，包括压缩操作
        var configObj={//生成html （热插拔：配置1（没有这个动态生成html文件，热插拔无法正常监控））
            filename:path.resolve(__dirname,"../dist"+folderName+chunkName+"/index.html"),//html放到哪个文件夹下
            template:path.resolve(__dirname,"../src/"+chunkName+"/index.html"),//对应的html，必须制定，否则就产生一个内容为空，只有js引用的html文件；这个html用的是html-loader插件
            chunks:[chunkName],
            hash:true
        };
        arr.push(new HtmlWebpackPlugin(configObj));//该插件作用是按照入口的chunk名称，生成对应的html文件，该html文件可以指定对应的html（这个html文件中，会自动插入该chunk的js）
    };

    return arr;
}



//生成webpack.assets.json：js和css文件都打上hash，用于去除缓存，这个webpack-assets.json文件里面就是给每个文件添加一个hash的map，然后服务端就用这个json文件去给服务端的js和css文件重命名
/*这个方法不好，还有img文件，等其他文件，也会出现缓存，直接每次发布创建一个日期命名的文件路径，作为槽，每次发布，这个槽就换一下，这样前端代码线上回滚就非常简单，保留最近10次发布的前端资源
  一旦某个版本出现问题，需要回滚，只要修改html文件内的js和css的引用槽位，就直接请求之前版本的静态文件了，而且之前版本也在线上没删，所以能瞬间回滚
 */
function fileMappingPlugin() {//this就是compiler；这个函数就是回调函数；可以直接把函数放到plugins数组里面，也可以用正规的new FileMap({参数})的方式来添加插件，都一样
    // webpack5添加钩子的方法变了：compiler.plugin("done")变成了 compiler.hooks.done.tap("插件名称"，function(){})，各种钩子的名称以及挂载方法见：https://webpack.docschina.org/api/compiler-hooks/
    this.hooks.done.tap("myTest",function(stats) {
        const output = {};
        let assetsByChunkName = stats.toJson().assetsByChunkName;
        for (let chunkName in assetsByChunkName) {
            let chunkValue = assetsByChunkName[chunkName];
            if (chunkValue instanceof Array) {
                for (let i = 0; i < chunkValue.length; i++) {
                    let asset = chunkValue[i];
                    // let originalPath = asset;
                    let originalPath = asset.replace(/-[0-9a-z\_]+\./i, '.');
                    output[folderName + originalPath] = folderName+ asset;
                }
            } else {
                // let originalPath = chunkValue;
                let originalPath = chunkValue.replace(/-[0-9a-z\_]+\./i, '.');
                output[folderName + originalPath] = folderName + chunkValue;
            }
        }

        //dll也需要添加hash
        fs.readFile(`${workingDir}/dll/prod/dll_mapping.json`,"utf8",function(err,data){
            let fileData=JSON.parse(data);
            let key=Object.keys(fileData)[0];
            output[key] = fileData[key]; 
            fs.writeFileSync(
                path.join(__dirname, "../assets-mapping.json"),
                JSON.stringify(output)
            );
            fs.writeFileSync(
                path.join(__dirname, "../dist/assets-mapping.json"),
                JSON.stringify(output)
            );
        });

            
    })
}


let config = {
    mode: 'production',
    output: {
        path: path.join(workingDir, "../dist"+folderName + "/"),
        filename: "[name]/bundle-"+version+".js",//hash方式用"[name]/bundle-[chunkhash:5].js"，也可以用前置文件夹来控制槽位，从而做到去缓存
        publicPath: folderName //这个写相对地址很关键，因为所有的图片，css，等链接，都用这个地址，这个写相对地址，打包不管是qa，yz，还是线上，打出来的都是相对地址，不会出错
    },
    plugins: HtmlWebpackPluginArray.concat([
        
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../src/dll/prod/manifest.json')//遇到这个json文件内包含的模块，就自动给忽略打包
        }),

       /* 
        dev和prod的dll完全相互独立
        */
        new CopyWebpackPlugin({
            patterns:[{ //文件拷贝，如果拷贝了webpack其他插件（例如HtmlWebpackPlugin生成的html），它就会影响HtmlWebpackPlugin的执行，导致热替换失败
                from: path.resolve(__dirname , '../src/dll/prod'), 
                to:  path.resolve(__dirname , '../dist/recommend/dll/prod')
            },{ 
                from: path.resolve(__dirname , '../src/common/assets/ico'), 
                to:  path.resolve(__dirname , '../dist/recommend/common/assets/ico')
            }]
        }),

        new MiniCssExtractPlugin({ //html里面的css路径=output.publicPath+这里设置的路径;也可以自己设置插件自定义的publicPath
            filename: "[name]/bundle-"+version+".css"
        }),

        //过滤掉antd vue除了中文以外的语言包，因为不做i18国际化
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),

        fileMappingPlugin,//创建mapping文件，后台拿到这个mapping文件，就只要用前面的kep左右引用的js和css的url即可，同时后台再写一个中间件插件，让key转化成对应的value
        // new FileMap({version:version,folderName:folderName})//创建mapping文件，后台拿到这个mapping文件，就只要用前面的kep左右引用的js和css的url即可，同时后台再写一个中间件插件，让key转化成对应的value

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

            //这个必须是完整版本【包含编译器】，而不是运行时版本，因为这个表示引用vue的时候，用完整版本的vue来编译对应的html，如果是运行时就无法编译了,而在dll文件中，用vue.runtime.esm.js这个运行时版本
            // 因为npm run prod运行的时候已经用这里的vue的完整版本把html模板编译成string插入到js里面了，页面下载js的时候下载的vue是dll里面设置的vue版本，所以dll里面用运行时即可
            'vue': path.resolve(__dirname, '../node_modules/vue/dist/vue.esm.js'),

            //过滤掉antd vue里面的icon，这个超级肯爹，icon文件好几百k
            "@ant-design/icons/lib/dist$": path.resolve(__dirname, "../src/icon/index.js"),
            // 'Redux': path.resolve(__dirname, '../node_modules/redux'),
            // 'ReactRedux': path.resolve(__dirname, '../node_modules/react-redux'),
            // 'ReduxThunk': path.resolve(__dirname, '../node_modules/redux-thunk'),
            'core-js/library/fn':path.resolve(__dirname, '../node_modules/core-js/features'),//因为ant-design用到了core-js2.6.11，不兼容core-js3.X版本，导致报错
            'js-base64':path.resolve(__dirname, '../node_modules/js-base64/base64.js')
        }
    },
    optimization: {//替代webpack.optimize.OccurrenceOrderPlugin()
        chunkIds: 'named',//打包出来的文件根目录名称【dist下的一级子文件夹】
        minimize: true,
        minimizer:[new CssMinimizerPlugin(),new MiniJs()]//压缩
        // minimizer:[]//压缩
    }
};


config=Object.assign({},baseConfig,config);

module.exports=config


    