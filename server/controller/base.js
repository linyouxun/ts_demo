exports.returnData = async( ctx, next, result, message, code) => {
  ctx.status = code;
  ctx.body = {
    code,
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

exports.falied = ( ctx, next, data, message = 'falied', code = 400) => {
  exports.returnData(ctx, next, data, message, code);
}
