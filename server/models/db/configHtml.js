'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ConfigHtmlSchema = new Schema({
  bgColor: String,
  title: String,
  meta: {
    createAt: {
      type: Number,
      dafault: +Date.now()
    },
    updateAt: {
      type: Number,
      dafault: +Date.now()
    }
  }
})

var ConfigImgSchema = new Schema({
  id: String,
  url: String,
  uid: String,
  width: String,
  height: String,
})

var ConfigFormSchema = new Schema({
  id: String,
  bgColor: String,
  color: String,
  errorTip: String,
  tip: String,
  type: String,
})

var ConfigItemSchema = new Schema({
  id: String,
  count: String,
  key: String,
  name: String,
})


// Defines a pre hook for the document.
ConfigHtmlSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = +Date.now()
  }
  else {
    this.meta.updateAt = +Date.now()
  }
  next()
})

// var ConfigHtml = mongoose.model('ConfigHtml', ConfigHtmlSchema, 'ConfigHtml');
var ConfigHtml = mongoose.model('ConfigHtml', ConfigHtmlSchema);
var ConfigItem = mongoose.model('ConfigItem', ConfigItemSchema);
var ConfigImg = mongoose.model('ConfigImg', ConfigImgSchema);
var ConfigForm = mongoose.model('ConfigForm', ConfigFormSchema);

module.exports = {
  ConfigHtml,
  ConfigItem,
  ConfigImg,
  ConfigForm,
};
