const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const koaBody = require('koa-body');
const app = new Koa();
const util = require('./utils/tools');
const router = require('./routes');

const koaStatic = require('koa-static'); // static
app.use(koaStatic(__dirname + '/../build'));
app.use(koaStatic(__dirname + '/../static'), {
  root: '/static'
})
app.use(koaStatic(__dirname + '/../doc'));
app.use(koaBody({
  multipart:true,
  encoding:'gzip',
  formidable:{
    uploadDir:path.join(__dirname,'../static/images/tmp'),
    keepExtensions: true,
    maxFieldsSize:2 * 1024 * 1024,
    onFileBegin:(name,file) => {
      const relativeDir = `/images/${util.getUploadDirName()}`;
      const dir = path.join(__dirname,`../static${relativeDir}`);
      util.checkDirExist(dir);
      file.path = `${dir}/${+new Date()}_${file.name}`;
      file.imgPath = `${relativeDir}/${+new Date()}_${file.name}`;
    },
    onError:(err)=>{
      console.log(err);
    }
  }
}));
app.use(async (ctx, next) => {
  const startTime = new Date();
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  ctx.set("Content-Type", "application/json;charset=utf-8");
  ctx.set("Access-Control-Allow-Credentials", true);
  // ctx.set("Access-Control-Max-Age",300);
  ctx.set("Access-Control-Expose-Headers", "myData");
  await next();
  ctx.set("youju-loading-time", new Date() - startTime);
})

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: error.message,
    };
  }
})


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
