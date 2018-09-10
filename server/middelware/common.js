const { needUserLogin, falied } = require('../controller/base');
const { ERRORCODE } = require('../utils/const');

exports.ipconfig = async (ctx, next) => {
  ctx.ipv4 = ctx.req.headers['x-real-ip'] || '127.0.0.1';
  await next();
}
exports.sessionCheck = async (ctx, next) => {
  // 接口
  const dirs = ['api2'];
  for (const iterator of dirs) {
    if(RegExp('/' + iterator).test(ctx.url)) {
      if(!ctx.session.name) {
        return needUserLogin(ctx, next);
      } else {
      }
    }
  }
  await next();
}

exports.sessionCheckGoLogin = async (ctx, next) => {
  if(!ctx.session.name) {
    ctx.redirect('/login');
  } else {
    await next();
  }
}

exports.commonError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = ERRORCODE.failed;
    ctx.body = {
      code: ERRORCODE.failed,
      message: error.message,
    };
  }
}

exports.commonHeaders = async (ctx, next) => {
  const startTime = new Date();
  if ('development' === process.env.NODE_ENV) {
    ctx.set("Access-Control-Allow-Origin", "http://localhost:3000");
  } else {
    ctx.set("Access-Control-Allow-Origin", "*");
  }
  ctx.set("Access-Control-Allow-Credentials", "true");
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  // ctx.set("Content-Type", "application/json;charset=utf-8");
  ctx.set("youju-env", process.env.NODE_ENV || 'production');
  await next();
  ctx.set("youju-loading-time", new Date() - startTime);
}
