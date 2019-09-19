const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const koaBody = require('koa-body');
const koaStatic = require('koa-static'); // static
const models_path = path.join(__dirname, './models/db');
const session = require('koa-session');
const {adminHtml} = require('./middelware/admin');
const {ipconfig, sessionCheck, commonError, commonHeaders} = require('./middelware/common');
const app = new Koa();
app.keys = ['test-lyx'];
const CONFIG = {
  key: 'test:mmp',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};
app.use(session(CONFIG, app));

// 添加mongo数据库
const mongoose = require('mongoose');
const url = "mongodb://218.244.145.61:27017/test";

mongoose.Promise = require('bluebird');
mongoose.connect(url, { useNewUrlParser: true }, (e) => {
  if (!e) {
    console.log('mongo connect success');
  } else {
    console.log('mongo connect failed');
  }
});
// mongo配置
var walk = function(modelPath) {
  fs.readdirSync(modelPath)
    .forEach(function(file) {
      var filePath = path.join(modelPath, '/' + file);
      var stat = fs.statSync(filePath);
      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(filePath);
        }
      }
      else if (stat.isDirectory()) {
        walk(filePath);
      }
    })
};
walk(models_path);
app.use(koaStatic(__dirname + '/../build'));
app.use(koaStatic(__dirname + '/../static'));
app.use(koaStatic(__dirname + '/../doc'));
app.use(koaBody());
// 查看远程IP地址
app.use(ipconfig);
// 设置头
app.use(commonHeaders);
// 登陆校验
app.use(sessionCheck);
// 通用错误异常处理
app.use(commonError);
const router = require('./routes')();
app.use(router.routes()).use(router.allowedMethods());
// response
app.use(adminHtml);
app.listen(3100);
