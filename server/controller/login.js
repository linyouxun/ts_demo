const { success } = require('./base');
const util = require('../utils/tools');
const path = require('path');
const fs = require('fs');

exports.login = async( ctx, next) => {
  console.log(ctx.session);
  ctx.response.type = 'text/html';
  const params = {
    name: '测试2',
    leve: '0',
    id: "5b8cc9c0b0331c051477275b"
  };
  ctx.session = params;
  success(ctx, next, params, '登录成功');
}

exports.loginHTML = async( ctx, next) => {
  ctx.response.type = 'text/html';
  ctx.body = '暂时无法登陆，请联系工作人员^_^';
  // const file = path.join(__dirname,'../../build/index.html');
  // if (flat && util.checkFileExist(file)) {
  //   const html = fs.readFileSync(file);
  //   ctx.response.type = 'html';
  //   ctx.body = html;
  // }
}

exports.logout = async( ctx, next) => {
  ctx.response.type = 'text/html';
  console.log(ctx.session);
  const params = {};
  ctx.session = params;
  success(ctx, next, params, '登出成功');
}
