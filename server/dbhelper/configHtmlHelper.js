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
  return res;
}

/**
 * 修改单条记录
 */
exports.updateConfigHtmlItem = async(objectId = '000000000000000000000000', config) => {
  const res = await ConfigHtml.findOne({'_id': mongoose.Types.ObjectId(objectId)}).exec();
  const {metaInfo, userInfo} = res;
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
 * 删除单条记录
 */
exports.deleteConfigHtmlItem = async(objectId = '000000000000000000000000') => {
  const res = await ConfigHtml.remove({'_id': mongoose.Types.ObjectId(objectId)}).exec();
  console.log(res);
  return res;
}


/**
 * 查找配置列表信息
 */
exports.listConfigHtml = async(pageSize = 10, currentPage = 1, params) => {
  let findParams = {};
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
