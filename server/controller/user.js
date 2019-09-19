const { addConfigUserInfo, listConfigUserInfo } = require('../dbhelper/configUser');
const { success, noAllow } = require('./base');
const { power } = require('../utils/const');
const moment = require('moment');


exports.createUser = async(ctx, next) => {
  const { name = 'test' } = ctx.request.query;
  // if (!(ctx.session.leve & power.admin)) {
  //   return noAllow(ctx, next);
  // }
  const res = await addConfigUserInfo({
    parentId: '5d832eb320b3421258b3f8e6',
    name,
    age: 18,
    mobile: '',
    birthDate: +new Date(),
    pwd: '123456',
    leve: power.general,
  });
  success(ctx, next, {
    metaInfo: res.metaInfo,
    id: res._id,
    parentId: res.parentId,
    name: res.name,
    age: res.age,
    mobile: res.mobile,
    birthDate: res.birthDate,
    birthDay: moment(res.birthDay).format('YYYY-MM-DD hh:mm:ss'),
    leve: res.leve,
  });
}
exports.listUser = async(ctx, next) => {
  const userInfo = ctx.session;
  const { pageSize = 10, currentPage = 1, extraData = '{}' } = ctx.request.query;
  if (+pageSize < 0) {
    pageSize = 10;
  }
  if (+currentPage < 0) {
    pageSize = 1;
  }
  let params = {};
  try {
    params = JSON.parse(extraData);
    if(!!params.id) {
      params.id = filterSpecialChar(params.id);
    }
    if(!!params.title) {
      params.title = filterSpecialChar(params.title);
    }
  } catch (error) {
    return falied(ctx, next, '额外参数出错了')
  }
  const res = await listConfigUserInfo(pageSize, currentPage, userInfo, params);
  success(ctx, next, res);
}

exports.updateUser = async(ctx, next) => {
  console.log('updateUser');
  await next();
}
exports.deleteUser = async(ctx, next) => {
  console.log('deleteUser');
  await next();
}
