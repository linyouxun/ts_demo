const Router = require('koa-router');
const sizeOf = require('image-size');

const router = new Router();

router.options('/upload',function (ctx, next) {
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

module.exports = router;
