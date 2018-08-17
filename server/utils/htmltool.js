function htmlhead(title, bgColor) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>${title}</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              vertical-align: bottom;
          }
          html, body {
              ${!!bgColor ? 'background:' + bgColor + ';'  : 'background: #e7165a;'}
          }
          img {
              width: 100%;
          }
          .relative {
              position: relative;
          }
          .relative .form {
              left: 1.5vw;
              right: 0;
              top: 4vw;
              text-align: center;
              margin: 4vw 0;
          }
          input {
              outline: none;
              width: 72vw;
              height: 11vw;
              line-height: 11vw;
              font-size: 3.5vw;
              border: 1px solid #ddd;
              padding: 0 10px;
              border-radius: 5px;
              margin-bottom: 2vw;
              margin-left: 0.5vw;
          }
          #area {
              width: 40vw;
              background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAABiCAMAAADdj4uDAAAAM1BMVEUAAAAzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzPKmszLAAAAEHRSTlMAQL9/z+8QUDBwIGDfr5+PJJBo8gAAAKdJREFUWMPtz8sOgyAUhOFBDiB46bz/01aoYSdN3TXOtzjxwh8AIiIiIo8wzzc7MwsJN1gGUog3tmSddLhSvC/IE9fN1bd9pb1K+7EcI/L6qo5MxiZjYRP68n3CqFzp51LzTEvR5cDzdsWmOCyZcIiBXOP5KeOQggeG5Y7mRS5ojNsxlzBjxPX1mTzPtnGqZ3D4Vrr+hA9fy8TG/Vx2Kh9SioiIiPy/N7lBCP5zIHTUAAAAAElFTkSuQmCC');
              background-repeat: no-repeat;
              background-position: 100%;
              background-size: 10vw;
          }
          select {
              appearance: none;
              -moz-appearance: none;
              -webkit-appearance: none;
              appearance: none;
              border: 1px solid #9e9e9e;
              width: 41vw;
              height: 11vw;
              line-height: 11vw;
              height: calc(11vw + 2px);
              line-height: calc(11vw + 2px);
              border-radius: 5px;
              padding: 0 10px;
              background: url(./img/下拉.png) no-repeat right/7px 5px #fff;
              background-position: 35vw;
              margin-bottom: 2vw;
              font-size: 4vw;
              outline: none;
          }

          .submit-btn {
              background: #fffc19;
              width: 72vw;
              padding: 0 11px;
              height: 11vw;
              line-height: 11vw;
              font-size: 4vw;
              color: #e74a75;
              border-radius: 5px;
              display: inline-block;
              margin-top: 2vw;
              font-weight: 500;
              margin-left: 0.5vw;
              font-weight: bold;
          }

          .modal-content {
              padding-top: 20px;
              padding-bottom: 25px;
              background: #fff;
              width: 80%;
              display: inline-block;
              border-radius: 5px;
              overflow: hidden;
              text-align: center;
          }

          .layui-m-layermain {
              background-color: rgba(0,0,0,.5);
              z-index: 9999;
          }
          .layui-m-layermain .layui-m-layersection {
              pointer-events: all;
          }
          .title {
              display: block;
              background: #e6416c;
              color: #fff;
              margin-top: -20px;
              height: 12vw;
              font-size: 6vw;
              line-height: 12vw;
          }
          .msg {
              color: #333;
              font-size: 5vw;
              line-height: 10vw;
              height: 10vw;
          }
          .msg2 {
              color: #888;
              font-size: 4vw;
              line-height: 8vw;
              height: 8vw;
          }
          .submit-btn2 {
              width: 100%;
              height: 11vw;
              line-height: 11vw;
              font-size: 5vw;
              color: #e6416c;
              display: inline-block;
              font-weight: 500;
              margin-bottom: -25px;
              text-align: center;
              border-top: 1px solid #efefef;
          }
          .header {
              width: 100%;
              height: 44px;
              background: #fff;
              border-bottom: .1rem solid #d7d7d7;
              position: relative;
              overflow: hidden;
          }
          .h-title {
              width: 100%;
              text-align: center;
              line-height: 44px;
              font-size: 16px;
              color: #333;
              font-weight: 700;
              margin: 0 auto;
              max-width: calc(100% - 10px);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
          }
      </style>
  </head>
  <body>`;
}

function htmlImgList({fileList}) {
  const imgs = ['', ...fileList].reduce((imgDoms, item) => {
    return imgDoms + htmlImg(item.url);
  });
  return imgs;
}
function htmlImg(src) {
  return `
  <div>
    <img src="${src}"/>
  </div>`;
}

function htmlForm(formData) {
  const { checkList } = formData;
  let inputs = '';
  for(const item of checkList) {
    inputs += htmlInput(item, formData[item])
  }
  return `
  <div class="relative">
    <div class="form">
        ${inputs}
        <div style="color:${formData.button.color};background-color:${formData.button.bgColor}" id="submit" class="submit-btn" onclick="send('${checkList.join("','")}')">${formData.button.tip}</div>
    </div>
  </div>`;
}
function htmlInput(id, inputItem) {
  return `
    <style>
      #${id} {
        color:${inputItem.color};
        background-color:${inputItem.bgColor};
        border: 1px solid ${inputItem.bgColor};
      }
      #${id}::-webkit-input-placeholder { /* WebKit browsers */
        color:${inputItem.color};
        background-color:${inputItem.bgColor};
      }
      #${id}::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color:${inputItem.color};
        background-color:${inputItem.bgColor};
      }
      #${id}::-moz-placeholder { /* Mozilla Firefox 19+ */
        color:${inputItem.color};
        background-color:${inputItem.bgColor};
      }
      #${id}::-ms-input-placeholder { /* Internet Explorer 10+ */
        color:${inputItem.color};
        background-color:${inputItem.bgColor};
      }
    </style>
    <input id="${id}" type="text" placeholder="${inputItem.tip}">
  `;
}

function htmlModel() {
  return `
  <div id="modal" class="layui-m-layermain" onclick="closeModal(event)" style="display:none;">
    <div class="layui-m-layersection">
        <div class="modal-content" onclick="stopPro(event)">
            <span class="title">提示</span>
            <div class="msg">您填写的信息已<span class="red">提交成功</span></div>
            <div class="msg2">感谢您的参与</div>
            <div class="submit-btn2" onclick="closeModal(event)">确定</div>
        </div>
    </div>
  </div>`;
}

function htmlFooter() {
  return `
  <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
  <script src="./js/layer.js"></script>
  <script src="./js/index.js"></script>
  </body>
  </html>`;
}

function jsLoction() {
  return `
  function getLoction() {
      $.ajax({
          url: 'http://www.yoju360.com/api/location',
          type:'GET',
          dataType:'json',
          success:function(response){
          if(response.code == 200) {
              city_id = response.result.cityData.city_id;
              city_name = response.result.cityData.city_name;
          } else {
              return layer.open({
              content: '定位信息出错了'
              ,skin: 'msg'
              ,time: 2 //2秒后自动关闭
              });
          }
          },
          error:function() {
          return layer.open({
              content: '定位信息出错了'
              ,skin: 'msg'
              ,time: 2 //2秒后自动关闭
          });
          }
      });
  }
  getLoction();
  var city_id = '316';
  var city_name = '广州';`;
}

function jsFormPost() {
  return `
  var isSend = false;
  function send(params, params2) {
      if (isSend) return;
      var name = document.getElementById(params).value || '';
      var phone = document.getElementById(params2).value || '';
      if (name.trim().length == 0) {
          return layer.open({
              content: '姓名不能为空'
              ,skin: 'msg'
              ,time: 2 //2秒后自动关闭
          });
      }
      if (phone.trim().length == 0) {
          return layer.open({
              content: '手机号码不能为空'
              ,skin: 'msg'
              ,time: 2 //2秒后自动关闭
          });
      }
      if (!isPoneAvailable(phone)) {
          return layer.open({
              content: '手机号码格式错误'
              ,skin: 'msg'
              ,time: 2 //2秒后自动关闭
          });
      }
      disableBtn();
      var url = 'http://m.yoju360.com/api/';
      $.ajax({
          url: url,
          type:"POST",
          dataType:"json",
          data:{
              apiURL: 'decorate/decoration/apply',
              cityId: city_id,
              cityName: city_name,
              nickName: name,
              cName: name,
              mobile: phone,
              phoneMsg: 1,
              smsMsg: 1,
              utmSource: getUrlParam('utm_source'),
              channelCity: getUrlParam('channel_city'),
          },
          success:function(response){
              ableBtn();
              if (response.code == 200) {
                  submit();
              } else {
                  layer.open({
                      content: '网络出现问题，请重新提交'
                      ,skin: 'msg'
                      ,time: 2 //2秒后自动关闭
                  });
              }
          },
          error:function() {
              ableBtn();
              layer.open({
                  content: '网络出现问题，请重新提交'
                  ,skin: 'msg'
                  ,time: 2 //2秒后自动关闭
              });
          }
      });
  }
  `;
}

function jsExtra() {
  return `
  function isPoneAvailable(phone) {
      var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(phone)) {
          return false;
      } else {
          return true;
      }
  }

  function disableBtn() {
      isSend = true;
      document.getElementById('submit').style = 'background: lightgray;';
      document.getElementById('submit').innerText = '预约提交中...';
  }
  function ableBtn() {
      isSend = false;
      document.getElementById('submit').style = '';
      document.getElementById('submit').innerText = '报名即送顾家无忧枕';
  }


  function submit() {
      document.getElementById('modal').style = "display:";
      document.getElementById('modal').style.cssText = "";
  }

  function closeModal(e) {
      document.getElementById('modal').style = "display:none";
      document.getElementById('modal').style.cssText = "display:none";
  }

  function stopPro(e) {
      e.stopPropagation()
  }

  function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null)
          return decodeURIComponent(r[2]);
      else { // 尝试匹配伪静态的地址参数, 如getinfo-productId-29.html
          reg = new RegExp(name + "-([^-\.]*)");
          r = window.location.href.match(reg);
          if (r != null)
              return decodeURIComponent(r[1])
      }
      return null;
  }`;
}

function jsLayerRender() {
  return `;!function(e){"use strict";var t=document,n="querySelectorAll",i="getElementsByClassName",a=function(e){return t[n](e)},s={type:0,shade:!0,shadeClose:!0,fixed:!0,anim:"scale"},l={extend:function(e){var t=JSON.parse(JSON.stringify(s));for(var n in e)t[n]=e[n];return t},timer:{},end:{}};l.touch=function(e,t){e.addEventListener("click",function(e){t.call(this,e)},!1)};var r=0,o=["layui-m-layer"],c=function(e){var t=this;t.config=l.extend(e),t.view()};c.prototype.view=function(){var e=this,n=e.config,s=t.createElement("div");e.id=s.id=o[0]+r,s.setAttribute("class",o[0]+" "+o[0]+(n.type||0)),s.setAttribute("index",r);var l=function(){var e="object"==typeof n.title;return n.title?'<h3 style="'+(e?n.title[1]:"")+'">'+(e?n.title[0]:n.title)+"</h3>":""}(),c=function(){"string"==typeof n.btn&&(n.btn=[n.btn]);var e,t=(n.btn||[]).length;return 0!==t&&n.btn?(e='<span yes type="1">'+n.btn[0]+"</span>",2===t&&(e='<span no type="0">'+n.btn[1]+"</span>"+e),'<div class="layui-m-layerbtn">'+e+"</div>"):""}();if(n.fixed||(n.top=n.hasOwnProperty("top")?n.top:100,n.style=n.style||"",n.style+=" top:"+(t.body.scrollTop+n.top)+"px"),2===n.type&&(n.content='<i></i><i class="layui-m-layerload"></i><i></i><p>'+(n.content||"")+"</p>"),n.skin&&(n.anim="up"),"msg"===n.skin&&(n.shade=!1),s.innerHTML=(n.shade?"<div "+("string"==typeof n.shade?'style="'+n.shade+'"':"")+' class="layui-m-layershade"></div>':"")+'<div class="layui-m-layermain" '+(n.fixed?"":'style="position:static;"')+'><div class="layui-m-layersection"><div class="layui-m-layerchild '+(n.skin?"layui-m-layer-"+n.skin+" ":"")+(n.className?n.className:"")+" "+(n.anim?"layui-m-anim-"+n.anim:"")+'" '+(n.style?'style="'+n.style+'"':"")+">"+l+'<div class="layui-m-layercont">'+n.content+"</div>"+c+"</div></div></div>",!n.type||2===n.type){var d=t[i](o[0]+n.type),y=d.length;y>=1&&layer.close(d[0].getAttribute("index"))}document.body.appendChild(s);var u=e.elem=a("#"+e.id)[0];n.success&&n.success(u),e.index=r++,e.action(n,u)},c.prototype.action=function(e,t){var n=this;e.time&&(l.timer[n.index]=setTimeout(function(){layer.close(n.index)},1e3*e.time));var a=function(){var t=this.getAttribute("type");0==t?(e.no&&e.no(),layer.close(n.index)):e.yes?e.yes(n.index):layer.close(n.index)};if(e.btn)for(var s=t[i]("layui-m-layerbtn")[0].children,r=s.length,o=0;o<r;o++)l.touch(s[o],a);if(e.shade&&e.shadeClose){var c=t[i]("layui-m-layershade")[0];l.touch(c,function(){layer.close(n.index,e.end)})}e.end&&(l.end[n.index]=e.end)},e.layer={v:"2.0",index:r,open:function(e){var t=new c(e||{});return t.index},close:function(e){var n=a("#"+o[0]+e)[0];n&&(n.innerHTML="",t.body.removeChild(n),clearTimeout(l.timer[e]),delete l.timer[e],"function"==typeof l.end[e]&&l.end[e](),delete l.end[e])},closeAll:function(){for(var e=t[i](o[0]),n=0,a=e.length;n<a;n++)layer.close(0|e[0].getAttribute("index"))}},"function"==typeof define?define(function(){return layer}):function(){var e=document.scripts,n=e[e.length-1],i=n.src,a=i.substring(0,i.lastIndexOf("/")+1);n.getAttribute("merge")||document.head.appendChild(function(){var e=t.createElement("link");return e.href="./css/layer.css?2.0",e.type="text/css",e.rel="styleSheet",e.id="layermcss",e}())}()}(window);`;
}

function cssLayerRender() {
  return `.layui-m-layer{position:relative;z-index:19891014}.layui-m-layer *{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}.layui-m-layermain,.layui-m-layershade{position:fixed;left:0;top:0;width:100%;height:100%}.layui-m-layershade{background-color:rgba(0,0,0,.7);pointer-events:auto}.layui-m-layermain{display:table;font-family:Helvetica,arial,sans-serif;pointer-events:none}.layui-m-layermain .layui-m-layersection{display:table-cell;vertical-align:middle;text-align:center}.layui-m-layerchild{position:relative;display:inline-block;text-align:left;background-color:#fff;font-size:14px;border-radius:5px;box-shadow:0 0 8px rgba(0,0,0,.1);pointer-events:auto;-webkit-overflow-scrolling:touch;-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation-duration:.2s;animation-duration:.2s}@-webkit-keyframes layui-m-anim-scale{0%{opacity:0;-webkit-transform:scale(.5);transform:scale(.5)}100%{opacity:1;-webkit-transform:scale(1);transform:scale(1)}}@keyframes layui-m-anim-scale{0%{opacity:0;-webkit-transform:scale(.5);transform:scale(.5)}100%{opacity:1;-webkit-transform:scale(1);transform:scale(1)}}.layui-m-anim-scale{animation-name:layui-m-anim-scale;-webkit-animation-name:layui-m-anim-scale}@-webkit-keyframes layui-m-anim-up{0%{opacity:0;-webkit-transform:translateY(800px);transform:translateY(800px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes layui-m-anim-up{0%{opacity:0;-webkit-transform:translateY(800px);transform:translateY(800px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}.layui-m-anim-up{-webkit-animation-name:layui-m-anim-up;animation-name:layui-m-anim-up}.layui-m-layer0 .layui-m-layerchild{width:90%;max-width:640px}.layui-m-layer1 .layui-m-layerchild{border:none;border-radius:0}.layui-m-layer2 .layui-m-layerchild{width:auto;max-width:260px;min-width:40px;border:none;background:0 0;box-shadow:none;color:#fff}.layui-m-layerchild h3{padding:0 10px;height:60px;line-height:60px;font-size:16px;font-weight:400;border-radius:5px 5px 0 0;text-align:center}.layui-m-layerbtn span,.layui-m-layerchild h3{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.layui-m-layercont{padding:50px 30px;line-height:22px;text-align:center}.layui-m-layer1 .layui-m-layercont{padding:0;text-align:left}.layui-m-layer2 .layui-m-layercont{text-align:center;padding:0;line-height:0}.layui-m-layer2 .layui-m-layercont i{width:25px;height:25px;margin-left:8px;display:inline-block;background-color:#fff;border-radius:100%;-webkit-animation:layui-m-anim-loading 1.4s infinite ease-in-out;animation:layui-m-anim-loading 1.4s infinite ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.layui-m-layerbtn,.layui-m-layerbtn span{position:relative;text-align:center;border-radius:0 0 5px 5px}.layui-m-layer2 .layui-m-layercont p{margin-top:20px}@-webkit-keyframes layui-m-anim-loading{0%,100%,80%{transform:scale(0);-webkit-transform:scale(0)}40%{transform:scale(1);-webkit-transform:scale(1)}}@keyframes layui-m-anim-loading{0%,100%,80%{transform:scale(0);-webkit-transform:scale(0)}40%{transform:scale(1);-webkit-transform:scale(1)}}.layui-m-layer2 .layui-m-layercont i:first-child{margin-left:0;-webkit-animation-delay:-.32s;animation-delay:-.32s}.layui-m-layer2 .layui-m-layercont i.layui-m-layerload{-webkit-animation-delay:-.16s;animation-delay:-.16s}.layui-m-layer2 .layui-m-layercont>div{line-height:22px;padding-top:7px;margin-bottom:20px;font-size:14px}.layui-m-layerbtn{display:box;display:-moz-box;display:-webkit-box;width:100%;height:50px;line-height:50px;font-size:0;border-top:1px solid #D0D0D0;background-color:#F2F2F2}.layui-m-layerbtn span{display:block;-moz-box-flex:1;box-flex:1;-webkit-box-flex:1;font-size:14px;cursor:pointer}.layui-m-layerbtn span[yes]{color:#40AFFE}.layui-m-layerbtn span[no]{border-right:1px solid #D0D0D0;border-radius:0 0 0 5px}.layui-m-layerbtn span:active{background-color:#F6F6F6}.layui-m-layerend{position:absolute;right:7px;top:10px;width:30px;height:30px;border:0;font-weight:400;background:0 0;cursor:pointer;-webkit-appearance:none;font-size:30px}.layui-m-layerend::after,.layui-m-layerend::before{position:absolute;left:5px;top:15px;content:'';width:18px;height:1px;background-color:#999;transform:rotate(45deg);-webkit-transform:rotate(45deg);border-radius:3px}.layui-m-layerend::after{transform:rotate(-45deg);-webkit-transform:rotate(-45deg)}body .layui-m-layer .layui-m-layer-footer{position:fixed;width:95%;max-width:100%;margin:0 auto;left:0;right:0;bottom:10px;background:0 0}.layui-m-layer-footer .layui-m-layercont{padding:20px;border-radius:5px 5px 0 0;background-color:rgba(255,255,255,.8)}.layui-m-layer-footer .layui-m-layerbtn{display:block;height:auto;background:0 0;border-top:none}.layui-m-layer-footer .layui-m-layerbtn span{background-color:rgba(255,255,255,.8)}.layui-m-layer-footer .layui-m-layerbtn span[no]{color:#FD482C;border-top:1px solid #c2c2c2;border-radius:0 0 5px 5px}.layui-m-layer-footer .layui-m-layerbtn span[yes]{margin-top:10px;border-radius:5px}body .layui-m-layer .layui-m-layer-msg{width:auto;max-width:90%;margin:0 auto;bottom:-150px;background-color:rgba(0,0,0,.7);color:#fff}.layui-m-layer-msg .layui-m-layercont{padding:10px 20px}`;
}

module.exports = {
  htmlhead,
  htmlImg,
  htmlForm,
  htmlModel,
  htmlFooter,
  htmlImgList,
  jsLoction,
  jsFormPost,
  jsExtra,
  jsLayerRender,
  cssLayerRender,
}
