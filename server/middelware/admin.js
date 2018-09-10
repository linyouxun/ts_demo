
const path = require('path');
const fs = require('fs');
const cheerio = require("cheerio");
const util = require('../utils/tools');
const { ERRORCODE } = require('../utils/const');

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
  const file = path.join(__dirname,'../../build/index.html');
  if (flat && util.checkFileExist(file)) {
    // 判断是否登录
    if (!ctx.session.name) {
      return ctx.redirect('/login');
    }
    const html = fs.readFileSync(file);
    ctx.response.type = 'html';
    const $ = cheerio.load(html,{ decodeEntities: false});
    $('head').append(`<script>var userLeve = ${ctx.session.leve}</script>`);
    ctx.body = $.html();
  } else {
    ctx.status = ERRORCODE.failed;
    ctx.body = 'Error...';
  }
}
