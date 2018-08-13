const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const koaBody = require('koa-body');
const sizeOf = require('image-size');
const app = new Koa();
const router = new Router();
const util = require('./utils/tools');

const koaStatic = require('koa-static'); // static
app.use(koaStatic(__dirname + '/../static'), {
  pathPrefix: '/static'
})
app.use(koaStatic(__dirname + '/../doc'))
app.use(koaBody({
  multipart:true,
  encoding:'gzip',
  formidable:{
    uploadDir:path.join(__dirname,'../static/images/tmp'),
    keepExtensions: true,
    maxFieldsSize:2 * 1024 * 1024,
    onFileBegin:(name,file) => {
      // console.log(name, file);
      // console.log(file);
      // 获取文件后缀
      // const ext = util.getUploadFileExt(file.name);
      // 最终要保存到的文件夹目录
      const relativeDir = `/images/${util.getUploadDirName()}`;
      const dir = path.join(__dirname,`../static${relativeDir}`);
      // 检查文件夹是否存在如果不存在则新建文件夹
      util.checkDirExist(dir);
      // 重新覆盖 file.path 属性
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

router.options('/upload',function (ctx, next) {
  console.log('log')
  ctx.status = 204;
  ctx.body = 204;
})
//文件上传服务
router.post('/upload', function (ctx, next) {
  const { files } = ctx.request;
  var dimensions = sizeOf(files.file.path);
  // 图片上传成功
  if (!!files) {
    ctx.body = {
      data: {
        imageUrl: files.file.imgPath,
        width: dimensions.width,
        height: dimensions.height,
      },
      msg: 'success',
      code: 200
    };
  } else {
    ctx.body = {
      data: {
        imageUrl: '',
        width: 0,
        height: 0,
      },
      msg: 'falied',
      code: 400
    };
  }
});

app.use(router.routes()).use(router.allowedMethods());

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3100);
