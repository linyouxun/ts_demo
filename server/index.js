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
  // 允许来自所有域名请求
  ctx.set("Access-Control-Allow-Origin", "*");
  // 这样就能只允许 http://localhost:8080 这个域名的请求了
  // ctx.set("Access-Control-Allow-Origin", "http://localhost:8080");

  // 设置所允许的HTTP请求方法
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");

  // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");

  // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。

  // Content-Type表示具体请求中的媒体类型信息
  ctx.set("Content-Type", "application/json;charset=utf-8");

  // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
  // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
  ctx.set("Access-Control-Allow-Credentials", true);

  // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
  // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
  // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
  ctx.set("Access-Control-Max-Age", 300);

  /*
  CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
      Cache-Control、
      Content-Language、
      Content-Type、
      Expires、
      Last-Modified、
      Pragma。
  */
  // 需要获取其他字段时，使用Access-Control-Expose-Headers，
  // getResponseHeader('myData')可以返回我们所需的值
  ctx.set("Access-Control-Expose-Headers", "myData");
  await next();
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
