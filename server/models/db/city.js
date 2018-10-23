// 当前页面：
// 来源： source
// ip:
// 时间:
// 设备型号:（操作系统， 屏幕分辨率，浏览器）
// 地区：
// 访客标识码
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CitySchema = new Schema({
  parentId: String,
  citycode: String,
  adcode: String,
  name: String,
  center: String,
  level: String,
});
var City = mongoose.model('City', CitySchema);
module.exports = {
  City,
};
