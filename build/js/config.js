let ip=require("ip");
let path=require("path");
let localIP = ip.address(),
	localAddress = `http://${localIP}:8080`,
	hmr = `webpack-hot-middleware/client?path=${localAddress}/__webpack_hmr&reload=true`,
    workingDir = path.join(process.cwd(),"src/");//process.cwd()返回的是当前Node.js进程执行时的工作目录，保证了文件在不同的目录下执行时，路径始终不变;而__dirname是文件所在目录

module.exports={
	localAddress,
	hmr,
	workingDir
}