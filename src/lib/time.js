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

export default Date;