var mongoose = require('mongoose');
const Statistics = mongoose.model('Statistics');

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
    findParams['_id'] = mongoose.Types.ObjectId(params.id);
  }
  if(!!params.time && params.time.length > 0) {
    findParams['timestamp'] = {
      '$gte': params.time[0]+'',
      '$lte': params.time[1]+''
    };
  }
  const total = await Statistics.find(findParams).countDocuments();
  const list = await Statistics.find(findParams).sort({'_id': -1}).skip((currentPage - 1) * pageSize).limit(+pageSize).exec();
  return {
    list,
    pageSize: +pageSize,
    currentPage: currentPage,
    total: +total,
  };
}
