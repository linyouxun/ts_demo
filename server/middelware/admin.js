
const path = require('path');
const fs = require('fs');
const util = require('../utils/tools');

exports.adminHtml = async (ctx, next) => {
  // 目录管理
  const dirs = ['manage', 'case', 'active', 'statistics', 'user'];
  let flat = false;
  for (const iterator of dirs) {
    if(RegExp('/' + iterator).test(ctx.url)) {
      flat = true;
      break;
    }
  }
  console.log('log');
  const file = path.join(__dirname,'../../build/index.html');
  if (flat && util.checkFileExist(file)) {
    // 判断是否登录
    if (!ctx.session.name) {
      return ctx.redirect('/login');
    }
    const html = fs.readFileSync(file);
    ctx.response.type = 'html';
    ctx.body = html;
  } else {
    ctx.status = 400;
    ctx.body = 'Error...';
  }
}
