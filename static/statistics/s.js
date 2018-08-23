(function s(d,w) {
  var img = d.createElement('img');
  img.src = 'http://127.0.0.1:3100/statistics/count.png?platform=' + w.navigator.platform + '&browser=' + myBrowser() + '&screen=' + w.screen.width + '×' + w.screen.height + '&width=' + w.screen.width + '&height=' + w.screen.height + '&referrer=' + encodeURIComponent(d.referrer);
  img.style='width:0;height:0;';
  d.body.appendChild(img);
})(document, window);

/***
 * 获取当前浏览器类型
 */
function myBrowser() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf("Opera") > -1;
  if (isOpera) { //判断是否Opera浏览器
      return "Opera"
  }
  ;
  if (userAgent.indexOf("Firefox") > -1) { //判断是否Firefox浏览器
      return "Firefox";
  }
  ;
  if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
  }
  ;
  if (userAgent.indexOf("Safari") > -1) { //判断是否Safari浏览器
      return "Safari";
  }
  ;
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { //判断是否IE浏览器
      return "IE";
  }
  ;
}
