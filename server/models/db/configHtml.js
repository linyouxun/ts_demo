'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ConfigHtmlSchema = new Schema({
  configBase: {
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
  },
  configList:[{
    config: {
      fileList: [{
        uid: String,
        width: Number,
        height: Number,
        url: String,
      }],
      checkList: [String],
      moblie: {
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
    this.configBase.meta.createAt = this.configBase.meta.updateAt = +Date.now()
  }
  else {
    this.configBase.meta.updateAt = +Date.now()
  }
  next()
})

var ConfigHtml = mongoose.model('ConfigHtml', ConfigHtmlSchema);
module.exports = {
  ConfigHtml,
};
