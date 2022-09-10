/**
 * Created by Halley on 16/6/20.
 * 时间对象的格式化;
 */
import * as ajax from "ajax.js";
import JSEncrypt from "jsencrypt";
import Cookies from 'js-cookie';
import {BaseModel} from 'ajaxbase.js';
import * as validate from 'validate.js';
import * as device from 'device.js';
import * as date from "time.js";
// import { Base64 } from 'js-base64';
const Base64 = require('js-base64');
var Xss=require('xss');

var htmlEncode = require('js-htmlencode').htmlEncode;
var htmlDecode = require('js-htmlencode').htmlDecode;

var util={
    INITIAL_STATE :{
        "data": {},
        "message": "",
        "status": 30666
    },
    toast:function(title,msg,callback){
        if(this.$notification){
            if(arguments.length==1){
              msg=title;
              title=null;
            }else if(arguments.length==2&&typeof msg=="function"){
              callback=msg;
              msg=title;
              title=null;
            }
            this.$notification.open({
                message: title||'提示',//title
                description:msg,
                onClick: () => {
                }
            });
            callback&&callback();
        }
    },

    //传入数组，返回key唯一的数组
    unique:function(arr=[],keyName) {
        var temp=[];
        var rst=[];
        var len=arr.length;
        arr.forEach(function(item,idx) {
            var isRepeat=false;
            if((idx+1)==len){
                rst.push(item);
            }
            else{
                temp=arr.slice(idx+1,len);
                isRepeat=temp.some(function(subItem) {
                    return subItem[keyName]==item[keyName]
                });
                if(!isRepeat){
                    rst.push(item);
                }
            }
        })
        return rst;
    },

    //向上获取最近的包含attrKey这个属性的元素祖先元素
    closest:function(target,attrKey) {
        if(target&&target.getAttribute){
            var attr=target.getAttribute(attrKey);
            var parentNode=target.parentNode;
            if(!parentNode){
                return null;
            }else{
                if(attr){
                    return target
                }else{
                    return this.closest(parentNode,attrKey);
                }
            }
        }else{
            return null;
        }
            
    },
    formatDate : function(date, format) {
        /*
         * eg:format="yyyy-MM-dd hh:mm:ss";
         */
        date = new Date(date);
        let o = {
            "M+": date.getMonth() + 1, // month
            "d+": date.getDate(), // day
            "h+": date.getHours(), // hour
            "m+": date.getMinutes(), // minute
            "s+": date.getSeconds(), // second
            "q+": Math.floor((date.getMonth() + 3) / 3), // quarter
            "S": date.getMilliseconds()
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear().toString()).substr(4 - RegExp.$1.length));
        }

        for (let k in o) {
            if (new RegExp(`(${k})`).test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1
                    ? o[k]
                    : (`00${o[k]}`).substr((o[k].toString()).length));
            }
        }
        return format;
    },
    getWeekDay: function (date) {
        let a = ["日", "一", "二", "三", "四", "五", "六"];
        let week = date ? new Date(date).getDay() : new Date().getDay();
        let str = `周${a[week]}`;
        return str;
    },
    querySearch: function (key) {
        let match = RegExp(`[?&]${key}=([^&]*)`).exec(location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    },
    getOffsetLeft:function(obj) {
        let {offsetLeft, offsetParent} = obj;
        return offsetLeft + (offsetParent ? getOffsetLeft(offsetParent) : 0);
    },
    getOffsetTop:function (obj) {
        let {offsetTop, offsetParent} = obj;
        return offsetTop + (offsetParent ? getOffsetTop(offsetParent) : 0);
    },

   /* 这type设置encrypted是用于后端校验的，后端遇到这个encodeType，会用私钥解密，否则不用私钥解密
    非常多的细节，包括key如何生成，我才用后端的node-rsa框架生成，传到前端；
    同时jsencrypt是用pkcs1加密格式，所以后断产生key的时候，也一定要用这个加密格式
    加密的数据必须是个个字符串，所以需要用到JSON.stringify，
    但是如果JSON.stringify的对象是个复杂的对象，不是单纯包含key和string类型的value的对象
    那么JSON.stringify产生的数据就很多，会出现Message too long for RSA错误,
    所以传入的对象必须时干净的对象，就是先创建空对象，然后把用到的值传入*/
    getEncryptData:function (obj) {//encodeType是表示后端需要解码的数据类型encrypted表示非对称加密
        var fmtData=JSON.stringify(obj);
        var jsEnc = new JSEncrypt();
        var encodeType= "encrypted";
        var pbKey=Base64.decode(Cookies.get("publicKey")||"");
        jsEnc.setPublicKey(pbKey);
        var data=jsEnc.encrypt(fmtData);

        //标准的base64编码结果包含"+" 和 “/”，在通过URL传递到服务器时，会被转成空格，造成不能获得正确的解码结果
        //base64中用a-z和A-Z和0-9和=+/其他都不包含，所以可以用_-替换
        data=data.replace(/\+/g,"-").replace(/\//g,"_");

        return  {data,encodeType}
    },

    //自定义xss白名单
    getPersonalXssRule:function () {

      //href,src,属性以及form表单的action，都可以输入javascript:URL;
      //只要是能放url的地方，就可以放js执行xss攻击；
      //某些可以放js的标签，比如script标签里，可以执行xss攻击，包括eval函数
      //style里面可以放各种url，所以可以进行xss攻击，需要对style做特殊处理
      // 在 style 属性和标签中，包含类似 background-image:url("javascript:…"); 的代码（新版本浏览器已经可以防范）。
      // 在 style 属性和标签中，包含类似 expression(…) 的 CSS 表达式代码（新版本浏览器已经可以防范）。
      // style中只要出现expression，javascript；直接把style清空
      //新版本浏览器已经没有style植入expression，javascript的翻新了，但老浏览器还有
      var opts={
        whiteList: {//这些特定样式相关标签的样式相关属性全部搞下来，其他全过滤
          div: ["class", "style", "id"],
          br:["class", "style", "id"],
          pre:["class", "style", "id","spellcheck"],
          u:["class", "style", "id"],
          img:["class", "style", "id","src"],
          s: ["class", "style", "id"],
          p: ["class", "style", "id"],
          h1: ["class", "style", "id"],
          h2: ["class", "style", "id"],
          h3: ["class", "style", "id"],
          h4: ["class", "style", "id"],
          h5: ["class", "style", "id"],
          blockquote: ["class", "style", "id",'cite'],
          strong: ["class", "style", "id"],
          em: ["class", "style", "id"],
          span: ["class", "style", "id"],
          ul: ["class", "style", "id"],
          ol: ["class", "style", "id"],
          li: ["class", "style", "id"],
          table: ["class", "style", "id",'width', 'border', 'align', 'valign'],
          colgroup: ["class", "style", "id",'align', 'valign', 'span', 'width'],
          col: ["class", "style", "id",'align', 'valign', 'span', 'width'],
          tbody: ["class", "style", "id",'align', 'valign'],
          tfoot: ["class", "style", "id",'align', 'valign'],
          tr: ["class", "style", "id",'rowspan', 'align', 'valign'],
          thead:["class", "style", "id",'align', 'valign'],
          th: ["class", "style", "id",'width', 'rowspan', 'colspan', 'align', 'valign'],
          td: ["class", "style", "id",'width', 'rowspan', 'colspan', 'align', 'valign']
        },

        //标签的style中出现javascript或者expression，就把style属性删除
        //这个在前端做防御吧，后端开销太大
        onTagAttr:function(tag, name, value, isWhiteAttr) {
          if(name=="style"&&/(javascript)|(expression)/.test(value)){
            return "";
          }
        },
        onIgnoreTag(tag, html, options) {
            window.ErrorTags=(window.ErrorTags==undefined)?[]:window.ErrorTags;
            window.ErrorTags.push(tag);
          // 参数说明与onTag相同
          // 如果返回一个字符串，则当前标签将被替换为该字符串
          // 如果不返回任何值，则使用默认的处理方法（通过escape指定，详见下文）
        }
      }
      return opts;
    }
}

//window下公共变量设置，后面写逻辑的时候不能和这里的变量冲突
function initPublicVar(){
    var pXss=new Xss.FilterXSS(util.getPersonalXssRule());
    var sXss=new Xss.FilterXSS({onTag:function(){return ''},whiteList:{}});
    window.Util={util,validate,device,Cookies,Base64,BaseModel,sXss,Xss,pXss,htmlDecode,htmlEncode};//所有的公共方法全部放到这里，也从这里调取
    window.$=ajax;
    if(window.$&&window.$.ajaxSettings){
        window.$.ajaxSettings.xhrFields = {
            withCredentials: true
        };
    }

    if (!window.console) {//防止console报错导致页面出错
        window.console = {
            log: () => {},
            error: () => {},
            warn: () => {}
        };
    }
}

initPublicVar();




/*前端架构方案：
  event操作：zepto中抽离出来
  dom操作：zepto中抽离起来
  模块加载：sea.js或require.js
  js模板:doT,handlebars,mustache,underscoreTemplate等
  公用函数（日期操作，cookie操作，localstorage操作，类的继承，数据类型判断，克隆）
  如果涉及spa，则需要自己写一个单页面应用
 */


//常用方法集合
//underscore常用方法：_.extend,_.defaults,_.each,_.tempalte,_.filter(筛选return true的项),_.compact,_.min,_.uniq,
(function(w) {
  var toString = Object.prototype.toString;
  w.J = {

    //引用类型
    isObject: function(t) {
      return (toString.call(t) === "[object Object]") ? true : false;
    },
    isArray: function(t) {
      return (toString.call(t) === "[object Array]") ? true : false;
    },
    isExp: function(t) {
      return (toString.call(t) === "[object RegExp]") ? true : false;
    },
    isDate: function(t) {
      return (toString.call(t) === "[object Date]") ? true : false;
    },
    isFunction: function(t) {
      return (toString.call(t) === "[object Function]") ? true : false;
    },

    //基本类型
    isNumber: function(t) {
      return (toString.call(t) === "[object Number]") ? true : false;
    },
    isString: function(t) {
      return (toString.call(t) === "[object String]") ? true : false;
    },
    isBoole: function(t) {
      return (toString.call(t) === "[object Boolean]") ? true : false;
    },
    now: function() {
      return (new Date()).getTime();
    },
    offset: function() {
      //chrome,safari,ie[html头部没有dtd声明]:document.body.scrollTop
      //firefox 或者 ie[html头部有dtd声明]:document.documentElement.scrollTop 
      var p;
      p.y = document.documentElement.scrollTop || document.body.scrollTop;
      p.x = document.documentElement.scrollLeft || document.body.scrollLeft;
      return p;
    },
    docSize: function(isAllDoc) {
      //HTML标准下:document.body是dom的根元素;document.body.clientHeight[文档在屏幕中的可见区域的高度],document.documentElement.clientHeight[整个文档的高度]            
      //XHTML标准下,document.documentElement才是dom的根元素;document.body.clientHeight[整个文档的高度],document.documentElement.clientHeight[文档在屏幕中的可见区域的高度]            
      var p;
      if (isAllDoc) { //整个文档的宽高(就是整个文档滚动累计高度)
        p.x = Math.max(document.body.clientWidth, document.documentElement.clientWidth);
        p.y = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
      } else { //文档在屏幕中的可见区域的宽高[不包括滚动区域的高度，比如滚动区域隐藏了1000px，展示区域500px，那么min就是取不包含滚动区域的文档高度]
        p.x = Math.min(document.body.clientWidth, document.documentElement.clientWidth);
        p.y = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
      }
      return p;
    },
    winSize: function(isInner) { //是否包括底部任务栏[屏幕宽高比较少用，一般用的是文档的宽高]
      var w;
      if (isInner) {
        p.x = window.screen.availWidth;
        p.y = window.screen.availHeight;
      } else { //是否包括底部任务栏
        p.x = window.screen.width;
        p.y = window.screen.height;
      }
      return w;
    },

    //通过事件获取鼠标位置[position是作为事件句柄]
    position:function(event){
      return {
        //全兼容
        clientX:event.clientX,//相对于浏览器可视窗口（不包括浏览器上面的地址栏，收藏栏等非展示区域）【ie和火狐下这clientX和clientY始终大2px】
        clientY:event.clientY,//同上
        screenX:event.screenX,//相对于桌面显示屏的X轴上的距离
        screenY:event.screenY,//同上
      }
    },

    //获取元素所在相对位置
    elePosition:function(ele,offset={}){
        if(!ele||ele.tagName.toLowerCase()=="body"){
            return {
                tag:"",
                left:offset.left||0,
                top:offset.top||0
            }
        }else{
            offset=window.J.elePosition(ele.offsetParent,offset);
            
            return {
                left:offset.left+ele.offsetLeft,
                top:offset.top+ele.offsetTop
            }

            // offset={//不能这样写，left和top重复执行了
            //     left:window.J.elePosition(ele.offsetParent,offset).left+ele.offsetLeft,
            //     top:window.J.elePosition(ele.offsetParent,offset).top+ele.offsetTop,
            //     tag:window.J.elePosition(ele.offsetParent,offset).tag+ele.tagName
            // }
        }
      //offsetTop ：ele相对于position为relative或者absolute元素的Y轴距离
      //offsetLeft ：ele元素相对于position为relative或者absolute元素的X轴距离
      //获取ele元素相对于文档的距离，可以通过无限循环offsetParent来获取最顶部的body，这样就可以获取ele相对于body的位置
      //ele的父元素也可以通过上面的步骤获取相对于body的位置，这样，父元素和子元素距离相减，就可以获取子元素与父元素的相对位置
    },

    parseXML: function(data, xml, tmp) {
      if (window.DOMParser) { // Standard 标准XML解析器
        tmp = new DOMParser();
        xml = tmp.parseFromString(data, "text/xml");
      } else { // IE IE的XML解析器
        xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = "false";
        xml.loadXML(data);
      }
      tmp = xml.documentElement;
      if (!tmp || !tmp.nodeName || tmp.nodeName === "parsererror") {
        jQuery.error("Invalid XML: " + data);
      }
      return xml;
    },

    //深度克隆
    clone: function(tgObj) {
      var obj = {};
      if (JSON && JSON.stringify && JSON.parse) {
        obj = JSON.parse(JSON.stringify(tgObj));
      } else {
        for (key in tgObj) {
          var value = tgObj[key];
          var type = toString.call(value);
          if (type == "[object Number]" || type == "[object String]" || type == "[object Boolean]") {
            obj[key] = value;
          } else {
            obj[key] = arguments.callee(value);
          }
        }
      }
      return obj;
    },

    //深度克隆（包括字符串的兼容）
    cloneAll:function(obj){
        var o, obj;
        if (obj.constructor == Object){
            o = new obj.constructor();
        }else{
            o = new obj.constructor(obj.valueOf());
        }
        for(var key in obj){
            if ( o[key] != obj[key] ){
                if ( typeof(obj[key]) == 'object' ){
                    o[key] = cloneObj(obj[key]);
                }else{
                    o[key] = obj[key];
                }
            }
        }
        o.toString = obj.toString;
        o.valueOf = obj.valueOf;
        return o;
    },


    /*
     *desc:把字符串转化成JOSN格式
     *dataStr:传入的字符串
     *format：‘{"age":25}’,一定要外部单引号，内部双引号的格式，否则会报错
     *note:eval("("+dataStr+")")也能实现相同的功能，但是性能没new Function好
     */
    parseJSON:function(dataStr){//new Function的时候，会自动转化成json
      return JSON.parse?JSON.parse(dataStr):(function (dataStr){return (new Function('return '+dataStr))();})();
    },

    //和$(document).ready一样
    DOMReady: function(callback) {
      var verson = parseInt(navigator.userAgent.substring(30, 31));
      //ie6-8没有DOMContentLoaded事件，所以要用setInterval事件来判断DOM有没有准备好，如果dom好了，那么document.documentElement.doScroll方法存在
      if (navigator.userAgent.indexOf("IE") != -1 && verson < 9) {
        var timeout = setInterval(function() {
          if (document.documentElement.doScroll) {
            callback();
            clearInterval(timeout); //绑定以后，要手动清除之前的setInterval
          }
        }, 20);
      } else { //ie9+和其他浏览器都有addEventListener事件
        document.addEventListener("DOMContentLoaded", callback);
      }
    },

    //递归调用实现，性能相对来说比通过获取所有元素再一一比对要好
    getElementsByClassName: function(range, className) {
      var len, rst = [];
      if (range.nodeType != 1 && range.nodeType != 9) {
        return [];
      }
      for (var nodeList = range.childNodes, len = nodeList.length, i = 0; i < len; i++) {
        if (nodeList[i].nodeType != 1) {
          continue;
        }
        if (nodeList[i].className.indexOf(className) != -1) {
          rst.push(nodeList[i]);
        }
        if (nodeList[i].hasChildNodes()) {
          rst = rst.concat(arguments.callee(nodeList[i], className));
        }
      }
      return rst;
    },

    //创建命名空间，例如namespace("a.b.c"):则会出现window.a={b:{c:{}}};是用object来实现命名空间
    namespace: function(nameList) {
      var arr = nameList ? nameList.split(".") : [],
        temp = window;
      for (var i = 0, len = arr.length; i < len; i++) {
        temp = temp[arr[i]] = temp[arr[i]] || {};
      }
      return temp;
    },

    //把数字变成固定长度，比如把14变成4位固定长度的值“0014”，formatZero(14,4);第二个参数是位数
    formatZero: function(str, type) {
      str += '';
      for (var i = 0, len = str.length; i < type - len; i++) {
        str = '0' + str;
      }
      return str;
    },

    //构造函数，可以把“sdf=34&sdf=fd”这种类型的字符串（和location.search结构类似）转化为对象
    QueryStringBuilder: function(baseQueryString) {
      var me = arguments.callee;
      if (!(this instanceof me)) {
        return new me(baseQueryString);
      }

      //获取key在keyMap中的index
      function getIndex(key) {
        key = key && key.toLowerCase();
        return ArrayIndexOf(keyMap, key);
      }

      function ArrayIndexOf(arr, key) {
        if (arr.indexOf) {
          return arr.indexOf(key);
        } else {
          for (var i = 0, len = arr.length || 0; i < len; i++) {
            if (arr[i] === key) {
              return i;
            }
          }
        }
        return -1;
      }

      var keyMap = []; //保存key.toLowerCase的数组
      var names = []; //保存key的数组
      var values = []; //保存value的数组
      var model = {}; //保存数据的对象

      if (baseQueryString) {
        var collections = baseQueryString.split('&');
        if (collections) {
          for (var i = collections.length - 1; i >= 0; i--) {
            var keyValue = collections[i];
            var keyValueArr = keyValue && keyValue.split('=');
            var key = keyValueArr && keyValueArr[0];
            var value = keyValueArr && keyValueArr[1];
            if (key) {
              model[key] = value;
              set(key, value);
            }
          };
        }
      }

      function set(key, value) {
        if (key && value) {
          var index = getIndex(key);
          if (index >= 0 && index < values.length) {
            values[index] = value;
          } else {
            names.push(key);
            values.push(value);
            keyMap.push(key.toLowerCase());
          }
          model[key] = value;
        }
        return value;
      }

      function get(key) {

        var result = key ? values[getIndex(key)] : model;
        return result;
        //return key ? model[key] : model;
      }

      function remove(key) {
        var _model = model;
        var index = getIndex(key);
        if (key && index > 0) {
          delete model[key];
          names.splice(index, 1);
          values.splice(index, 1);
          keyMap.splice(index, 1);
        } else {
          model = {};
          names = [];
          values = [];
          keyMap = [];
        }
      }

      var encodeURI = function(str) {
        try {
          str = str ? decodeURIComponent(str) : '';
        } catch (e) {};

        return encodeURIComponent(str).replace(/\*/g, "%2A").replace(/-/g, "%2D").replace(/_/g, "%5F").replace(/\./g, "%2E").replace(/!/g, '%21').replace(/~/g, '%7E').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
      };
      this.set = set;
      this.get = get;
      this.remove = remove;
      this.toString = function(t1, t2) {
        t1 = t1 || '=';
        t2 = t2 || '&';
        var result = [];
        for (var index = 0; index < names.length; index++) {
          if (values[index]) {
            result.push(encodeURI(names[index]) + t1 + encodeURI(values[index]));
          }
        }
        return result.join(t2) || '';
      }

    },

    //查询URL后面的尾随参数值（因为正则中有变量，所以只能用new来创建正则表达式）
    queryURL: function(name) {
      var rst = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i")) || [];
      return (rst.length == 2) ? rst[1] : "";
    },
               
    /*
     *@desc类的继承方法(Backbone的继承) add by jiajiechen
     *@param
        parent:父类
        protoProps：拓展原型（把该对象中的方法复制给子类原型）（当该对象是某个构造函数的原型，那么那个构造函数设置为子类：这样就能实现子类方法自定义）
        staticProps：拓展静态方法（把该对象中的方法复制给子类静态方法）
     */
    inherits: function(parent, protoProps, staticProps) {
      var child;
      var ctor = function() {};

      //extend方法
      function extend(origin,addObj) {
        for (var key in addObj) {
          origin[key] = addObj[key];
        }
      }

      //设置child构造函数：判断protoProps是否一个原型对象（prototype），如果是则将child赋值为原型对象所属的构造函数
      if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
      } else {
        //否则将新建一个构造函数赋值给child
        child = function() {
          //继承类的实例方法
          parent.apply(this, arguments);
        };
      }

      //继承类的静态方法（静态方法属于类，却不属于实例）
      extend(child, parent);

      //只继承原型，不继承实例方法，所以不直接写child.prototype = new parent();
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();

      //拓展原型
      if (protoProps){ extend(child.prototype, protoProps);}

      //拓展静态方法
      if (staticProps) extend(child, staticProps);

      //执行完child.prototype=new ctor后，child.prototype.constructor已经不指向child，所以此处需要把构造函数指回自己
      child.prototype.constructor = child;

      //查找父类可以通过__super__来查找
      child.__super__ = parent.prototype;

      return child;
    },

    //类继承方法（parent：父类对象或者父类方法，initializer:类的构造函数）
    Class: function(parent, initializer,needUseParentConstructor) {
      if (!initializer) {//如果只有一个参数，就表明只是声明一个构造函数，没有继承
        initializer = parent;
        parent = function() {};
      }
      var supper = typeof parent == "function" ? parent.prototype : parent; //父类
      var originFunction = function() {
          needUseParentConstructor&&parent.apply(this,arguments);//定义类的时候，设定是否需要调用“父类的构造函数”
          typeof initializer == "function" && initializer.apply(this, arguments);
        }
        //originFunction继承自parent
      originFunction.prototype = supper;//继承了父类原型的方法和属性
      originFunction.prototype.constructor = originFunction;//指回自己的构造函数

      // //拓展属性方法
      // originFunction.extend = originFunction.prototype.extend = function(o) {
      //   for (key in o) {
      //     this[key] = o[key];
      //   }
      // };
      return originFunction;
    },

    //把addObj中的所有属性复制给origin对象
    assign:function(origin,addObj){
      for (var key in addObj) {
        origin[key] = addObj[key];
      }
    },

    //支持多对象拓展,越后面的对象，他的属性的优先级越高
    extend:function(){
      var args = [].slice.call(arguments);
      var source = args.shift() || {};

      if (!source) {
        return false;
      }

      for (var i = 0, l = args.length; i < l; i++) {
        if (typeof args[i] === 'object') {
          for (var key in args[i]) {
            source[key] = args[i][key];
          }
        }
      }

      return source;
    },
    getQuery:function (name) {//查找url后面的参数值
      var path = /\?([^#]*)(#|$)/.exec(location.href);
      if (path) {
          path = new RegExp("(^|&)" + name.replace(/([\-.*+?^${}()|[\]\/\\])/g, '\\$1') + "=([^&]*)(&|$)", "i").exec(path[1]);
          if (path) {
              return decodeURIComponent(path[2]);
          }
      }
      return null;
    },

    //包裹ele元素，给该元素的所有事件句柄执行之前添加自己的track代码
    wrap:function(ele){
      var self=ele,i=0;
      ele.addEventListener=tgFunction(ele.addEventListener);
      function tgFunction(callback){
          var _callback=callback;
          return function(){
              var wrapperHandels=function(handel){
                  return function(){

                      self.setAttribute("data-index",++i);
                      handel.apply(this,arguments);
                  }
              }
              if(arguments[1]){//重写调用的handel函数
                  arguments[1]=wrapperHandels(arguments[1]);
              }
              _callback.apply(this,arguments);
          }
      }
      return self;
    },
    base64:{
        encode:function (e){var r="",i,s,o,u,a,f,l,c=0;e=t(e);while(c<e.length)i=e.charCodeAt(c++),s=e.charCodeAt(c++),o=e.charCodeAt(c++),u=i>>2,a=(i&3)<<4|s>>4,f=(s&15)<<2|o>>6,l=o&63,isNaN(s)?f=l=64:isNaN(o)&&(l=64),r=r+n.charAt(u)+n.charAt(a)+n.charAt(f)+n.charAt(l);return r},
        decode:function (t){var i="",s,o,u,a,f,l,c,h=0;t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(h<t.length)a=n.indexOf(t.charAt(h++)),f=n.indexOf(t.charAt(h++)),l=n.indexOf(t.charAt(h++)),c=n.indexOf(t.charAt(h++)),s=a<<2|f>>4,o=(f&15)<<4|l>>2,u=(l&3)<<6|c,i+=r.fromCharCode(s),l!=64&&(i+=r.fromCharCode(o)),c!=64&&(i+=r.fromCharCode(u));return i=e(i),i}
    },

    //动态加载js，支持回调
    loadJs: function (src, callback) {
        var sc = document.createElement('script');
        sc.type = 'text/javascript';
        sc.src = src;
        if (callback) {
            if (document.addEventListener) {
                sc.addEventListener("load", callback, false);
            } else {
                sc.onreadystatechange = function () {
                    if (/loaded|complete/.test(sc.readyState)) {
                        sc.onreadystatechange = null;
                        callback();
                    }
                };
            }
        }
        document.body.appendChild(sc);
    }

  };

  return w;
})(window);


//inherits方法的demo 1 ：自定义子类（这个比较少）
// inherit(function(){//第一个肯定是父类，可以自己写，也可以传递变量进来

// },function(){//第二个明显是一个构造函数的原型，所以该构造函数就是子类

// }.prototype,{//第三个对象毫无疑问，就是需要拓展的静态方法
//     func1:function(){}
// );

// inherits方法的demo 2： 子类没有自定义（这时候，其实父类做的事情相当于是子类），这个时候，其实实际上更像是定义一个函数，而不是继承，因为子类没有自定义，用的是父类的构造函数
// inherit(function(){//第一个肯定是父类，可以自己写，也可以传递变量进来

// },{//第二个是一个纯对象，所以该对象里面的所有方法会扩充为子类的原型方法
//     getName:function(){}
// },{//第三个对象毫无疑问，就是需要拓展的静态方法
//     func1:function(){}
// );


//拓展日期
(function(){
  Date.prototype.addMinute=function(n){
    return new Date(+this+n*60000);
  };
  Date.prototype.addHour=function(n){
    return new Date(+this+n*3600000);
  };
  Date.prototype.addDay=function(n){
    return new Date(+this+n*86400000);
  };

  //y月份添加是这样的，
  //如果n为0-11，那么设置好的月份数就是对应月份的相同date，但是如果那个月份刚好没有对应的那个date，比如3月有30号，但是2月没有30号，此时设置就会失效，时间会变成相同月份的某一天
  //如果n为负数或者大于11的值，那么超过11部分会按照月份继续往后延，比如n为24，就表示2年后；n为-24，就表示2年前；但是如果n月后没有对应的月份数，时间表示就会不准确
  Date.prototype.addMonth=function(n){
    var date= new Date();
    date.setMonth(date.getMonth()+n);
    return date
  };

  //今天：小时，分，秒，毫秒都为0
  Date.prototype.today = function () {
    return new Date().setHours(0,0,0,0);//第一个0设置小时，第二个设置分，第三个设置秒，第四个设置毫秒
  };

  //当前时间戳
  Date.now=function(){
    return +new Date;
  }

  //日期格式化
  Date.prototype.format = function (format) {
      var me = this, formators = Date._formators;
      if (!formators) {
          Date._formators = formators = {

              y: function (date, length) {
                  date = date.getFullYear();
                  return date < 0 ? 'BC' + (-date) : length < 3 && date < 2000 ? date % 100 : date;
              },

              M: function (date) {
                  return date.getMonth() + 1;
              },

              d: function (date) {
                  return date.getDate();
              },

              H: function (date) {
                  return date.getHours();
              },

              m: function (date) {
                  return date.getMinutes();
              },

              s: function (date) {
                  return date.getSeconds();
              },

              e: function (date, length) {
                  return (length === 1 ? '' : length === 2 ? '周' : '星期') + [length === 2 ? '日' : '天', '一', '二', '三', '四', '五', '六'][date.getDay()];
              }

          };
      }
      return (format || 'yyyy/MM/dd HH:mm:ss').replace(/(\w)\1*/g, function (all, key) {
          if (key in formators) {
              key = "" + formators[key](me, all.length);
              while (key.length < all.length) {
                  key = '0' + key;
              }
              all = key;
          }
          return all;
      });
  };
  //demo
  //new Date().format("yyyy-MM-dd--HH--mm--ss 周e")
  // "2016-03-02--20--49--37 周三"

})();




//设置viewport
// (function (doc, win) {

//   var docEl = doc.documentElement,
//   isIPhone = window.navigator.appVersion.match(/iphone/gi),
//   fontSize,scale,
//   platform = navigator.platform;

//   function recalc() {
//       var clientWidth = docEl.clientWidth; //window.document.documentElement.getBoundingClientRect().width
//       var dpr = window.devicePixelRatio;
//       var justMobile = !/win32/i.test(platform);  //只限移动端，pc不缩放

//         // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案 ,  其他设备下，仍旧使用1倍的方案
//         if (!(isIPhone && justMobile)) {
//             dpr = 1;
//         }

//         scale = 1 / (dpr > 1 ? 2 : dpr);
//         fontSize = 20 * (clientWidth / 320) / scale;

//         fontSize = (fontSize > 54) ? 54: fontSize;

//         docEl.style.fontSize = fontSize + 'px';
//         docEl.setAttribute('data-dpr', dpr);

//         //设置viewport
//         var viewport = document.querySelector('meta[name="viewport"]');
//         var viewport_content = 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no';

//         viewport && viewport.setAttribute('content', viewport_content);
//     };
//     recalc();
// })(document, window);

export default {}

