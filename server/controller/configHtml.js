const mongoose = require('mongoose');
const {saveHtml} = require('../models/html');
const ConfigHtml = mongoose.model('ConfigHtml');
const ConfigItem = mongoose.model('ConfigItem');
const ConfigImg = mongoose.model('ConfigImg');
const ConfigForm = mongoose.model('ConfigForm');
const configHtmlHelper =  require('../dbhelper/configHtmlHelper');
const { success, falied } = require('./base');
const { setShortNum } = require('../utils/tools');
exports.addConfigHtml = async (ctx, next) => {
  // saveHtml(ctx.request.body);
  // 保存数据
  const configHtml = new ConfigHtml(JSON.parse(ctx.request.body.configBase));
  // 保存头信息
  const res = await configHtmlHelper.addConfigHtml(configHtml);
  const configList = JSON.parse(ctx.request.body.configList);
  for (let i = 0; i < configList.length; i++) {
    const element = configList[i];
    const configItem = new ConfigItem(Object.assign(element, {id: res['_id']}));
    const res2 = await configHtmlHelper.addConfigHtml(configItem);
    if (res2.key == 1) {
      if (!!element.config && !!element.config.fileList) {
        const fileList = element.config.fileList || [];
        for (let j = 0; j < fileList.length; j++) {
          const element2 = fileList[j];
          const configImg = new ConfigImg(Object.assign(element2, {id: res2['_id']}));
          await configHtmlHelper.addConfigImg(configImg);
        }
      }
    } else {
      if (!!element.config) {
        const config = element.config || {};
        for (const key in config) {
          if (config.hasOwnProperty(key) && key !== 'checkList') {
            const configForm = new ConfigForm(Object.assign(config[key], {id: res2['_id'], type: key}));
            await configHtmlHelper.addConfigForm(configForm);
          }
        }
      }
    }
  }
  success(ctx, next, res);
}

exports.listConfigHtml = async(ctx, next) => {
  const { pageSize = 10, currentPage = 1, id = '0' } = ctx.request.query;
  if (+pageSize < 0) {
    pageSize = 10;
  }
  if (+currentPage < 0) {
    pageSize = 1;
  }
  const res = await configHtmlHelper.listConfigHtml(+pageSize, +currentPage, setShortNum(id, 24));
  success(ctx, next, res);
}

exports.getConfigHtmlItem = async(ctx, next) => {
  const { id = '0' } = ctx.request.query;
  if ( (id + '').trim().length !== 24 ) {
    falied(ctx, next, 'id不能为空或者id不存在');
  }
  const res = await configHtmlHelper.getConfigHtmlItem(setShortNum(id, 24));
  if (!!res) {
    success(ctx, next, res);
  } else {
    falied(ctx, next, 'id不能为空或者id不存在');
  }
}
