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
  let query = Statistics.find({});
  const total = await query.countDocuments();
  query = Statistics.find({}).sort({'_id': -1}).skip((currentPage - 1) * pageSize).limit(+pageSize);
  const list = await query.exec();
  return {
    list,
    pageSize: +pageSize,
    currentPage: currentPage,
    total: +total,
  };
}
