import './scss/app.scss';
// import fastclick from 'fastclick';
// import Cookies from 'Cookies';
// import $ from 'zepto';

var fastclick = require('fastclick');
fastclick.attach(document.body);
// var Cookies = require('cookies');
// window.Cookies = Cookies;
// window.$=$;
// $.ajaxSettings.crossDomain = true;
// $.ajaxSettings.xhrFields = {
//     withCredentials: true
// };



 

//rem自适应,不同size设置body的不同fontSize，让后rem是按照body的fontSize来控制1rem到底是多少px
(function(e) {
    var d = e.document,
        g = d.documentElement;
    var b = 1,
        c, w0 = 0;
    var ismc = /android|ios|iphone|ipod|mobile/i.test(navigator.userAgent);
    var maxw = ismc ? 1024 : 750;

    function f() {
        var w = g.getBoundingClientRect().width;
        if (w / b > maxw) {
            w = maxw * b
        }
        if (w0 != w) {
            w0 = w;
            g.style.fontSize = (w / 10) + "px"
        }
    }

    function a() {
        clearTimeout(c);
        c = setTimeout(f, 300)
    }
    e.addEventListener("resize", a, false);
    e.addEventListener("pageshow", function(h) {
        h.persisted && a()
    }, false);
    if (d.readyState === "complete") {
        d.body.style.fontSize = 12 * b + "px"
    } else {
        d.addEventListener("DOMContentLoaded", function(h) {
            d.body.style.fontSize = 12 * b + "px"
        }, false)
    }
    f()
})(window);




//mock数据:url后面添加mock=1【会加载mock数据】，BaseModel中添加参数mock:true,即可两个条件都成立才会走mock
window.mockData={};
if(/(\?mock$)|(\?mock(\&|\=))|(\&mock$)|(\&mock(\&|\=))/.test(location.search)){//是否拉取mock数据，以为正常访问页面，不需要下载mock数据
    require.ensure([],function(require){
        window.mockData=require('../../../mock/index.js').default;
    });
}


//上线前判断时候有yz或者qa的静态资源
function getWarn(){
    if(window&&document.querySelectorAll&&!/(qaclass\.|yzclass\.|local\.|localhost)/.test(location.href)){
        let hasQa=false,hasYz=false;
        let links=document.querySelectorAll("link[rel='stylesheet']")||[];
        let scripts=document.querySelectorAll("script[src]")||[];
        
        links.forEach(function(unit,idx){
            if(/qares\./.test(unit.href)){
                hasQa=true;
            }
            if(/yzres\./.test(unit.href)){
                hasYz=true;
            }
        });
        scripts.forEach(function(unit,idx){
            if(/qares\./.test(unit.src)){
                hasQa=true;
            }
            if(/yzres\./.test(unit.src)){
                hasYz=true;
            }
        });

        if(hasQa){
            console.error("线上环境页面包含qa环境的代码，请检查js和css链接是否正确");
        }
        if(hasYz){
            console.error("线上环境页面包含yz环境的代码，请检查js和css链接是否正确");
        }
    }
}

getWarn();