const Router = require('koa-router');
const sizeOf = require('image-size');
const koaBody = require('koa-body');
const path = require('path');
const util = require('./utils/tools');
const { saveHtml } = require('./controller/html');

const router = new Router();

router.options('/upload',function (ctx, next) {
  ctx.status = 204;
  ctx.body = 204;
})
//文件上传服务
router.post('/upload',koaBody({
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
}), function (ctx, next) {
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

router.get('/config', function (ctx, next) {
  ctx.response.type = 'html';
  ctx.body = saveHtml(121, {
    configList: [{"key":"1","name":"图片","count":1,"config":{"fileList":[{"uid":"rc-upload-1534229290074-5","lastModified":1533898779348,"lastModifiedDate":"2018-08-10T10:59:39.348Z","name":"1.jpg","size":389428,"type":"image/jpeg","percent":100,"originFileObj":{"uid":"rc-upload-1534229290074-5"},"status":"done","thumbUrl":"http://localhost:3100/images/20180814/1534230696253_1.jpg","response":{"data":{"imageUrl":"/images/20180814/1534230696253_1.jpg","width":750,"height":847},"msg":"success","code":200},"url":"http://localhost:3100/images/20180814/1534230696253_1.jpg","height":847,"width":750},{"uid":"rc-upload-1534229290074-7","lastModified":1533899195931,"lastModifiedDate":"2018-08-10T11:06:35.931Z","name":"4.jpg","size":389371,"type":"image/jpeg","percent":100,"originFileObj":{"uid":"rc-upload-1534229290074-7"},"status":"done","thumbUrl":"http://localhost:3100/images/20180814/1534230698926_4.jpg","response":{"data":{"imageUrl":"/images/20180814/1534230698926_4.jpg","width":750,"height":847},"msg":"success","code":200},"url":"http://localhost:3100/images/20180814/1534230698926_4.jpg","height":847,"width":750}]}},{"key":"2","name":"报名框","count":1,"config":{"checkList":["moblie","name"],"moblie":"请输入电话号码asd","name":"请输入姓名asd"}},{"key":"1","name":"图片","count":2,"config":{"fileList":[{"uid":"rc-upload-1534229290074-10","lastModified":1533899195931,"lastModifiedDate":"2018-08-10T11:06:35.931Z","name":"4.jpg","size":389371,"type":"image/jpeg","percent":100,"originFileObj":{"uid":"rc-upload-1534229290074-10"},"status":"done","thumbUrl":"http://localhost:3100/images/20180814/1534230714914_4.jpg","response":{"data":{"imageUrl":"/images/20180814/1534230714914_4.jpg","width":750,"height":847},"msg":"success","code":200},"url":"http://localhost:3100/images/20180814/1534230714914_4.jpg","height":847,"width":750}]}}],
    configBase: {"title":"nihao","bgColor":"rgb(239, 239, 239)"}
  });
});

router.post('/ap2/active/config', function (ctx, next) {
  ctx.response.type = 'html';
  ctx.body = saveHtml(121, ctx.request.body);
});

module.exports = router;
