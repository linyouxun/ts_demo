var mongoose = require('mongoose');
const Statistics = mongoose.model('Statistics');
const Custom = mongoose.model('Custom');

/**
 * 保存配置信息
 * @param {保存配置信息} config
 */
exports.addConfigStatisticsItem = async (config) => {
  config = await Statistics(config).save();
	return config;
}


/**
 * 列表信息
 * @param {保存配置信息} params
 */
exports.listStatisticsItem = async (currentPage, pageSize, params) => {

  let findParams = {};
  if(!!params.userId) {
    findParams['affiliation.id'] =  params.userId;
  }
  if(!!params.channel_city && params.channel_city.length > 0) {
    findParams['channel_city'] =  params.channel_city;
  }
  if(!!params.city && params.city.length > 0) {
    findParams['cityInfo.city'] =  params.city;
  }
  if(!!params.html) {
    findParams['currentHtml'] =  RegExp(params.html);
  }
  if(!!params.id) {
    // findParams['_id'] = mongoose.Types.ObjectId(params.id);
    findParams['configId'] = RegExp(params.id);
  }
  if(!!params.time && params.time.length > 0) {
    findParams['timestamp'] = {
      '$gte': params.time[0]+'',
      '$lte': params.time[1]+''
    };
  }
  const total = await Statistics.find(findParams).countDocuments();
  let list = await Statistics.find(findParams).sort({'_id': -1}).skip((currentPage - 1) * pageSize).limit(+pageSize).exec();
  list = list.map(item => {
    return {
      affiliation:item.affiliation,
      cityInfo:item.cityInfo,
      configId:item.configId,
      deviseInfo:item.deviseInfo,
      currentHtml:item.currentHtml,
      ip:item.ip,
      source:item.source,
      timestamp:item.timestamp,
      visitHtmlCount:item.visitHtmlCount,
      visitCount:item.visitCount,
      visitCountTotal:item.visitCountTotal,
      isOlder:item.isOlder,
      visitor:item.visitor,
    };
  })
  return {
    list,
    pageSize: +pageSize,
    currentPage: currentPage,
    total: +total,
  };
}
