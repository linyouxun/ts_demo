const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const koaBody = require('koa-body');
const util = require('./utils/tools');
const koaStatic = require('koa-static'); // static
const models_path = path.join(__dirname, './models/db');
const app = new Koa();

// 添加mongo数据库
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/test";

mongoose.Promise = require('bluebird');
mongoose.connect(url, { useNewUrlParser: true }, (e) => {
  if (!e) {
    console.log('mongo connect success');
  } else {
    console.log('mongo connect failed');
  }
});

var walk = function(modelPath) {
  fs
    .readdirSync(modelPath)
    .forEach(function(file) {
      var filePath = path.join(modelPath, '/' + file)
      var stat = fs.statSync(filePath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(filePath);
        }
      }
      else if (stat.isDirectory()) {
        walk(filePath)
      }
    })
}
walk(models_path);

app.use(koaStatic(__dirname + '/../build'));
app.use(koaStatic(__dirname + '/../static'));
app.use(koaStatic(__dirname + '/../doc'));
app.use(koaBody());
// 查看远程IP地址
app.use(async (ctx, next) => {
  ctx.ipv4 = ctx.req.headers['X-real-ip'] || '127.0.0.1';
  await next();
})
app.use(async (ctx, next) => {
  const startTime = new Date();
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  // ctx.set("Content-Type", "application/json;charset=utf-8");
  ctx.set("Access-Control-Allow-Credentials", true);
  ctx.set("Access-Control-Expose-Headers", "myData");
  await next();
  ctx.set("youju-loading-time", new Date() - startTime);
})

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: error.message,
    };
  }
})
const router = require('./routes')();
app.use(router.routes()).use(router.allowedMethods());
// response
app.use(ctx => {
  const file = path.join(__dirname,'../build/index.html');
  if (util.checkFileExist(file)) {
    const html = fs.readFileSync(file);
    ctx.response.type = 'html';
    ctx.body = html;
  } else {
    ctx.body = 'Error...';
  }
});
app.listen(3100);
