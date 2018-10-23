const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * 通过source ip可以查找更详细的报名信息来源
 */
const CustomSchema = new Schema({
  source: String,
  ip: String,
  userId: String,
  version: String,
  createtime: Number,
  signTime: Number,
  name: String,
  age: Number,
  sex: String,
  mobile: String,
  birthDate: Number,
  extraInfo: String,
  isRepeatSign: Boolean, // 当天是否重复报名，以手机号为准
  cityInfo: {
    province: String,
    city: String,
    adcode: String,
  },
  affiliation: {
    name: String,
    id: String,
    leve: String,
    pageId: String,
    pageTitle: String,
  }, // 页面的属性
  signHistory: [{
    source: String,
    ip: String,
    userId: String,
    version: String,
    signTime: Number,
    sex: String,
    name: String,
    age: Number,
    mobile: String,
    birthDate: Number,
    extraInfo: String,
    cityInfo: {
      province: String,
      city: String,
      adcode: String,
    },
    affiliation: {
      name: String,
      id: String,
      leve: String,
    } // 页面的属性
  }]
});

var Custom = mongoose.model('Custom', CustomSchema);
module.exports = {
  Custom,
};
