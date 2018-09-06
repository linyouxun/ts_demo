const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserInfoSchema = new Schema({
  parentId: String,
  metaInfo: {
    createtime: Number,
    updatetime: Number,
  },
  name: String,
  age: Number,
  mobile: String,
  birthDate: Number,
  pwd: String,
  leve: Number
});

UserInfoSchema.pre('save', function(next) {
  if (this.isNew) {
    this.metaInfo.createtime = this.metaInfo.updatetime = +Date.now();
  }
  next();
})

var UserInfo = mongoose.model('UserInfo', UserInfoSchema);
module.exports = {
  UserInfo,
};
