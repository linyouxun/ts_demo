
const { ERRORCODE } = require('../utils/const');

exports.returnData = async( ctx, next, result, message, code, stutasCode) => {
  ctx.status = code;
  ctx.body = {
    code,
    stutasCode: stutasCode || code,
    result,
    message
  }
}

exports.return204 = async( ctx, next, code = ERRORCODE.noChangeEmpty) => {
  ctx.status = code;
  ctx.body = code;
}


exports.success = ( ctx, next, data, message = 'success', code = ERRORCODE.success, stutasCode = ERRORCODE.success) => {
  exports.returnData(ctx, next, data, message, code, stutasCode);
}

exports.falied = ( ctx, next, data, message = 'falied', code = ERRORCODE.success, stutasCode = ERRORCODE.falied) => {
  exports.returnData(ctx, next, data, message, code, stutasCode);
}

exports.needUserLogin = ( ctx, next, data = {}, message = '用户没有登录', code = ERRORCODE.success, stutasCode = ERRORCODE.nologin) => {
  exports.returnData(ctx, next, data, message, code, stutasCode);
}

exports.noAllow = ( ctx, next, data = {}, message = '用户权限不够', code = ERRORCODE.success, stutasCode = ERRORCODE.noAllow) => {
  exports.returnData(ctx, next, data, message, code, stutasCode);
}

exports.checkUserInfo = async (ctx, next) => {
  if(!!ctx.session.name && !!ctx.session.leve) {
    await next();
  } else {
    exports.needUserLogin(ctx, next);
  }
}
