
require("./index.scss");

//组件公共对外的api直接可以在逐渐内定义，然后外面随时可以调用
//组件特殊生命周期内的回调函数，需要组件初始化的时候从外面传进来
let Toast = {

    data:function(){
        return {};
    },

    beforeCreate:function(arg1,arg2,arg3){
        this.$emit("before-create");//this.$on监听；this.$emit触发
    },
    // props:["options"],
    
    methods: {

        //点击底部按钮
        getContent(ctx){
            //组件类交互逻辑【注意，组件内不能有业务逻辑代码，需要做到通用，组件只是在自己不同的生命周期阶段暴露出对应的api】
            // do something

            //回调处理业务逻辑
            this.$emit("after-click");
        },

        //组件对外的api，这类api只能是处理组件内部的展示问题，不能和外部的业务耦合
        //这个api是组件自身的上面周期之外的逻辑
        outerApi(data,callback){

            console.log("处理交互逻辑");

            //获取外部需要处理业务所需的数据
            let formattedData={
                data:data,
                name:"jeffrey"
            }

            callback(formattedData);//调用回调函数

        }
    },
    template:require("./index.html").default
};

// Vue.component("v-toast", Toast);//组件名称自己注册

export {Toast} 
