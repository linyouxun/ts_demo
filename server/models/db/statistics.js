// 当前页面：
// ip:
// 时间:
// 地区：
// 来源： source (图片上传))
// 设备型号:（操作系统， 屏幕分辨率，浏览器）(图片上传)
// 访客标识码
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StatisticsSchema = new Schema({
  currentHtml: String,
  currentHtmlParams: [{
    key: String,
    value: String,
  }],
  source: String,
  sourceParams: [{
    key: String,
    value: String,
  }],
  ip: String,
  timestamp: String,
  deviseStr: String,
  deviseInfo: {
    platform: String,
    screen: String,
    browser: String
  },
  cityInfo: {
    province: String,
    city: String,
    adcode: String,
  },
  // 拓展属性
  configId: String,
  visitCount: Number,
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
