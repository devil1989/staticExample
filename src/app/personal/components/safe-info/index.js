import Vue from "vue";
import {Form} from 'ant-design-vue';
require('ant-design-vue/lib/form/style/index.css');
require("./index.scss");
Vue.use(Form);
import Templates from "./index.html";
var template=Templates;

var { Cookies,Base64,BaseModel,util={} }=window.Util;
var {getEncryptData,getPersonalXssRule} = window.Util.util;
var {isPassward}=window.Util.validate;

// //组件公共对外的api直接可以在逐渐内定义，然后外面随时可以调用
// //组件特殊生命周期内的回调函数，需要组件初始化的时候从外面传进来
// var { Cookies,Base64,BaseModel,util }=window.Util;
// var {getEncryptData,getPersonalXssRule} = window.Util.util;
// var {isTel,isUserName,isPassward}=window.Util.validate;


let SafeInfo = {

    data() {
        return {
        }
    },

    computed:{
        safeInfo(){
            return this.$store.getters.safeInfo
        },
        userInfo(){
            return this.$store.getters.userInfo
        }
    },

    methods: {
        modifyPsd:function(e) {
            var oldPwd=this.safeInfo.data.oldPwd.val;
            var newPwd=this.safeInfo.data.newPwd.val;
            this.changeOldPwd({target:{value:oldPwd}});
            this.changeNewPwd({target:{value:newPwd}});
            var oldStatus=this.safeInfo.data.oldPwd.status;
            var newStatus=this.safeInfo.data.newPwd.status;
            var param={
                oldPwd:oldPwd,
                newPwd:newPwd,
                id:Cookies.get("u")
            };
            var that=this;
            if(!oldStatus&&!newStatus){
                var model=new BaseModel({
                    url:"/modify_pwd",
                    type:"post",
                    data:util.getEncryptData(param)
                });
                clearTimeout(window.tempStamp);
                model.promise.then(function(data) {
                    that.$store.commit("updateSafeInfoPwd",{
                        "oldPwd":{val:"",status:"",helpInfo:""},
                        "newPwd":{val:"",status:"",helpInfo:""}
                    });
                    that.$store.commit("updateSafeInfo",{
                        changeResult:{
                            "msg":data.msg||"修改密码成功",
                            "state":data.state
                        }
                    });
                    window.tempStamp=setTimeout(function() {
                        that.$store.commit("updateSafeInfo",{
                            changeResult:{
                                "msg":"",
                                "state":data.state
                            }
                        });
                    },4000);
                },function(err) {
                    that.$store.commit("updateSafeInfoPwd",{
                        "oldPwd":{val:"",status:"",helpInfo:""},
                        "newPwd":{val:"",status:"",helpInfo:""}
                    });
                    that.$store.commit("updateSafeInfo",{
                        changeResult:{
                            "msg":err.msg||"修改密码失败",
                            "state":0
                        }
                    });
                    window.tempStamp=setTimeout(function() {
                        that.$store.commit("updateSafeInfo",{
                            changeResult:{
                                "msg":"",
                                "state":0
                            }
                        });
                    },4000);
                });
            }
        },
        changeOldPwd:function(e) {
            var errMsg="只支持英文字母和数字，不支持空格等其他特殊字符，长度必须小于17";
            var emptyMsg="请输入原密码";
            var val=e.target.value;
            var status=isPassward(val)?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status==""?"":errMsg);
            this.$store.commit("updateSafeInfoPwd",{
                "oldPwd":{val,status,helpInfo}
            });
        },
        changeNewPwd(e){
            var errMsg="只支持英文字母和数字，不支持空格等其他特殊字符，长度必须小于17";
            var emptyMsg="请输入新密码";
            var val=e.target.value;
            var status=isPassward(val)?"":"error";
            var helpInfo=(val=="")?emptyMsg:(status==""?"":errMsg);
            this.$store.commit("updateSafeInfoPwd",{
                "newPwd":{val,status,helpInfo}
            });
        },
    },
    template:template
};

export default SafeInfo