var mongoose = require('mongoose');
const City = mongoose.model('City');

/**
 * 保存配置信息
 * @param {保存配置信息} config
 */
exports.addConfigCityItem = async (config) => {
  config = await City(config).save();
	return config;
}
