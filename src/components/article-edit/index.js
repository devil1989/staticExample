require('ant-design-vue/lib/drawer/style/index.css');
require('ant-design-vue/lib/notification/style/index.css');
require("./index.scss");

import Vue from "vue";
import {Drawer,notification} from 'ant-design-vue';

//文档：https://www.kancloud.cn/liuwave/quill/1409367
import { quillEditor} from 'vue-quill-editor';
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css'

import Quill from 'quill';//quill必须升到1.3.6，否则chrome下在输入中文的时候，会多出一个首字母；在ie下会因为整个问题导致页面崩溃自动关闭

// import { ImageDrop } from 'quill-image-drop-module'
// Quill.register('modules/imageDrop', ImageDrop)
require("quill-image-drop-module/image-drop.min.js");//用import方式添加quill-image-drop-module会在ie下报错

import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageResize', ImageResize)

import Templates from "./index.html";
var template = Templates;




Vue.use(Drawer);
notification.config({
    duration:1
});
Vue.prototype.$notification=notification;

//组件公共对外的api直接可以在逐渐内定义，然后外面随时可以调用
//组件特殊生命周期内的回调函数，需要组件初始化的时候从外面传进来
var { Cookies,Base64,BaseModel,Xss,util={}}=window.Util;
var {getEncryptData,getPersonalXssRule} = window.Util.util;
var {isTel,isUserName,isPassward}=window.Util.validate;
var {toast}=util;

//@keydown.delete.capture="deleteImage"


let Article = {

    data() {
        return {
            content:"",
            editorOption: {
                placeholder: '请输入内容,  点右上角可关闭文章',
                modules:{
                    toolbar:[
                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                            ['clean'],
                            ['blockquote', 'code-block'],


                            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                            // [{ 'direction': 'rtl' }],   
                            [{ 'align': [] }],                      // text direction

                            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                            // [{ 'header': [1, 2, 3] }],

                            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                            // [{ 'font': [] }],
                           
                            
                            ["image"]

                    ],
                    // history: {
                    //   delay: 1000,
                    //   maxStack: 50,
                    //   userOnly: false
                    // },
                    // imageDrop: true,
                    imageResize: {
                      displayStyles: {
                        backgroundColor: 'black',
                        border: 'none',
                        color: 'white'
                      },
                      //Resize的时候点击图片删除，然后选图片会报错
                      modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                    }
                },
                theme: 'snow'
            }
        }
    },

    mounted(){
        // console.log('this is current quill instance object', this.editor)
    },

    computed:{
        articleForm(){
            return this.$store.getters.articleForm
        }
    },

    methods: {

        /**************操作标签 start***************/
        showTagInput(e){
            this.$store.commit("updateTags",{inputVisible:true});
            Vue.nextTick(function() {
                e.target.parentNode.querySelector("input").focus();
            });
        },

        tagContentInputChange(e){
            this.$store.commit("updateTags",{curtentValue:e.target.value});
        },

        //没有直接用addTag，是为了复制请求出错的时候，enter下去没有失去焦点但调用了addTag，产生弹框后
        // 点击弹框，然后就失去焦点会再次调用addTag；弹框和焦点会循环导致错误
        addTagWrapper(e){
            e.target.blur();
        },

        //添加标签:标签请求单独独立出来作为接口；很多内容都可以用多个ajax来获取数据，不用非得在后端一个接口里面
        addTag(e){
            const inputValue = this.articleForm.data.tag.curtentValue;
            let tags = this.articleForm.data.tag.tagList;
            if (inputValue && tags.indexOf(inputValue) === -1) {
                tags = [...tags, inputValue];
                this.$store.commit("updateTags",{tagList:tags,curtentValue:"",inputVisible:false});
                // var { Cookies,Base64,BaseModel,sXss }=window.Util;
                // var articleId=this.articleForm.data.content.id;
                // var isAdd=true;
                // var model=new BaseModel({
                //     type:"post",
                //     url:"/add_article_tag",
                //     data:{articleId,isAdd,inputValue}
                // });
                // var that=this;
                // model.promise.then(function(data) {
                //     if(data.data&&data.state){
                //         tags = [...tags, inputValue];
                //         this.$store.commit("updateTags",{tagList:tags,curtentValue:"",inputVisible:false});
                //     }else{
                //         // console.log("fail")
                //     }
                // },function(err) {
                //     // console.log("err")
                // });
            }
        },

        //删除标签
        delTag(removedTag) {
            var tgList=this.articleForm.data.tag.tagList;
            if(tgList&&tgList.length){
                var tags = tgList.filter(tag => tag !== removedTag);
                this.$store.commit("updateTags",{tagList:tags});
            }
        },

        /**************操作标签 end***************/

        changTitle(e){
            var errMsg="只支持中英文和数字，不支持空格等其他特殊字符，长度必须小于17";
            var emptyMsg="请输入标题";
            var val=e.target.value;
            var status=(isUserName(val))?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status!=""?errMsg:"");

            this.$store.commit("setArticleFormTitle",{val,status,helpInfo});
            return {val,status,helpInfo};
        },

        //文章内容校验，这个是核心，提醒用户不能放某些标签
        //这个插件把content限制的非常严格，操作dom和设置html，都不能把标签带进去。
        validateArticleContent(){
            var val,status,helpInfo;
            // val=window.Util.htmlDecode(this.articleForm.data.content.val);
            val=window.Util.htmlDecode(document.querySelector(".ql-editor").innerHTML);
            //输出只有字符串，没有警告信息，我只能把警告信息挂在window.ErrorTags上
            val=window.Util.pXss.process(val);
            if(window.ErrorTags&&window.ErrorTags.length){
                status="error";
                helpInfo=this.getWarnInfo(window.ErrorTags);
            }
            this.$store.commit("setArticleFormContent",{val,status,helpInfo});//属性不能少
            return{val,status,helpInfo}
        },

        tabNext(e){
            window.quill.focus();
        },


        //用户使用错误标签提示
        getWarnInfo(errTags){
            var errInfo="";
            var errTags=[...new Set(errTags)];
            errTags.forEach(function(item){
                errInfo+=`<${item}>;`
            });
            window.ErrorTags=[];
            return `文章中不能包含${errInfo}这类html标签，请删除`;
        },

        submitArticel(){
            var titleStr = this.articleForm.data.title.val;
            var titleRst=this.changTitle({target:{value:this.articleForm.data.title.val}});
            var {val,status,helpInfo}=this.validateArticleContent();
            var param={},model;
            var that=this;
            if(titleRst.status!=="error"&&status!=="error"){
                this.uglyAllImage();
                param=this.getParam();
                if(!param.id){
                    toast.bind(this)("提交失败","请登陆后再提交");
                    return;
                }
                model=new BaseModel({
                    type:"post",
                    url:"/create_article",
                    data:param
                });
                this.switchSubmitState("submiting");
                
                model.promise.then(function(data) {
                    if(data.state){
                        toast.bind(that)(data.msg);
                        that.clearArticleForm();
                        that.articleForm.visible = false;
                        that.$attrs.callback();
                    }else{
                        toast.bind(that)("提交失败",data.msg);
                    }
                    that.switchSubmitState("submited");
                },function(data) {
                    toast.bind(that)("提交失败",data.msg);
                    that.switchSubmitState("submited");
                });
                // 
            }
        },

        //注册按钮提交开关
        switchSubmitState(submitState){
            if(submitState=="submiting"){
                var disableBtn=true;
                var submitText="提交中...";
                this.$store.commit("setArticleFormSubmitState",{disableBtn,submitText});
            }else{
                var disableBtn=false;
                var submitText="提交";
                this.$store.commit("setArticleFormSubmitState",{disableBtn,submitText});
            }
        },

        clearArticleForm(){
            this.content="";
            var val="",status="",helpInfo="";
            this.$store.commit("setArticleFormContent",{val,status,helpInfo});//属性不能少
            this.$store.commit("setArticleFormTitle",{val,status,helpInfo});
        },

        getParam(){
            var opts={};
            var title= this.articleForm.data.title.val;
            var content= window.Util.htmlDecode(document.querySelector(".article-editor-wrapper .ql-editor").innerHTML);
            var id=Base64.decode(Cookies.get("u")||"");
            var tags=this.articleForm.data.tag?this.articleForm.data.tag.tagList:[]
            return{title,content,id,tags}//所有的参数要放到data里面，如果加密，就设置type属性
        },

        uglyAllImage(){
            var that=this;
            var imgs=document.querySelectorAll(".ql-container img");
            if(imgs.length){
                imgs.forEach(function(img) {
                    that.uglyImage(img);
                })
            }
        },

        uglyImage(img){
            // 插入的图片默认降低到120k以下
            var src=img.src;
            var width=img.width;
            var height=img.height;
            var quality=1;
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.height=height;//canvas不设置大小，画出来的图片就会被截断
            canvas.width=width;//canvas不设置大小，画出来的图片就会被截断
            ctx.clearRect(0, 0, width,height);
            ctx.drawImage(img,0,0, width,height);
            var base64 = canvas.toDataURL("image/jpeg", quality); 
            var i=0;
            while (base64.length > 120*1024) {
                quality -= (base64.length>600*1024)?0.45:0.02;
                base64 = canvas.toDataURL("image/jpeg", quality);
                console.log(++i);
            }
            img.src=base64;

        },
        closeArticleDrawer() {
            this.articleForm.visible = false;
        },
        onEditorBlur(quill) {
            // var that=this;
            // window.quill=quill;
            // setTimeout(function(that){
            //     document.querySelector("html").style=""
            //     var ele=document.querySelector(".ql-container");
            //     if(ele){
            //         //DOM2级事件
            //         window.ele=ele;
            //         window.eleEvent=ele.addEventListener("DOMNodeRemoved",function(e){
            //             setTimeout(function(){
            //                 console.log(0);
            //                 quill.deleteText(0," ")
            //                 ele.removeEventListener("DOMNodeRemoved",eleEvent);
            //             },1)
            //         });
            //     }
            // },1)
        },
        onEditorFocus(quill) {
        },
        onEditorReady(quill) {
            window.quill=quill;
        },
        onEditorChange({ quill, html, text }) {
            //做了富文本编辑的放xss攻击，html传不了，所以只能用操作dom去修改了
            // this.articleForm.data.content.val=html;
            // this.content = html;
            // console.log(1)
        }
    },
    components:{
        "quill-editor":quillEditor
    },
    template:template
};
export default Article