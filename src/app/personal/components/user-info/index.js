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
        // ArrayBuffer 不能直接操作，而是要通过类型数组对象或 DataView 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容
        // 这里的类型数组对象有：Int8Array、Uint8Array、Int16Array、Uint16Array、Int32Array、Uint32Array、Float32Array、Float64Array 
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