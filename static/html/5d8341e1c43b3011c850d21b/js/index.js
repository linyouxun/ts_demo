
  var city_id = '316';
  var city_name = '广州';
  var serverPath = 'http://www.yoju360.com';
  var isSend = false;
  $(function() {
    getLoction();
    var option = {lazy: {loadPrevNext: true,},autoplay: {stopOnLastSlide: true}};
    
  });
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