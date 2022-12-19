/*:插件只做和使用详见：https://www.cnblogs.com/chris-oil/p/9833741.html和https://blog.csdn.net/liuqi332922337/article/details/53560882
plugin是一个具有 apply方法的 js对象。 apply方法会被 webpack的 compiler（编译器）对象调用，并且 compiler 对象可在整个 compilation（编译）生命周期内访问。

webpack插件的组成：

一个JavaScript函数或者class（ES6语法）。
在它的原型上定义一个apply方法。
指定挂载的webpack事件钩子。
处理webpack内部实例的特定数据。
功能完成后调用webpack提供的回调。*/
let fs=require("fs");
let path=require("path");

class FileMap {

    /**
     * @param {PluginOptions} [options]
     */


    constructor(options = { isMap: false }) {
        this.folderName = options.folderName;
        this.version=options.version;
    }
    /**
     * @param {Compiler} compiler
     */

    //apply内是异步调用，不能用node调试去调，constructor函数因为是同步的，所以可以用node调式文件的方法去调试
    //真的要开发npm插件，用安装npm link去调试
    apply(compiler) {
        const {
            webpack
        } = compiler;
        let  folderName = this.folderName;
        let  version=this.version;
        let  dllPath=folderName+"dll";


        // compiler.plugin：webpack以前的注册方法:compiler.hooks.done.tapAsync和compiler.hooks.done.tap是在done事件上挂载同步和异步方法
        // 详细事件钩子名称见：https://webpack.docschina.org/api/compiler-hooks/
        compiler.hooks.done.tap("FileMap", function(stats) {
            const output = {};
            

            let assetsByChunkName = stats.toJson().assetsByChunkName;
            for (let chunkName in assetsByChunkName) {
                let chunkValue = assetsByChunkName[chunkName];
                if (chunkValue instanceof Array) {
                    for (let i = 0; i < chunkValue.length; i++) {
                        let asset = chunkValue[i];
                        let originalPath = asset;
                        // let originalPath = asset.replace(/-[0-9a-z]+\./i, '.');
                        output[folderName + originalPath] = folderName +version+"/"+ asset;
                    }
                } else {
                    let originalPath = chunkValue;
                    // let originalPath = chunkValue.replace(/-[0-9a-z]+\./i, '.');
                    output[folderName + originalPath] = folderName +versionn+"/"+ chunkValue;
                }
            }
            output[folderName + "common/dll/app.js"] = dllPath + "/app.js"; //不添加hash，因为这个一般不会变，不需要每次都更新，添加用户下载量
            fs.writeFileSync(
                path.join(__dirname, "../../assets-mapping.json"),
                JSON.stringify(output)
            );
        })
    }
}
module.exports = FileMap