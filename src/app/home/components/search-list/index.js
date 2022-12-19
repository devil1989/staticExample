import Templates from "./index.html";
var template = Templates;
require("./index.scss");


let Login = {

    data() {
        return {
        }
    },

    mounted(){
    },

    computed:{
        searchInfoList(){
            return this.$store.getters.searchInfoList
        },
        personalArticle(){
            return this.$store.getters.personalArticle
        }
    },

    methods: {
        /**异步加载js处理逻辑:异步加载之前，还可以在页面中做预加载**/
        getAsyncJs(callback){
            //如果里面的require是相同的，这个require.ensure不会再发请求；
            //里面所有的文件都单独打包
            require.ensure([],function(require){
                require('article-display');
                if(callback){
                    callback();
                }
            });
        },

        //展示文章内容弹框
        showArticleDisplayDrawer(e) {
            var target=window.Util.util.closest(e.target,"data-key-id");
            if(target){
                var uid=window.Util.Cookies.get("u");
                var id=target.getAttribute("data-key-id");
                var that=this;
                var data=this.searchInfoList.data.articleList||[];
                data.forEach(function(item) {
                    if(item.id==id){
                        item.showLoading=true;
                    }
                });
                this.getAsyncJs(function(){
                    that.$store.dispatch("getPersonalArticleInfo",{visible:true,isLoaded:true,id:id,uid:uid,callback:function() {
                        data.forEach(function(item) {
                            if(item.id==id){
                                item.showLoading=false;
                            }
                        });
                    }});
                })
                
            }
        }
    },
    template:template
};

export default Login