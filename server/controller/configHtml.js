const path = require('path');
const fs = require('fs');
const configHtmlHelper =  require('../dbhelper/configHtmlHelper');
const { success, falied } = require('./base');
const { setShortNum, checkFileExist } = require('../utils/tools');
const { saveHtml } = require('../utils/html');



exports.addConfigHtml = async (ctx, next) => {
  const userInfo = {
    name: ctx.session.name,
    leve: ctx.session.leve,
    id: ctx.session.id,
  };
  const res = await configHtmlHelper.addConfigHtmlItem({
    userInfo: userInfo,
    configList: JSON.parse(ctx.request.body.configList),
    configBase: JSON.parse(ctx.request.body.configBase),
  });
  // 生成页面
  saveHtml(res._id, res);
  success(ctx, next, res);
}

exports.updateConfigHtml = async (ctx, next) => {
  const { id = '0' } = ctx.request.body;
  if ( (id + '').trim().length !== 24 ) {
    falied(ctx, next, `id(${id})不能为空或者id不存在`);
  }
  const userInfo = ctx.session;
  const config = {
    userInfo: userInfo,
    configList: JSON.parse(ctx.request.body.configList),
    configBase: JSON.parse(ctx.request.body.configBase),
  };
  const res = await configHtmlHelper.updateConfigHtmlItem(id, config);
  if (!!(!!res && res._id)) {
    // 生成页面
    saveHtml(res._id, config);
    success(ctx, next, config);
  } else {
    falied(ctx, next, `id(${id})不能为空或者id不存在`);
  }
}

exports.deleteConfigHtml = async (ctx, next) => {
  const { id = '0' } = ctx.request.body;
  if ( (id + '').trim().length !== 24 ) {
    falied(ctx, next, `id(${id})不能为空或者id不存在`);
  }
  const res = await configHtmlHelper.deleteConfigHtmlItem(setShortNum(id, 24));
  if (!!(!!res && res.ok)) {
    success(ctx, next, `id(${id})的数据删除成功`);
  } else {
    falied(ctx, next, `id(${id})不能为空或者id不存在`);
  }
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
    falied(ctx, next, `id(${id})不能为空或者id不存在`);
  }
  const res = await configHtmlHelper.getConfigHtmlItem(setShortNum(id, 24));
  if (!!(!!res && res._id)) {
    success(ctx, next, res);
  } else {
    falied(ctx, next, `id(${id})不能为空或者id不存在`);
  }
}

exports.downloadData = async(ctx, next) => {
  const { id } = ctx.params;
  if(!!ctx.params.id) {
    const pathUrl = path.resolve(__dirname, `../../static/html/${id}/${id}.tar`);
    if (checkFileExist(pathUrl)) {
      ctx.set('Content-disposition','attachment;filename=' + id + '.tar'); // 是设置下载的文件名
      ctx.body = fs.createReadStream(pathUrl);
    } else {
      falied(ctx, next, '文件不存在 ^_^');
    }
  }
}
