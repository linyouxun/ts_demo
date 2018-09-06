const { addConfigUserInfo, listConfigUserInfo } = require('../dbhelper/configUser');
const { success } = require('./base');
const moment = require('moment');


exports.createUser = async(ctx, next) => {
  console.log(ctx.request.body);
  const res = await addConfigUserInfo({
    parentId: '5b8cc9c0b0331c051477275b',
    name: 'admin',
    age: 18,
    mobile: '',
    birthDate: +new Date(),
    pwd: 'admin',
    leve: '0',
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
  const { pageSize = 10, currentPage = 1, id = '0' } = ctx.request.query;
  if (+pageSize < 0) {
    pageSize = 10;
  }
  if (+currentPage < 0) {
    pageSize = 1;
  }
  const res = await listConfigUserInfo(pageSize, currentPage, userInfo);
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
