const path = require('path');
const fs = require('fs');
const configHtmlHelper =  require('../dbhelper/configHtmlHelper');
const { success, falied } = require('./base');
const { setShortNum, checkFileExist, curlPostTar } = require('../utils/tools');
const { power } = require('../utils/const');
const { saveHtml } = require('../utils/html');

async function checkID(userInfo, id) {
  const res = await configHtmlHelper.getConfigHtmlItem(setShortNum(id, 24));
  if (!!(!!res && res._id)) {
    if(res.userInfo.id === userInfo.id || !!(userInfo.leve & power.admin)) {
      return true;
    }
  }
  return false;
}

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
    return falied(ctx, next, `id(${id})不能为空或者id不存在`);
  }
  const flat = await checkID(ctx.session, setShortNum(id, 24));
  if (flat) {
    const config = {
      isRelease: false,
      configList: JSON.parse(ctx.request.body.configList),
      configBase: JSON.parse(ctx.request.body.configBase),
    };
    const res = await configHtmlHelper.updateConfigHtmlItem(id, config);
    if (!!(!!res && res._id)) {
      // 生成页面
      saveHtml(res._id, config);
      return success(ctx, next, config);
    }
  }
  return falied(ctx, next, `id(${id})不能为空或者id不存在`);
}

exports.deleteConfigHtml = async (ctx, next) => {
  const { id = '0' } = ctx.request.body;
  if ( (id + '').trim().length !== 24 ) {
    return falied(ctx, next, `id(${id})不能为空或者id不存在`);
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
  let params = {};
  // 用户
  if (!(ctx.session.leve & power.admin)) {
    params.userId = ctx.session.id;
  }
  let res = await configHtmlHelper.listConfigHtml(+pageSize, +currentPage, params);
  if (!(ctx.session.leve & power.admin)) {
    res.list = res.list.map(item => {
      return {
        _id: item._id,
        meta: item.meta,
        title: item.title,
        isRelease: item.isRelease,
        isUpdate: item.isUpdate,
      }
    });
  }
  success(ctx, next, res);
}

exports.getConfigHtmlItem = async(ctx, next) => {
  const { id = '0' } = ctx.request.query;
  if ( (id + '').trim().length !== 24 ) {
    return falied(ctx, next, `id(${id})不能为空或者id不存在`);
  }
  const flat = await checkID(ctx.session, setShortNum(id, 24));
  if (flat) {
    const res = await configHtmlHelper.getConfigHtmlItem(setShortNum(id, 24));
    if (!!(!!res && res._id)) {
      return success(ctx, next, res);
    }
  }
  return falied(ctx, next, `id(${id})不能为空或者id不存在`);
}

exports.curlHtmlItem = async(ctx, next) => {
  const { id = '0' } = ctx.params;
  if ( (id + '').trim().length !== 24 ) {
    return falied(ctx, next, `id(${id})不能为空或者id不存在`);
  }
  const flat = await checkID(ctx.session, setShortNum(id, 24));
  if (flat) {
    let res = await configHtmlHelper.updateConfigHtmlItem2(id, {isRelease: true});
    if (!!(!!res && res._id)) {
      let res2 = await curlPostTar(id);
      try {
        res2 = JSON.parse(res2);
        if (res2.code == 200) {
          return success(ctx, next, res2.message);
        } else {
          return falied(ctx, next, res2.message);
        }
      } catch (error) {
        return falied(ctx, next, `出现未知问题`);
      }
    }

  }
  return falied(ctx, next, `id(${id})已经发布`);
}



exports.downloadData = async(ctx, next) => {
  const { id } = ctx.params;
  if(!!id) {
    const flat = await checkID(ctx.session, setShortNum(id, 24));
    if (flat) {
      const pathUrl = path.resolve(__dirname, `../../static/html/${id}/${id}.tar`);
      if (checkFileExist(pathUrl)) {
        ctx.set('Content-disposition','attachment;filename=' + id + '.tar'); // 是设置下载的文件名
        return ctx.body = fs.createReadStream(pathUrl);
      }
    }
  }
  return falied(ctx, next, '文件不存在 ^_^');
}
