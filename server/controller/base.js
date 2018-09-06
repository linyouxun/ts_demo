exports.returnData = async( ctx, next, result, message, code, stutasCode) => {
  ctx.status = code;
  ctx.body = {
    code,
    stutasCode: stutasCode || code,
    result,
    message
  }
}

exports.return204 = async( ctx, next, code = 204) => {
  ctx.status = code;
  ctx.body = code;
}


exports.success = ( ctx, next, data, message = 'success', code = 200) => {
  exports.returnData(ctx, next, data, message, code);
}

exports.falied = ( ctx, next, data, message = 'falied', code = 200, stutasCode = 400) => {
  exports.returnData(ctx, next, data, message, code, stutasCode);
}

exports.checkUserInfo = async (ctx, next) => {
  if(!!ctx.session.name && !!ctx.session.leve) {
    await next();
  } else {
    exports.returnData(ctx, next, {}, '用户没有登录', 200, 400);
  }
}
