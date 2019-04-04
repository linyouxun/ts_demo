
const sizeOf = require('image-size');

const { success, falied } = require('./base')
exports.addImg = async (ctx, next) => {
  const { files } = ctx.request;
  for (const key in files) {
    if (files.hasOwnProperty(key) && (key == 'file' || key == 'image')) {
      var dimensions = sizeOf(files[key].path);
      // 图片上传成功
      if (!!files) {
        ctx.body = {
          data: {
            imageUrl: files[key].imgPath,
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
    } else {
      return success(ctx, next, {
        path: files[key].imgPath,
        name: files[key].name,
        size: files[key].size,
        type: files[key].type,
        width: 0,
        height: 0,
      })
    }
  }
}
