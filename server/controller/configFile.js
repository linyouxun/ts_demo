
const sizeOf = require('image-size');

exports.addImg = async (ctx, next) => {
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
}
