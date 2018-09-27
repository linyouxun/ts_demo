var mongoose = require('mongoose');
const ConfigHtml = mongoose.model('ConfigHtml');

/**
 * 保存配置信息
 * @param {保存配置信息} config
 */
exports.addConfigHtmlItem = async (config) => {
  config = await new ConfigHtml(config).save();
	return config;
}



/**
 * 查找单条记录
 */
exports.getConfigHtmlItem = async(objectId = '000000000000000000000000') => {
  const res = await ConfigHtml.findOne({'_id': mongoose.Types.ObjectId(objectId)}).exec();
  if(!res || (!!res.isDelete || !res.isUpdate)) {
    return {};
  }
  return res;
}

/**
 * 修改单条记录
 */
exports.updateConfigHtmlItem = async(objectId = '000000000000000000000000', config) => {
  const res = await ConfigHtml.findOne({'_id': mongoose.Types.ObjectId(objectId)}).exec();
  const {metaInfo, userInfo} = res;
  if(!!res && (!!res.isDelete || !res.isUpdate)) {
    return {};
  }
  metaInfo.updatetime = +new Date();
  if (!!res._id) {
    const res2 = await ConfigHtml.update({'_id': mongoose.Types.ObjectId(objectId)}, Object.assign(config, {metaInfo, userInfo})).exec();
    if (res2.ok > 0) {
      return res;
    }
    return res2;
  } else {
    return {};
  }
}

/**
 * 修改单条记录
 */
exports.updateConfigHtmlItem2 = async(objectId = '000000000000000000000000', config) => {
  const res = await ConfigHtml.findOne({'_id': mongoose.Types.ObjectId(objectId)}).exec();
  const {metaInfo, userInfo, configBase, configList} = res;
  if(res.isDelete || !res.isUpdate || res.isRelease) {
    return {};
  }
  if (!!res._id) {
    const res2 = await ConfigHtml.update({'_id': mongoose.Types.ObjectId(objectId)}, Object.assign(config, {metaInfo, userInfo, configBase, configList})).exec();
    if (res2.ok > 0) {
      return res;
    }
    return res2;
  } else {
    return {};
  }
}

/**
 * 删除单条记录
 */
exports.deleteConfigHtmlItem = async(objectId = '000000000000000000000000') => {
  const res = await ConfigHtml.update({'_id': mongoose.Types.ObjectId(objectId)}, { isDelete: true }).exec();
  // const res = await ConfigHtml.remove({'_id': mongoose.Types.ObjectId(objectId)}).exec();
  return res;
}


/**
 * 查找配置列表信息
 */
exports.listConfigHtml = async(pageSize = 10, currentPage = 1, params) => {
  let findParams = {
    isDelete: {'$ne': true}
  };
  if(!!params.userId) {
    findParams['userInfo.id'] =  params.userId;
  }
  let query = ConfigHtml.find(findParams);
  // 总数
  const total = await query.countDocuments();
  query = ConfigHtml.find(findParams).skip((currentPage - 1) * pageSize).limit(+pageSize);
  let list = await query.exec();
  list = list.map(item => {
    return {
      _id: item._id,
      meta: item.metaInfo,
      user: item.userInfo,
      isRelease: item.isRelease,
      isUpdate: item.isUpdate,
      title: item.configBase.title,
    }
  })
  return {
    list,
    pageSize: +pageSize,
    currentPage: currentPage > 0 ? +currentPage : 1,
    total: +total,
  };
}
