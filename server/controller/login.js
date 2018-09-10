const { success, falied } = require('./base');
const path = require('path');
const fs = require('fs');
const util = require('../utils/tools');
const { ERRORCODE } = require('../utils/const');
const { getConfigUserInfo } = require('../dbhelper/configUser');

exports.login = async( ctx, next) => {
  const params = ctx.request.body;
  if (!params.name) {
    return falied(ctx, next, {}, 'name不能为空');
  }
  if (!params.pwd) {
    return falied(ctx, next, {}, 'pwd不能为空');
  }
  const res = await getConfigUserInfo(params);
  ctx.response.type = 'text/html';
  if(res.length === 0) {
    return falied(ctx, next, {}, '用户不存在或者密码错误');
  } else {
    ctx.session = {
      name: res[0].name,
      leve: res[0].leve + '',
      id: res[0]._id,
    };
    return success(ctx, next, {
      name: res[0].name,
      leve: res[0].leve + '',
      id: res[0]._id,
    }, '登录成功');
  }
}

exports.loginHTML = async( ctx, next) => {
  ctx.response.type = 'text/html';
  const file = path.join(__dirname,'../../static/login.html');
  if (util.checkFileExist(file)) {
    const html = fs.readFileSync(file);
    ctx.response.type = 'html';
    ctx.body = html;
  } else {
    ctx.status = ERRORCODE.failed;
    ctx.body = 'Error...';
  }
}

exports.logout = async( ctx, next) => {
  ctx.response.type = 'text/html';
  const params = {};
  ctx.session = params;
  success(ctx, next, params, '登出成功');
}
