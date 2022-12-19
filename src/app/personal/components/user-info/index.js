import Vue from "vue";
import {Form,Upload,Modal,InputNumber,Checkbox,notification} from 'ant-design-vue';
require('ant-design-vue/lib/form/style/index.css');
require('ant-design-vue/lib/upload/style/index.css');
require('ant-design-vue/lib/modal/style/index.css');
require('ant-design-vue/lib/input-number/style/index.css');
require('ant-design-vue/lib/checkbox/style/index.css');
require('ant-design-vue/lib/notification/style/index.css');
import Templates from "./index.html";
var template=Templates;

require("./index.scss");

Vue.use(Form);
Vue.use(Upload);
Vue.use(Modal);
Vue.use(InputNumber);
Vue.use(Checkbox);
notification.config({
    duration:4
});
Vue.prototype.$notification=notification;


//组件公共对外的api直接可以在逐渐内定义，然后外面随时可以调用
//组件特殊生命周期内的回调函数，需要组件初始化的时候从外面传进来
var { Cookies,Base64,BaseModel,util={} }=window.Util;
var {getEncryptData,getPersonalXssRule} = window.Util.util;
var {isTel,isUserName,isPassward}=window.Util.validate;
var {toast}=util;

//本地文件预览方法【input type=file标签下实现预览功能】：1.FileReader ：ie10+；2.window.URL.createObjectURL||window.webkitURL.createObjectURL【不再需要这些 URL 对象时，每个对象必须通过调用 URL.revokeObjectURL() 方法来释放】
// window.URL.createObjectURL实现方法：在input type="file"的标签的change事件中，使用$("video").attr("src", window.URL.createObjectURL(this.files[0]));其中this.files就是需要上传的所有文件
// ie10以下，要实现图片和视频的预览，就要用到服务器，ajax上传到服务器产生图片或视频【放到临时文件夹】，最后自动删除，如果用户决定上传，在把临时文件夹的内容同步到数据库。

// 本地视频转canvas，可以用canvas+requestAnimationFrame 来实现，本地图片转canvas可以用ctx.drawImage(img,0,0, width,height);+canvas.toDataURL("image/jpeg", quality)实现

//浏览器10+自带的base64：window.atob和window.btoa
function getBase64(img, callback) {
  const reader = new FileReader();//html5添加的FileReader函数，定义读取文件方法和对应的事件
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


function setCanvas({img,canvas,wrapper,scale=10,that}){
    var width=(img.width||110)*scale;
    var height=(img.height||110)*scale;
    var ctx = canvas.getContext("2d");
    var quality=1,base64;
    var startX=0,startY=0,endX=0,endY=0;
    var swidth,sheight;//裁剪的宽高
    var top=0,left=0;//裁剪画布的top和left定位

    canvas.height=height;//canvas不设置大小，画出来的图片就会被截断
    canvas.width=width;//canvas不设置大小，画出来的图片就会被截断
    ctx.clearRect(0, 0, width,height);
    ctx.drawImage(img,0,0, width,height);
    var base64 = canvas.toDataURL("image/jpeg", quality); 
    that.$store.commit("updateUserPic",{height:height,width:width,url:base64});//设置div的宽高和图片url

    //里面是图片裁剪的逻辑
    setTimeout(function() {
        img=document.querySelector(".preview-img img");//因为图片放大了，所以要以新的图片作为蓝本
        if(height==width){//就是上面默认的ctx.drawImage(img,0,0, width,height);，不需要重新裁剪
            swidth=width;
            sheight=height;
        }else if(height>width){
            canvas.height=width;
            canvas.width=width;
            startY=(height-width)*0.5;
            swidth=width;
            sheight=width;
            top=startY;
            ctx.drawImage(img,startX,startY,swidth,sheight,0,0,swidth,sheight);//
            that.$store.commit("updateUserPic",{startY:startY,startX:0,cutHeight:swidth,cutWidth:sheight});
        }else{
            //新画布大小和原来的不一样，需要重新设置
            canvas.height=height;
            canvas.width=height;
            startX=(width-height)*0.5;
            swidth=height;
            sheight=height;
            left=startX;
            ctx.drawImage(img,startX,startY,swidth,sheight,0,0,swidth,sheight);
            that.$store.commit("updateUserPic",{startY:0,startX:startX,cutHeight:swidth,cutWidth:sheight});
        }
    },1);
}


let UserInfo = {

    data() {
        return {
            UserInfoFormElement:this.$form.createForm(this, { name: 'userInfo' }),
            loading: false
        }
    },

    computed:{
        userInfo(){
            return this.$store.getters.userInfo
        }
    },

    methods: {
        //如果自己实现的或，就在onchange事件里执行ajax，用post的方式把数据传给后台，获取ajax返回数据来判定是否上传成功，如果要预览，就在change事件里面先把图片转base64预览【可以用canvas转base64，也可以用FileReader转base64】
        // var formData = new FormData(form表单原生对象【 enctype="multipart/form-data"，method="post"】，用dom接口获取)，最后通过ajax({url：“”，type：“post”,data:formData})发送ajax请求上传file;
        // handleChange(info) {//是使用ajax上传的，post方式,antd-vue应该是把handleChange方法挂在了onreadystatechange上
        //     if (info.file.status === 'uploading') {
        //         this.loading = true;
        //         return;
        //     }
        //     if (info.file.status === 'done') {
        //         getBase64(info.file.originFileObj, imageUrl => {
        //           this.imageUrl = imageUrl;
        //           this.loading = false;
        //         });
        //     }

        // },

        //初始化用户信息：点击个人信息，点击取消的时候，都要用
        resetInfo(opts={}){
            var defaultInfo=this.userInfo.default;
            var cloneObj=JSON.parse(JSON.stringify(defaultInfo));
            cloneObj._id.val=this.userInfo._id;
            cloneObj.userPic.previewUrl=this.userInfo.userPic;
            cloneObj.time.val=this.userInfo.time;
            cloneObj.name.val=this.userInfo.name;
            cloneObj.userName.val=this.userInfo.userName;
            cloneObj.phone.val=this.userInfo.phone;
            cloneObj.age.val=this.userInfo.age;
            cloneObj.sex.val=this.userInfo.sex;
            this.$store.commit("updateUserInfo",{isEdit:false,data:cloneObj},opts);
        },

        //关于文件流的操作：Blob，FileReader；ArrayBuffer, ArrayBufferView,DOMString，FormData，ReadableStream：这些都需要恶补
        // Blob 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取，也可以转换成 ReadableStream 来用于数据操作。
        // ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区
        // ArrayBuffer 不能直接操作，而是要通过类型数组对象【Int8Array、Uint8Array、Int16Array、Uint16Array、Int32Array、Uint32Array、Float32Array、Float64Array 】或 DataView 对象来操作，
        // 它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容
        /*数据转化流程：
            1.Blob对象【文件，ele.file就是这个类型，也可以通过new Blob([new Uint8Array(['a','d','s'...])],{type:'数据类型，例如image/png'}) 来删除文件对象的原始数据】；
            2.ArrayBuffer ，对象用来表示通用的、固定长度的原始二进制数据缓冲区，可以在FileReader对象的onload时间中通过this.result获取；通过这个对象，可以获取到创建Blob时所需的Uint8Array数组，
            3.Uint8Array，类型数组，有非常多的类型数组，这些数据类型是构造Blob的前提，所以要像操作文件，必须要获得对应的Uint8Array或其类型数组对象
                Uint8Array([1,3,4]|ArrayBuffer)都可以生成Uint8Array对象，也就是说里面可以传入原始数组，也可以传入ArrayBuffer数据
            4.原始数组[]，这个就是二进制流的最底层，上面第三步中的Uint8Array或其他数组类型，都是接受原始数组的传入，接下来还可以用base64编码和解码；
            5.base64字符串，其实就是字符串，例如图片可以转成base64字符串【浏览器识别】；应用文件【例如php exe后缀的文件】也可以转成base64字符串，只是浏览器不识别而已，但这个数据流就是这个文件。
                其中 btoa (Binary to ASCII)：base64编码 这个函数是没有对+和/符号做兼容处理的，所以最好还是用兼容的js-base包，否则的话，自己还得写字符串处理的兼容问题
                     atob (ASCII to Binary)：base64解码 这个函数是没有对+和/符号做兼容处理的，所以最好还是用兼容的js-base包，否则的话，自己还得写字符串处理的兼容问题
        如何从Blob【就是原始文件ele.file】转成base64字符串，然后进行文件的分割；步骤如下
            var reader = new FileReader();//这是核心,读取操作就是由它完成.
            reader.readAsArrayBuffer(document.getElementById("idname").file);//读取文件的内容
            reader.onload = function () {//文件阅读器加载了好了这个文件，就可以通过
                //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可this.result获取arraybuffer对象
                var file = this.result;//arraybuffer对象（有3种表示方法）
                var arr = new Uint8Array(file);//提取二进制字节数组，使用Uint8Array表示
                var base64Str = Base64.encode([...arr].join(""),true);//最好别用btoa，用统一的js-base64这个包，能处理特殊符号的问题；
                //把Unit8Array转成原始数组，然后获得原始字符串，然后在把字符串进行base64转码，生成对应的base64字符串,转base64只是为了提高数据传输安全性
                // ajax和form表单请求发送，默认是不会给数据进行base64加密的，需要自己加密

                // ...接下来的业务逻辑处理，如何分割这个“文件流”
                ！！！特别注意的一点，如果base64字符串传给后端，需要把+和/转成-和_,后端再转回来【后端有base64url这个包可以正确处理+和/的问题，就是解码的时候，会先把-和_转成+和/然后再用base64解码；编码是先base64编码，在把+和/转成-和_】
                      前端这边，js-base64是和后端的base64url处理方式类似，会有对+和/的兼容处理，decode解码的时候默认会把-和_转成+和/；但是encode的时候，是否处理+和/，得看第二个参数，Base64.encode("fdsfds",true),表示会把+和/转成-和_
                      前端这边还有一个问题，如果base64不是用于http请求的传输数据，那么就得用原始的base64，比如atob或btoa等，这个是非常严肃的问题，运气好不出bug，如果传输的数据刚好出现先+和/特殊字符，
                      那么首先得判断你用这个base64，是处理本地的原生，还是url传输；如果全部用兼容处理的base64，虽然可以解决url的问题；但是对于本地的业务处理的base64，就可能出错，比如我要把图片转本地base64
                      如果按照url的base64转，那么就会出现图片展示的问题，只能用原始的base64来处理；而且canvas产生的base64，都是原始的base64，这个得做特殊处理，否则就会有各种各样的猜不透的bug
                      比如前端的jsencrpy中用到了base64，是原生的base64，在本地解密是可以的，但是这个数据通过url传递到后台，就会有+和/的传输问题，所以前端在传数据前，必须替换+和/,
                      后端那边用base64url来解码【把-和_转成+和/然后再用base64解码】，然后再node-rsa的私钥去解密
                
            } 

        如何从base64字符串转成对应的Blob文件，然后通过FormData的形式发送ajax请求，来上传文件
            var originStr="kkefsfds";//原始字符串
            var base64=Base64.encode(originStr);//如果直接得到的字符串就是base64字符串，那就没有必要btoa了，因为再执行依次，就编码2次base64了【base64是可以编码解码的，而hash加密"比如md5加密或sha256加密"是不可逆的】
            var originArray=[...base64];
            var unitArr=new Uint8Array(originArray);//注意，这个originArray必须是base64字符串转化而来，否则Uint8Array会识别错误
            var localFile=new Blob([unitArr],{type:"image/png"});//这里是转成png图片格式的Blob对象，还可以是aplication/octet-stream（这是应用程序文件的默认值，很少用）
            var fd = new FormData();
            fd.append('file',localFile, Date.now() + '-user-pic.'+match[1].split("/")[1]);//后缀名和mimetype必须对应
            fd.append('enctype',"multipart/form-data");//表单数据的编码方式，有下面三种【编码格式==content-type】 “Content-Type是指http/https发送信息至服务器时的内容编码类型
                                                       //multipart/form-data才能用于文件上传【可以用文本和二进制方式上传】；
                                                       //application/x-www-form-urlencoded不是不能上传文件，是只能上传文本格式的文件；在发送前编码所有字符（默认）
                                                       //text/plain：空格转换为"+"号，但部队特殊字符编码
                                                       // ajax的默认编码方式也是application/x-www-form-urlencoded；一般都设置成 application/json，也就是content-type设置为application/json
                                // content_type是mimetype的别名；提示Mime错误，就是content-type返回错误；例如abc.xls;而content-type是后端给这个文件设置的编码类型，告诉浏览器应该以什么文件的类型来打开它；只要后端设置正确，就没问题；
                                // 比如服务器那边传送.avi文件，它对应的mimetype是“video/x-msvideo”，也就是给这个response的content-type设置“video/x-msvideo”；如果设置错了，设置成了 text/css；那么浏览器按照css文件格式去解析，就会提示Mime错误

            fd.append('表单自定义key',"自定义value");//自定义数据，模仿表单中上传的key和value
            $.ajax({
                data:fd
                type:"post",
                dataType: 'json',//如果不用dataType，默认传的是form数据，数据只能传一层，多层的数据会按照属性遍历分开传
                url:"",
                cache:false,//不设置缓存
                precessData:false,//data数据无需序列化，必须为false，因为上传的是文件流信息
                contentType:false//表示不设置contentType；前提是ajax得支持这个功能，有的ajax库会有个默认的content-type而且还不能删除这个值，只能覆盖，那就完了，只能修改ajax库
                // contentType:"" 这个contentType千万别传，如果框架的ajax中默认传了，就得注释掉，因为post方式上传FormData类型的数据，他会默认设置成multipart/form-data；boundary.....格式，如果自己设置了，就会报错
            })

        后端传送“文件流”到前端，如果把文件流转换成对应的“应用程序”或者“图片”或excel【默认后端是传base64格式的字符串过来】
            var unitArr=new Uint8Array([...atob(base64Str)]);//base64字符串解码后展开，因为后台那边是把文件流通过base64编码了，所以需要解码
            var file=new Blob([unitArr.buffer],{type:"application/vnd.ms-excel;charset=utf-8"});
            var localUrl=window.URL.createObjectURL(file);//创建资源文件的本地url
            var link = document.createElement("a");
            link.download = "dbfile.xls";//下载的文件名，注意这个后缀要和Blob中的type呼应
            link.href = localUrl;//下载资源文件的url，这里是本地的url
            link.click();//直接触发click去下载资源
            各个文件的mime类型和后缀，详见 http://blog.csdn.net/weixin_43299180/article/details/119818982 ； 
            只要再Blob的type中设置对应的类型+;charset=utf-8，然后a标签的download属性设置对应缀名的文件名即可

        上传进度监控：
            ...
            //xhr.upload有：loadstart【开始上传】 error【出错】 abort【终止】 timeout【超时】 load【上传成功】 loadend【上传停止】等时间
            xhr.upload.addEventListener('progress', e => {
              if (e.lengthComputable) {
                var percentage = Math.round((e.loaded * 100) / e.total);//上传资源的百分比
              }
            })
            xhr.open('post', 'http://localhost:5000/upload'，true);
            xhr.send(data);

        如何实现大文件分割上传：多个ajax发送给服务器【可以串行发送ajax，也可以并发ajax】，服务器全部接收完成以后资源整合，然后做出反馈；
            var mov = document.getElementById('mov').files[0];//Blob类型文件，就是源文件
            var size=move.size;//文件大小
            var arr=[mov.slice(0,size*0.5),mov.slice(size*0.5)];//Blob这个文件类型支持slice方法进行类似数组的分割;
            var fd1=new FormData();
            fd1.append('file',arr[0]);//后端通过file字段去拿对应的数据，这个名称是可以自定义的
            fd1.append('index',"0");
            fd1.append('enctype',"multipart/form-data");
            var fd2=new FormData();
            fd2.append('file',arr[1]);
            fd1.append('index',"1");
            fd2.append('enctype',"multipart/form-data");
            $.ajax({
                ...
                data:fd1
            })
            $.ajax({
                ...
                data:fd2
            })

            //上面是前端Blob类型的数据分块，下面是后端的接收方法，如何实现“断点续传”【部分包传送失败，如何从接受】还没写
            //思路是：
                1.前端分批发送包，后端接收到包就立马把文件存到静态资源服务器，而不是内存【占用内存不好，而且不同的ajax请求之间，node端触发的是不同的异步事件，数据难以相互通信，那么大文件放cookie或session明显不对】
                2.每个包都是放入静态资源文件夹后【存在相同前缀就覆盖，相同前缀表示同一个分片，每个分片后跟随时间戳，因为有的分片可能是之前的缓存，要保证一次整个包的一轮上传操作内每个包时间戳相同，第二次整体上传各个分片用新的时间戳】，
                  当前分片上传完成后，根据当前分片的时间戳，去静态资源里面寻找相同时间戳的其他分片，总体数量和前端的分片数相同，就表示上传完成，直接把这些分片静态资源整合到一个文件，然后给前端返回上传成功
                3.如果想要断点续传，很简单，哪个分片的ajax请求失败了，就重新自动再发送哪个分片的ajax请求，用相同的时间戳发送，表示这些分片是同一批的；如果连续好几次发送失败【一般不会】；那就重新上传整个文件，然后再重新分片发送
                  这个时候各个分片就有新的时间戳，相当于重新发送；【每次文件上传成功后，需要把所有的分片，以及上次的相同文件名的整个文件都删除】

            this.req.on("data",function(data){ 处理data数据 })中获取上传数据，然后在this.req.on("end",function(data){ 数据完全接受完成后的业务处理 })


        node的tcp连接数量有限，每个客户端的http请求，都是异步的事件，都会生成一个js执行环境，通过v8传到libuv进入事件轮询，从线程池中获得一个线程来执行操作，多线程并发，
        所以各个http请求是相互独立的，tcp通道内有可能是一个http请求，如果是http2那就有多个http请求流的并发，tcp和http请求跟用户是没有对应关系的，一个用户可以有多个http请求并发，也可以是多个tcp请求并发
        服务器是按照http作为最基本的单位，来执行事件的，它到了libuv，就能分配到一个线程，一个http可以看作是一个线程【java上出现一个http请求就开一个线程，node是在libuv层分配一个线程】
        所以不同的http请求之间的数据传递，是比较难的，要么放入用户的服务端cookie，要么放入session，要么放入数据库，这样才能保证同一个用户的数据的独立性；遇到静态资源，就放到该用户id对应的静态资源文件夹下，也能保证数据的独立性

        url中，端口指的是服务器的端口，服务器默认是80端口对外访问，客户端浏览器可以是任何端口去访问服务器的80端口，而tcp四元组是客户端ip，端口，服务器ip 端口；服务器ip和端口基本固定
        所以服务器可以允许的tcp连接==ip数*客户端端口数，基本是无限的，但是linux本身的tcp连接是由上限的
        "TCP/IP" 必须对外提供编程接口，这就是Socket, Socket跟"TCP/IP"并没有必然的联系。Socket编程接口在设计的时候，就希望也能适应其他的网络协议
        socket有几个通用的接口才操作tcpip协议的数据 create，listen，accept，connect，read和write等等；socket是在“应用层和传输层【tcp】之间的一层，用于数据传递
        同一个域名一般在一个tab浏览器上只允许6个tcp连接，因为客户端ip相同，所以一般开启6个端口，建立6个tcp连接去访问；
        ////*/

        submitUserInfo(){
            var that=this;
            if(this.userInfo.isLogin&&this.userInfo.isSelf){
                var {name, userName, phone, age, sex,userPic }=this.userInfo.data; //数据后端无法解析，肯定是哪个参数出了问题
                var originName=this.userInfo.name;
                var originUserName=this.userInfo.userName;
                var originPhone=this.userInfo.phone;
                var originAge=this.userInfo.age;
                var originSex=this.userInfo.sex;
                var userInfo={};
                var hasChange=false;
                if(originName!=name.val){
                    // this.changeName({target:{value:name.val}});
                    userInfo.name=name.val;
                    hasChange=true;
                }
                if(originUserName!=userName.val){
                    userInfo.userName=userName.val;
                    hasChange=true;
                }
                if(originPhone!=phone.val){
                    userInfo.phone=phone.val;
                    hasChange=true;
                }
                if(originAge!=age.val){
                    userInfo.age=age.val;
                    hasChange=true;
                }
                if(originSex!=sex.val){
                    userInfo.sex=sex.val;
                    hasChange=true;
                }
                if(!hasChange&&!userPic.isChange){
                    this.$store.commit("updateUserInfo",{isEdit:false});
                    return
                }
                
                if(!name.status&&!userName.status&&!phone.status&&!age.status&&!sex.status){
                    if(hasChange){
                        userInfo.id = Cookies.get("u");
                        var userModel=new BaseModel({
                            type:"post",
                            url:"/update_user_info",
                            data:userInfo
                        });
                        userModel.promise.then(function(data) {
                            if(data&&data.data){
                                var {_id,userName,name,age,sex,phone,userPic,linkUser,time}= data.data;
                                that.$store.commit("updateUserInfo",{_id,userName,name,age,sex,phone,userPic,linkUser,time});
                                that.resetInfo();
                                toast.bind(that)("个人信息修改成功");
                            }
                        },function(err) {
                            toast.bind(that)(err.msg);
                        })
                    }
                    if(userPic.isChange){
                        var formFile=this.transBase64ToFormData(userPic.previewUrl);
                        var model=new BaseModel({
                            upload:true,//这个必须传，在basemodel中有对应的上传逻辑的处理
                            type:"post",
                            url:"/upload",
                            data:formFile
                        });
                        model.promise.then(function(data) {
                            if(data&&data.data){
                                that.$store.commit("updateUserInfo",{userPic:data.data.userPic,isEdit:false});
                                toast.bind(that)("头像修改成功");
                            }
                        },function(err) {
                            toast.bind(that)(err)
                        })
                    }
                }
                    

                    
                //下面是原生的发送file的ajax方法；
                // var ele=document.querySelector(".user-img-upload-wrapper input[type='file']").files[0];
                // var formFile=new FormData(ele);//获取文件数据,如果没有用antd,那数据是通过ele.files[0]来获取file
                // var promise=new BaseModel({
                //     type:"post",
                //     url:"",
                //     data:formFile,
                //     cache:false,
                //     precessData:false,//data数据无需序列化，必须为false，以为长传的是文件流信息
                //     contentType:false,//必须
                //     success:function(data) {
                //     }
                // })

                   
            }else{
                toast.bind(that)("必须登录状态下才能修改");
            }
        },

        //把base64的string字符串的图片，转化成file格式的数据【formData】，用于ajax文件上传
        transBase64ToFormData(base64String){
            //这里对base64串进行操作，去掉url头，并转换为byte
            var strArr=base64String.split(',');
            var bytes = window.atob(strArr[1]);
            var match=/(image\/([\w]{3,4}))\;/.exec(strArr[0]);
            var array = [];
            for(var i = 0; i < bytes.length; i++){
                array.push(bytes.charCodeAt(i));
            }
            var blob = new Blob([new Uint8Array(array)], {type: match[1]});//"image/jpeg"
            var fd = new FormData();
            fd.append('file',blob, Date.now() + '-user-pic.'+match[1].split("/")[1]);//后缀名和mimetype必须对应
            fd.append('enctype',"“multipart/form-data”");
            fd.append("originImagUrl",this.userInfo.userPic);//把原来图片url传给后台，删除原来的图片，以免服务器图片过多
            return fd;
        },


        cancelUserInfoChange(){
            this.resetInfo({isEdit:false});
        },

        editUserInfo(){
            if(this.userInfo.isLogin&&this.userInfo.isSelf){
                this.resetInfo({isEdit:true});
                this.$store.commit("updateUserInfo",{isEdit:true});
            }else{
                toast.bind(this)("必须登录状态下才能修改");
            }
        },

        createFormFile({file,action}){
            var formFile= new FormData();
            formFile.append("file",file);
            formFile.append("action",action);
            return formFile
        },

        //裁剪图片
        submitCutedPic(){
            var canvas=document.querySelector(".preview-img canvas");
            var base64 = canvas.toDataURL("image/jpeg", 1); 
            var i=0;
            var quality=1;
            while (base64.length > 200*1024) {
                quality -= (base64.length>600*1024)?0.45:0.02;
                base64 = canvas.toDataURL("image/jpeg", quality);
            }
            this.$store.commit("updateUserPic",{previewUrl:base64});
            this.triggerPreviewImg({isPreview:false});
        },

        //通过canvas截图
        cutImage({cutWidth,cutHeight,startX,startY}){
            var canvas=document.querySelector(".preview-img canvas");
            var img=document.querySelector(".preview-img img");//因为图片放大了，所以要以新的图片作为蓝本
            var ctx=canvas.getContext("2d");
            
            canvas.width=cutWidth;
            canvas.height=cutHeight;
            ctx.clearRect(0,0,cutWidth,cutHeight);
            ctx.drawImage(img,startX,startY,cutWidth,cutHeight,0,0,cutWidth,cutHeight);
            this.$store.commit("updateUserPic",{startY:startY,startX:startX,cutHeight:cutHeight,cutWidth:cutWidth,displayCanvas:"block"});
        },

        mousedown(e){
            var {J}=window;
            var ele=(e.target.tagName.toLowerCase()=="canvas")?e.target.parentNode:e.target;
            var offset=J.elePosition(ele);
            var startX=e.clientX-offset.left;
            var startY=e.clientY-offset.top;
            window.originX=null,window.originY=null;
            this.$store.commit("updateUserPic",{isDrag:true,startX:startX,startY:startY,displayCanvas:"none",offset:offset});
        },

        //四个角任意起点到终点，都可以裁剪
        mousemove(e){
            if(this.userInfo.data.userPic.isDrag){
                var userPic=this.userInfo.data.userPic;
                var {offset,startX,startY}=userPic;
                var cutWidth=e.clientX-offset.left-(window.originX||startX);//一旦确定有originX，就说明在x轴是反向拖拽，所以得用originX，而不是startX
                var cutHeight=e.clientY-offset.top-(window.originY||startY);//一旦确定有originY，就说明在Y轴是反向拖拽，所以得用originY，而不是startY
                if(cutWidth<0){
                    window.originX=window.originX?window.originX:startX;
                    startX=Math.abs(e.clientX-offset.left);
                    cutWidth=Math.abs(e.clientX-offset.left-window.originX);
                }
                if(cutHeight<0){
                    window.originY=window.originY?window.originY:startY;
                    startY=Math.abs(e.clientY-offset.top);
                    cutHeight=Math.abs(e.clientY-offset.top-window.originY);
                }
                this.cutImage({cutWidth,cutHeight,startX,startY});
            }
        },

        mouseup(e){
            var isDrag=false;
            this.$store.commit("updateUserPic",{isDrag});

            // var offset=this.userInfo.data.userPic.offset;
            // var endX=e.clientX-offset.left;
            // var endY=e.clientY-offset.top;
            // var {startX,startY}=this.userInfo.data.userPic;
            // var cutWidth=endX-startX;
            // var cutHeight=endY-startY;
            // this.$store.commit("updateUserPic",{isDrag,endX,endY,cutWidth,cutHeight});
            // this.cutImage({cutWidth,cutHeight,startX,startY});
        },

        triggerPreviewImg({isPreview=false,previewUrl,isChange}){
            var obj={preview:isPreview};
            if(previewUrl){
                obj.previewUrl=previewUrl;
            }
            if(isChange){
                obj.isChange=isChange;
            }
            this.$store.commit("updateUserPic",obj);
        },

        //自定义上传，因为上传之前，需要图片预览和裁剪
        customRequest(info){
            // if(info.isSubmit){
            //     // var data=window.tempFile;//需要转化数据
            //     // var promise=new BaseModel({
            //     //     type:"post",
            //     //     url:"/upload",
            //     //     data:{},
            //     //     success:function() {},
            //     //     error:function() {}
            //     // });

            //     // return promise
            // }else{
                getBase64(info.file, imageUrl => {
                    var img=document.querySelector(".user-img-content");
                    var wrapper=".preview-img";
                    this.loading = false;
                    this.triggerPreviewImg({isPreview:true,previewUrl:imageUrl,isChange:true});
                    var that=this;
                    setTimeout(function() {
                        var canvas=document.querySelector(".preview-img canvas");
                        setCanvas({img,wrapper,canvas,that});
                    },1);
                });
                // window.tempFile=info;//包含了ajax请求的所有参数，组件通过html的元素获取的数据
            // }
        },

        beforeUpload(file,fileList) {
            window.File=false;
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('Image must smaller than 2MB!');
            }
            return isJpgOrPng && isLt2M;
        },

        changePhoneNumber(e){
            var errMsg="请输入正确的手机号";
            var emptyMsg="请输入手机号";
            var val=e.target.value;
            var status=isTel(val)?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status==""?"":errMsg);

            this.$store.commit("updateUserPhone",{val,status,helpInfo});
        },

        // changePassward(e){
        //     var errMsg="只支持英文字母和数字，不支持空格等其他特殊字符，长度必须小于17";
        //     var emptyMsg="请输入密码";
        //     var val=e.target.value;
        //     var status=isPassward(val)?"":"error";
        //     var helpInfo=(val=="")?emptyMsg:(status==""?"":errMsg);

        //     this.$store.commit("setRegisterFormPassward",{val,status,helpInfo});
        // },

        changeNickName(e){
            var errMsg="只支持中英文和数字，不支持空格等其他特殊字符，长度必须小于17";
            var emptyMsg="";
            var val=e.target.value||"";
            var status=(isUserName(val)||val=="")?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status!=""?errMsg:"");

            this.$store.commit("updateUserNickname",{val,status,helpInfo});
        },
        changeName(e){
            var errMsg="只支持中英文和数字，不支持空格等其他特殊字符，长度必须小于17";
            var emptyMsg="";
            var val=e.target.value||"";
            var status=(isUserName(val)||val=="")?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status!=""?errMsg:"");

            this.$store.commit("updateUserName",{val,status,helpInfo});
        },
        changeSex(e){
            var val=e.target.value||"";
            var status="";
            var helpInfo="";
            this.$store.commit("updateUserSex",{val,status,helpInfo});
        },
        changeAge(age){
            var val=age||"";
            var status="";
            var helpInfo="";
            this.$store.commit("updateUserAge",{val,status,helpInfo});
        },

        clearUserInfoForm(){
            this.$store.commit("clearUserInfoForm");
        }
    },
    template:template
};


export default UserInfo