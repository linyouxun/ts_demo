const { ActiveComponentType } = require('../utils/const');
function htmlhead(title, bgColor, modelColor, configList) {
  var flat = false;
  for(var i = 0; i < configList.length; i++) {
    if(configList[i].key === ActiveComponentType.swiper.key) {
      flat = true;
      break;
    }
  }
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>${title}</title>
      ${flat ? '<link rel="stylesheet" href="./css/swiper.min.css">' : ''}
      <style>
          * {
              margin: 0;
              padding: 0;
              vertical-align: middle;
              box-sizing: border-box;
          }
          html, body {
              ${!!bgColor ? 'background:' + bgColor + ';'  : 'background: #e7165a;'}
          }
          img {
              width: 100%;
          }
          .swiper-container1 {
            width: 100%;
            overflow: hidden;
          }
          .relative {
              position: relative;
          }
          .relative .form {
              right: 0;
              top: 4vw;
              margin: 4vw 0;
          }
          input {
              outline: none;
              width: 80vw;
              height: 11vw;
              line-height: 11vw;
              font-size: 3.5vw;
              border: 0;
              padding: 0 10px;
              border-radius: 5px;
              margin-bottom: 3vw;
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
              width: 80vw;
              padding: 0 11px;
              height: 11vw;
              line-height: 11vw;
              font-size: 4vw;
              border-radius: 5px;
              display: inline-block;
              margin-top: 3vw;
              margin-left: 0.5vw;
              font-weight: bold;
              text-align: center;
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
              ${!!modelColor ? 'background:' + modelColor + ';': 'background: #9e9e9e;'}
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
              ${!!modelColor ? 'color:' + modelColor + ';': 'color: #9e9e9e;'}
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
    <img src="./img/${src.split('/').pop()}"/>
  </div>`;
}

function htmlSwiperImgList({fileList}, key) {
  return `
  <div class="swiper-container${key}">
    <div class="swiper-wrapper">
      ${
        ['', ...fileList].reduce((imgDoms, item) => {
          return imgDoms + htmlSwiperImg(item.url);
        })
      }
    </div>
  </div>
  `;
}

function htmlSwiperImg(src) {
  return `<div class="swiper-slide">
        <img src="./img/${src.split('/').pop()}" class="swiper-lazy">
        <div class="swiper-lazy-preloader"></div>
      </div>`;
}

function htmlForm(formData, count) {
  const { checkList, fileList } = formData;
  let inputs = '';
  if (!formData.formWidth || formData.formWidth.length < 1) {
    formData.formWidth = [10, 90];
  }
  if (!formData.formRadius) {
    formData.formRadius = 0;
  }
  for(const item of checkList) {
    inputs += htmlInput(item, formData[item], formData, count)
  }
  let relative = false;
  if (!!fileList && fileList.length > 0) {
    relative = true;
  }
  return `
  <style>
    .form-item {
      margin-left:${formData.formWidth[0]}vw;
      width:${formData.formWidth[1] - formData.formWidth[0]}vw;
      border-radius: ${formData.formRadius / 50 * 11}vw;
    }
    .relative .abs {
      position: absolute;
      top: ${formData.formTop}vw;
      margin: 0;
    }
  </style>
  <div class="relative">
    ${ relative ? '<img src="./img/' + (fileList[0].url || '').split('/').pop() + '" style="width:100vw;height:' + fileList[0].height * 100 / fileList[0].width + 'vw;">' : ''}
    <div class="form ${relative ? 'abs' : ''}">
        ${inputs}
        <div style="color:${formData.button.color};background-color:${formData.button.bgColor}" id="submit${count}" class="submit-btn form-item" onclick="send${count}('${checkList.map(item => '#'+item+count).join("','")}')">${formData.button.tip}</div>
    </div>
  </div>`;
}


function htmlInput(id, inputItem, input, count) {
  return `
    <style>
      #${id}${count} {
        color:${inputItem.color};
        background-color:${inputItem.bgColor};
        /*border: 1px solid ${inputItem.bgColor};*/
      }
      /* #${id}${count}::-webkit-input-placeholder { WebKit browsers
        color:${inputItem.color};
        background-color:${inputItem.bgColor};
      }
      #${id}${count}::-moz-placeholder { Mozilla Firefox 4 to 18
        color:${inputItem.color};
        background-color:${inputItem.bgColor};
      }
      #${id}${count}::-moz-placeholder { Mozilla Firefox 19+
        color:${inputItem.color};
        background-color:${inputItem.bgColor};
      }
      #${id}${count}::-ms-input-placeholder { Internet Explorer 10+
        color:${inputItem.color};
        background-color:${inputItem.bgColor};
      }*/
    </style>
    <input id="${id}${count}" class="form-item" placeholder="${inputItem.tip}">
  `;
}

function htmlModel(modelTip, modelSubTip) {
  return `
  <div id="modal" class="layui-m-layermain" onclick="closeModal(event)" style="display:none;">
    <div class="layui-m-layersection">
        <div class="modal-content" onclick="stopPro(event)">
            <span class="title">提示</span>
            <div class="msg">${!!modelTip ? modelTip : '您填写的信息已提交成功'}</div>
            <div class="msg2">${!!modelSubTip ? modelSubTip : '感谢您的参与'}</div>
            <div class="submit-btn2" onclick="closeModal(event)">确定</div>
        </div>
    </div>
  </div>`;
}

function htmlFooter(id, configList) {
  let host = '47.106.174.88';
  if ('development' === process.env.NODE_ENV) {
    host = '127.0.0.1:3100';
  }
  var flat = false;
  for(var i = 0; i < configList.length; i++) {
    if(configList[i].key === ActiveComponentType.swiper.key) {
      flat = true;
      break;
    }
  }
  return `
  ${flat ? '<script src="./js/swiper.min.js"></script>' : ''}
  <script src="./js/jquery.min.js"></script>
  <script src="http://xcx.yoju360.com/dev/statistics${!!id ? '/' + id : ''}/s.js"></script>
  <script src="./js/layer.js"></script>
  <script src="./js/index.js"></script>
  </body>
  </html>`;
}

function jsLoction({configList}) {
  return `
  var city_id = '316';
  var city_name = '广州';
  var serverPath = 'http://www.yoju360.com';
  var isSend = false;
  $(function() {
    getLoction();
    var option = {lazy: {loadPrevNext: true,},autoplay: {stopOnLastSlide: true}};
    ${configList.filter(item => item.key === ActiveComponentType.swiper.key).map(item => {
      return `new Swiper('.swiper-container${item.count}', option);`
    }).join(`
    `)}
  });`;
}

function jsFormPost(htmlData) {
  var str = ''
  htmlData.configList.filter(item => {
    if(item.key == 2) {
      str += `
    function send${item.count}(${item.config.checkList.join(',')}) {
      if (isSend) return;
      ${item.config.checkList.map(item2 => {
        return `
      ${item2} = $(${item2}).val() || '';
      if (!${item2}Check(${item2}, '${item.config[item2].errorTip}' || '')) return;`
      }).join('')}
      disableBtn${item.count}();
      $.ajax({
          url: serverPath + '/api/',
          type:"POST",
          dataType:"json",
          data:{
            apiURL: 'api4/extraDecoration/decorate',
            city: city_name,
            ${item.config.checkList.map(item2 => {
              if (item2 === 'name') {
                return `
            name: name,`
              }
              if (item2 === 'mobile') {
                return `phone: mobile,`
              }
            }).join('')}
            area: 0,
            source: getUrlParam('utm_source'),
            info: getUrlParam('channel_city'),
            company: getUrlParam('company') || '优居',
          },
          success:function(response){
            ableBtn${item.count}();
            if (response.code == 200) {
              submit();
              // 统计报名信息
              sTool.sendForm({
                ${item.config.checkList.map(item2 => {
                  return item2 + ':' +item2
                }).join(',')}
              });
            } else {
              layer.open({
                content: '网络出现问题，请重新提交'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
              });
            }
          },
          error:function() {
            ableBtn${item.count}();
            layer.open({
              content: '网络出现问题，请重新提交'
              ,skin: 'msg'
              ,time: 2 //2秒后自动关闭
            });
          }
      });
    }
    function ableBtn${item.count}() {
      isSend = false;
      $('#submit${item.count}').css({
        background: '${item.config.button.bgColor}',
        color: '${item.config.button.color}'
      });
      $('#submit${item.count}')[0].innerText = '${item.config.button.tip}';
    }
    function disableBtn${item.count}() {
      isSend = true;
      $('#submit${item.count}').css({
        background: 'lightgray',
        color: '#000'
      });
      $('#submit${item.count}')[0].innerText = '${item.config.button.errorTip || "提交中。。。"}';
    }
    `;
    }
  });
  return str;
}

function jsExtra(htmlData) {
  return `
  function mobileCheck(phone, tip) {
    if (phone.trim().length == 0) {
      layer.open({
        content: tip || '手机号码不能为空'
        ,skin: 'msg'
        ,time: 2 //2秒后自动关闭
      });
      return false;
    }
    if (!isPoneAvailable(phone)) {
      layer.open({
        content: '手机号码格式错误'
        ,skin: 'msg'
        ,time: 2 //2秒后自动关闭
      });
      return false;
    }
    return true;
  }
  function nameCheck(name, tip) {
    if (name.trim().length == 0) {
      layer.open({
        content: tip || '姓名不能为空'
        ,skin: 'msg'
        ,time: 2 //2秒后自动关闭
      });
      return false;
    }
    return true;
  }
  function isPoneAvailable(phone) {
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(phone)) {
      return false;
    } else {
      return true;
    }
  }
  function submit() {
    $('#modal').css({
      display: ''
    });
  }
  function closeModal(e) {
    $('#modal').css({
      display: 'none'
    });
  }
  function stopPro(e) {
    e.stopPropagation()
  }
  function getLoction() {
    $.ajax({
      url: serverPath + '/api/location',
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



function jsStatistics(id) {
  let host = '47.106.174.88';
  if ('development' === process.env.NODE_ENV) {
    host = '127.0.0.1:3100';
  }
  return `
(function(w, d) {
  var userInfo = {};
  (function() {
    userInfo = setInfo()
  })();

  /**
   * 请求发送
   * @param params
   */
  var id = '${!!id ? id : 'none'}';
  function request (params) {
    var url = params.url || '';
    var method = params.method || 'GET';
    var data = params.data || {};
    var async = params.async || false;

    var timeout = params.timeout || 20000;
    var contentType = params.contentType || 'application/x-www-form-urlencoded';
    var responseType = (params.responseType || 'text').toLowerCase();
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, async);
    if (async) {
      xhr.timeout = timeout;
    }
    if (responseType === 'json') {
      xhr.responseType = 'text';
    }
    xhr.setRequestHeader('content-type', contentType);
    xhr.onload = function(result) {
      var responseText = this.responseText;
      if (responseType === 'json') {
        responseText = responseText ? JSON.parse(responseText) : responseText;
      }
      if (Object.prototype.toString.call(params.success) === '[object Function]') {
        params.success(responseText);
      } else {
        console.log(responseText);
      }
    }

    xhr.onerror = function(result) {
      var responseText = this.responseText;
      if (responseType === 'json') {
        responseText = responseText ? JSON.parse(responseText) : responseText;
      }
      if (Object.prototype.toString.call(params.onerror) === '[object Function]') {
        params.onerror(responseText);
      } else {
        console.log(this.responseText);
      }
    }

    xhr.ontimeout = function(result) {
      var responseText = this.responseText;
      if (Object.prototype.toString.call(params.ontimeout) === '[object Function]') {
        params.ontimeout(responseText);
      } else {
        console.log(this.responseText);
      }
    }
    if (contentType == 'application/x-www-form-urlencoded') {
      var strData = [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          strData.push(key + '=' + encodeURIComponent(data[key]));
        }
      }
      xhr.send(strData.join('&'));
    } else {
      xhr.send(JSON.stringify(data));
    }
  }

  function setCookie(name, value, exdays) {
    if (value) {
      var Days = !!exdays ? exdays : 300000;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days * 60 * 60 * 1000);
      d.cookie = name + "=" + escape(value) + ";expires=" + exp + ";path=/";
    }
  }

  function setCurrentDayCookie(name, value) {
    if (value) {
      var exp = new Date();
      exp.setHours(0);
      exp.setMinutes(0);
      exp.setSeconds(0);
      exp.setMilliseconds(0);
      exp.setDate(exp.getDate() + 1);
      d.cookie = name + "=" + escape(value) + ";expires=" + exp + ";path=/";
    }
  }

  function getCookie(name) {
    var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    var arr = d.cookie.match(reg);
    if (!!arr) {
      return decodeURIComponent(arr[2]);
    } else {
      return null;
    }
  }

  function objToUrlString(o) {
    if (o === null) {
      return '';
    };
    var paramsList = []
    for (var key in o) {
      if (o.hasOwnProperty(key)) {
        var element = o[key];
        var type = typeof element;
        if(type === 'string' || type === 'number' || type === 'boolean') {
          paramsList.push(key + '=' +  encodeURIComponent(element));
        } else {
          paramsList.push(key + '=' +  encodeURIComponent(JSON.stringify(element)));
        }
      }
    }
    return paramsList.join('&');
  }

  /**
   * 访问页面
   */
  function visitPage() {
    var vh = getCookie('visitor-' + location.origin + location.pathname) || 0;
    setCurrentDayCookie('visitor-' + location.origin + location.pathname, +vh + 1)
    var vc = getCookie('visitorCount') || 0;
    setCurrentDayCookie('visitorCount', +vc + 1)
    var vt = getCookie('visitorCountTotal') || 0;
    setCookie('visitorCountTotal', +vt + 1);
    var o = false;
    var d = new Date(+userInfo.visitor.split('_')[0]);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    if(new Date() - d > 86400000) {
      o = true;
    }
    var params = {
      screen: w.screen.width + '×' + w.screen.height,
      width: w.screen.width,
      height: w.screen.height,
      referrer: d.referrer || '',
      url: w.location.href,
      vh: +vh + 1,
      vc: +vc + 1,
      vt: +vt + 1,
      id: id,
      o: o,
      userId: userInfo.visitor
    }
    var img = new Image();
    img.src = 'http://${host}/statistics${!!id ? '/' + id : ''}/count.png?' + objToUrlString(params);
    img.onload = function() {}
  }

  /**
   * 报名信息
   */
  function sendForm(formData) {
    var params = {
      url: w.location.href,
      id: id,
      userId: userInfo.visitor,
      name: formData.name || '--',
      age: formData.age || 0,
      mobile: formData.mobile || '--',
      birthDate: formData.birthDate || +new Date(),
      version: formData.version || 'v1',
      extraInfo: JSON.stringify(formData)
    };
    console.log(params);
    request({
      url: 'http://${host}/custom${!!id ? '/' + id : ''}/add',
      method: 'POST',
      data: params,
      contentType: 'application/json',
      success: function(data) {
        console.log('');
      },
      onerror: function() {
        console.log('onerror');
      },
      ontimeout: function() {
        console.log('ontimeout');
      },
    })
  }

  /**
   * 设置访问信息
   */
  function setInfo() {
    var visitor = getCookie('visitor');
    if(!visitor) {
      visitor = +new Date() + '_' + Math.floor(Math.random() * 1000000);
      setCookie('visitor', visitor);
    }
    return {
      visitor: visitor
    };
  }

  // 页面加载监听
  if(!!d.addEventListener && !!w.addEventListener) {
    // document.addEventListener("DOMContentLoaded", function() {
    //   visitPage();
    // })
    w.addEventListener("load", function() {
      visitPage();
    });
  }
  w.sTool = {
    request: request,
    setCookie: setCookie,
    setCurrentDayCookie: setCurrentDayCookie,
    getCookie: getCookie,
    visitPage: visitPage,
    sendForm: sendForm,
  }
})(window, document)
  `;
}

module.exports = {
  htmlhead,
  htmlImg,
  htmlForm,
  htmlModel,
  htmlFooter,
  htmlImgList,
  htmlSwiperImgList,
  jsLoction,
  jsFormPost,
  jsExtra,
  jsLayerRender,
  cssLayerRender,
  jsStatistics
}
