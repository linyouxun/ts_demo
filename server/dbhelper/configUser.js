var mongoose = require('mongoose');
const moment = require('moment');
const UserInfo = mongoose.model('UserInfo');


/**
 * 保存配置信息
 * @param {保存配置信息} config
 */
exports.addConfigUserInfo = async (config) => {
  config = await UserInfo(config).save();
	return config;
}

/**
 * 查找用户信息
 * @param {查找用户信息} params
 */
exports.getConfigUserInfo = async (params) => {
  const res = await UserInfo.find(params).exec();
	return res;
}
/**
 * 查找配置列表信息
 */
exports.listConfigUserInfo = async(pageSize = 10, currentPage = 1, userInfo) => {
  const params = {'parentId': userInfo.id};
  let query = UserInfo.find(params);
  // 总数
  const total = await query.countDocuments();
  query = UserInfo.find(params).skip((currentPage - 1) * pageSize).limit(+pageSize);
  let list = await query.exec();
  list = list.map(item => {
    return {
      _id: item._id,
      meta: item.metaInfo,
      name: item.name,
      age: item.age,
      birthDate: item.birthDate,
      birthDay: moment(item.birthDay).format('YYYY-MM-DD hh:mm:ss'),
      mobile: item.mobile,
    }
  })
  return {
    list,
    pageSize: +pageSize,
    currentPage: currentPage > 0 ? +currentPage : 1,
    total: +total,
  };
}
