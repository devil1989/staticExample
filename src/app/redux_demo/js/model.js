import { getClassWebapiHost } from 'ajaxbase';

//opts中包含了ajax的所有需要的参数
export function getData(opts){
	var host=getClassWebapiHost();
	return new Promise(function(resolve,reject){
	    // $.ajax({
	    //     type:opts.type,
	    //     url:host+opts.url,
	    //     success:function(data){
	    //         if(data.status==0){//成功
	    //             resolve(data)//在异步操作成功时调用
	    //         }else{//status不为0表示失败
	    //             reject(data);//在异步操作失败时调用
	    //         }
	    //     }
	    // });
	    setTimeout(resolve({age:24}),10);//模仿异步
	})
	
}