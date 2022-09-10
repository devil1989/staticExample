import * as ajax from "ajax.js";

let config={
    classHost:'cgclubs.com'//api的基础地址
};

window.$=ajax;

//ajax基础model，用于集成mock数据,后续其他全局ajax封装都可以写在这里面
export class BaseModel{
    constructor(opts){
        this.opts=opts;
        this.init();
    }

    init(){
        var opts=this.opts;
        if(this.opts.mock&&window.mockData){//url后有mock参数，且ajax手动添加了mock参数，才会走mock，正常url请求都是走线上数据
            this.promise=new Promise(function(resolve,reject){
                setTimeout(function(){
                    resolve(window.mockData[opts.mockUrl||opts.url]);
                },1000);//settimeout模仿ajax；虽然不是很完美，但却非常简单，暂时这么用
            });
        }else{
            this.promise=new Promise(function(resolve,reject){
                var host=getClassWebapiHost();
                if(opts.type=="get"){
                    if(opts.dataType&&opts.dataType.toUpperCase()=="JSONP"){
                        opts.data.timeStamp=(+new Date());//去缓存
                        $.ajax({
                            type:"get",
                            dataType:"jsonp",

                            //这个必须要设置text/javascript，而且后端也需要设置相同，否则会报mime错误
                            contentType:"text/javascript",
                            url:host+opts.url,
                            data:opts.data,
                            success:function(response){
                                if(response.status==200){//成功
                                    resolve(response)//在异步操作成功时调用
                                }else{//
                                    reject(response);//在异步操作失败时调用
                                }
                            },
                            //异常error
                            error:function(e){
                                console.log(e);
                            }
                        })
                    }
                    else{
                        //ajax默认会把get请求的key和value都encodeURIComponent转译
                        opts.data.timeStamp=(+new Date());//去get缓存
                        var param={"json":JSON.stringify(opts.data)};
                        $.ajax({
                            type:"get",
                            url:host+opts.url,
                            //这个json告诉后端get请求的是通过json格式数据用stringify后传过来的
                            //后端接收到的数据是url?json=fdasfdsafsa...乱码;
                            // 其中$.ajax会把json的value默认用encodeURIComponent转译
                            // data:{"json":encodeURIComponent(JSON.stringify(opts.data))},
                            data:param,
                            dataType: 'json',//必须要写json，否则默认是字符串格式，写这个，请求回来以后，会把返回的字符串转成json
                            success:function(data){
                                if(data.status==200){//成功
                                    resolve(data)//在异步操作成功时调用
                                }else{//
                                    reject(data);//在异步操作失败时调用
                                }
                            },
                            //异常error
                            error:function(e){//通用网络错误不作处理
                                console.log(e);
                            }
                        });
                    }
                }else{
                    if(opts.upload){
                        $.ajax({
                            type:(opts&&opts.type)?opts.type:"get",
                            url:host+opts.url,
                            data:opts.data,
                            dataType: 'json',//如果不用dataType，默认传的是form数据，数据只能传一层，多层的数据会按照属性遍历分开传
                            cache:false,
                            precessData:false,//data数据无需序列化，必须为false，以为长传的是文件流信息
                            contentType:"upload",//必须告诉$.ajax是upload，不需要设置contentType，我在$.ajax里面添加了upload的特殊处理逻辑
                            success:function(response){
                                if(response.status==200){//成功
                                    resolve(response)//在异步操作成功时调用
                                }else{//status不为0表示请求失败
                                    reject(response);//在异步操作失败时调用
                                }
                            },
                            //异常error
                            error:function(e){
                                console.log(e);
                            }
                        });
                    }else{
                        $.ajax({
                            type:(opts&&opts.type)?opts.type:"get",
                            url:host+opts.url,
                            data:JSON.stringify(opts.data),
                            dataType: 'json',//如果不用dataType，默认传的是form数据，数据只能传一层，多层的数据会按照属性遍历分开传
                            contentType: 'application/json',//后端如何解析这个数据
                            success:function(response){
                                if(response.status==200){//成功
                                    resolve(response)//在异步操作成功时调用
                                }else{//status不为0表示请求失败
                                    reject(response);//在异步操作失败时调用
                                }
                            },
                            //异常error
                            error:function(e){
                                console.log(e);
                            }
                        });
                    }
                        
                }
                
            })
        }
    }
}

export function getClassWebapiHost() {
    let webapiHost,
        host = location.host;
    if (/^local/i.test(host)) {
        //接口发布到哪个分支环境就配成哪个分支环境
        //webapiHost = `//${config.classHost}`;
        webapiHost = '/ajax';
        
    } else if (/^qa\d/i.test(host)) {
        let mstrs = location.host.match(/^qa\d/i);
        let qa=mstrs?mstrs[0]:'qa1';
        webapiHost = `//${qa}${config.classHost}/ajax`;
    } else if (/^qa/i.test(host)) {
        webapiHost = `//qa${config.classHost}/ajax`;
    } else if (/^yz/i.test(host)) {
        webapiHost = `//yz${config.classHost}/ajax`;
    } else {
        webapiHost = `//${config.classHost}/ajax`;
    }
    return webapiHost;
}

//获取环境
export function getENV() {
    let host = location.host;
    if (/^local/i.test(host)) {
        return 'local';
    } else if (/^qa\d?/i.test(host)) {
        return 'qa';
    } else if (/^yz/i.test(host)) {
        return 'yz';
    } else {
        return '';
    }
}
