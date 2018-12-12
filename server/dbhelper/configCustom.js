var mongoose = require('mongoose');
const Custom = mongoose.model('Custom');

/**
 * 保存配置信息
 * @param {保存配置信息} config
 */
exports.addConfigCustomItem = async (config) => {
  config = await Custom(config).save();
	return config;
}

/**
 * 更新配置信息
 * @param {保存配置信息} config
 */
exports.updateConfigCustomItem = async (objectId, config) => {
  const res2 = await Custom.update({'_id': mongoose.Types.ObjectId(objectId)}, config).exec();
  if (res2.ok > 0) {
    return res2;
  }
  return {};
}

exports.findConfigCustomItem = async (findParams) => {
  const res = await Custom.findOne(findParams).exec();
  if(!res) {
    return {};
  }
  return res;
}


/**
 * 列表信息
 * @param {保存配置信息} params
 */
exports.listCustomItem = async (currentPage, pageSize, params) => {
  let findParams = {};
  if(!!params.userId) {
    findParams['affiliation.id'] =  params.userId;
  }
  if(!!params.phone) {
    findParams['mobile'] =  RegExp(params.phone);
  }
  if(!!params.id) {
    findParams['affiliation.pageId'] = RegExp(params.id);
  }
  if(!!params.time && params.time.length > 0) {
    findParams['signTime'] = {
      '$gte': params.time[0]+'',
      '$lte': params.time[1]+''
    };
  }
  const total = await Custom.find(findParams).countDocuments();
  let list = await Custom.find(findParams).sort({'signTime': -1}).skip((currentPage - 1) * pageSize).limit(+pageSize).exec();
  list = list.map(item => {
    return {
      isRepeatSign:item.isRepeatSign,
      userId:item.userId,
      mobile:item.mobile,
      createtime:item.createtime,
      source:item.source,
      signTime:item.signTime,
      name:item.name,
      age:item.age,
      version:item.version,
      cityInfo:item.cityInfo,
      extraInfo:item.extraInfo,
      birthDate:item.birthDate,
      signHistory:item.signHistory,
      affiliation:item.affiliation
    };
  })
  return {
    list,
    pageSize: +pageSize,
    currentPage: currentPage,
    total: +total,
  };
}
