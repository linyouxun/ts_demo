'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ConfigHtmlSchema = new Schema({
  userInfo: {
    name: String,
    id: String,
    leve: String,
  },
  metaInfo: {
    createtime: {
      type: Number,
      dafault: +Date.now()
    },
    updatetime: {
      type: Number,
      dafault: +Date.now()
    }
  },
  configBase: {
    bgColor: String,
    title: String,
    modelColor: String,
  },
  configList:[{
    config: {
      fileList: [{
        uid: String,
        width: Number,
        height: Number,
        url: String,
      }],
      formWidth: [Number],
      formRadius: Number,
      formTop: Number,
      checkList: [String],
      mobile: {
        bgColor: String,
        color: String,
        tip: String,
        errorTip: String
      },
      name: {
        bgColor: String,
        color: String,
        tip: String,
        errorTip: String
      },
      undefined1: {
        bgColor: String,
        color: String,
        tip: String,
        errorTip: String
      },
      undefined2: {
        bgColor: String,
        color: String,
        tip: String,
        errorTip: String
      },
      undefined3: {
        bgColor: String,
        color: String,
        tip: String,
        errorTip: String
      },
      undefined4: {
        bgColor: String,
        color: String,
        tip: String,
        errorTip: String
      },
      button: {
        bgColor: String,
        color: String,
        tip: String,
        errorTip: String
      }
    },
    count: String,
    key: String,
    name: String
  }]
})


ConfigHtmlSchema.pre('save', function(next) {
  if (this.isNew) {
    this.metaInfo.createtime = this.metaInfo.updatetime = +Date.now()
  }
  next()
})

var ConfigHtml = mongoose.model('ConfigHtml', ConfigHtmlSchema);
module.exports = {
  ConfigHtml,
};
