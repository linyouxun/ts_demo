
  var city_id = '316';
  var city_name = '广州';
  var serverPath = 'http://www.yoju360.com';
  var isSend = false;
  $(function() {
    getLoction();
    var option = {lazy: {loadPrevNext: true,},autoplay: {stopOnLastSlide: true}};
    new Swiper('.swiper-container1', option);
  });
      function btn1(url) {
        window.open(url, '_black');
      }
      
    function send1(mobile,name) {
      if (isSend) return;
      
      mobile = $(mobile).val() || '';
      if (!mobileCheck(mobile, '电话号码不能为空' || '')) return;
      name = $(name).val() || '';
      if (!nameCheck(name, '姓名不能为空' || '')) return;
      disableBtn1();
      $.ajax({
          url: serverPath + '/api/',
          type:"POST",
          dataType:"json",
          data:{
            apiURL: 'api4/extraDecoration/decorate',
            city: city_name,
            phone: mobile,
            name: name,
            area: 0,
            source: getUrlParam('utm_source'),
            info: getUrlParam('channel_city'),
            company: getUrlParam('company') || '优居',
          },
          success:function(response){
            ableBtn1();
            // 统计报名信息
            sTool.sendForm({
              res: JSON.stringify(response || {}),
              code: response.code || 404,
              mobile:mobile,name:name
            });
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
            ableBtn1();
            layer.open({
              content: '网络出现问题，请重新提交'
              ,skin: 'msg'
              ,time: 2 //2秒后自动关闭
            });
          }
      });
    }
    function ableBtn1() {
      isSend = false;
      $('#submit1').css({
        background: 'rgba(255,255,255,1)',
        color: 'rgba(0,0,0,1)'
      });
      $('#submit1')[0].innerText = '提交信息';
    }
    function disableBtn1() {
      isSend = true;
      $('#submit1').css({
        background: 'lightgray',
        color: '#000'
      });
      $('#submit1')[0].innerText = '提交中。。。';
    }
    
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
      reg = new RegExp(name + "-([^-.]*)");
      r = window.location.href.match(reg);
      if (r != null)
        return decodeURIComponent(r[1])
    }
    return null;
  }