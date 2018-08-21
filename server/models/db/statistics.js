// 当前页面：
// 来源： source
// ip:
// 时间:
// 设备型号:（操作系统， 屏幕分辨率，浏览器）
// 地区：
// 访客标识码
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StatisticsSchema = new Schema({
  currentHtml: String,
  source: String,
  ip: String,
  timestamp: String,
  deviseStr: String,
  deviseInfo: {
    os: String,
    screen: String,
    browser: String
  },
  erea: {
    province: String,
    city: String,
    provinceId: String,
    cityId: String,
  },
  // 拓展属性
  // userId: String,(通过cookie, 浏览器, 设备)
})

StatisticsSchema.pre('save', function(next) {
  if (this.isNew) {
    this.timestamp = Date.now()
  }
  next()
})

var Statistics = mongoose.model('Statistics', StatisticsSchema);
module.exports = {
  Statistics,
};
