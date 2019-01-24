const { fetchData } = require('../utils/request');
const { GAODE_KEY } = require('../utils/const');
const { setShortNum, isCurrentDay, filterSpecialChar } = require('../utils/tools');
const { updateConfigCustomItem, addConfigCustomItem, findConfigCustomItem, listCustomItem, customAggregateCount } = require('../dbhelper/configCustom');
const { getConfigHtmlItem } = require('../dbhelper/configHtmlHelper');
const { power } = require('../utils/const');
const { success } = require('./base');


// 统计报名信息列表
exports.customList = async function(ctx, next) {
  // 筛选条件
  let { currentPage = 1, pageSize = 10 , extraData = '{}'} = ctx.query;
  currentPage = Math.floor(currentPage);
  if (+currentPage < 1) {
    currentPage = 1;
  }
  let params = {};
  try {
    params = JSON.parse(extraData);
    if(!!params.signTime) {
      params.signTime = filterSpecialChar(params.signTime);
    }
    if(!!params.configId) {
      params.configId = filterSpecialChar(params.configId);
    }
  } catch (error) {
    return falied(ctx, next, '额外参数出错了')
  }
  // 用户
  if (!(ctx.session.leve & power.admin)) {
    params.userId = ctx.session.id;
  }

  const res = await listCustomItem(+currentPage, +pageSize, params);
  success(ctx, next, res);
}

// 统计报名信息添加
exports.customAdd = async function(ctx, next) {

  const { id } = ctx.params;
  success(ctx, next, {});
  // 先返回在延迟处理
  setTimeout(async () => {
    let affiliation = {};
    const formData = ctx.request.body || {};
    let signHistory = [];
    let createtime = +new Date();
    let signTime = +new Date();
    let isRepeatSign = false;
    let itemId = null;
    if(!!id) {
      // 查找页面所属用户
      try {
        const configHtmlInfo = await getConfigHtmlItem(setShortNum(id, 24), false);
        if(!!configHtmlInfo) {
          affiliation = {
            name: configHtmlInfo.userInfo.name,
            id: configHtmlInfo.userInfo.id,
            leve: configHtmlInfo.userInfo.leve,
            pageId: configHtmlInfo._id + '',
            pageTitle: configHtmlInfo.configBase.title + ''
          };
        }
      } catch (error) {
        console.log('no find user');
      }
    }

    if (!!formData.mobile) {
      let findParams = {
        mobile: formData.mobile + ''
      }
      if (!!affiliation.pageId) {
        findParams['affiliation.pageId'] = affiliation.pageId;
      }
      const record = await findConfigCustomItem(findParams);
      if (!!record._id) {
        let newItems = {
          ip: record.ip,
          source: record.source,
          userId: record.userId,
          version: record.version,
          signTime: record.signTime,
          name: record.name,
          age: record.age,
          mobile: record.mobile,
          birthDate: record.birthDate,
          extraInfo: record.extraInfo,
          isRepeatSign: record.isRepeatSign,
        }
        itemId = record._id;
        createtime = record.createtime;
        isRepeatSign = isCurrentDay(signTime, record.signTime);
        signHistory = [newItems, ...record.signHistory];
      }
    }
    // 设置城市信息
    const res = await fetchData({key: GAODE_KEY, ip: ctx.ipv4 }, 'https://restapi.amap.com/v3/ip', {
      method: 'GET'
    });
    const cityInfo = {
      province: '',
      city: '',
      adcode: ''
    }
    if (res.status == 1) {
      if(!!res.adcode.toString()) {
        cityInfo.province = res.province;
        cityInfo.city = res.city;
        cityInfo.adcode = res.adcode;
      }
    }
    const configItem = {
      ip: ctx.ipv4,
      source: formData.url,
      cityInfo,
      configId: id || formData.id,
      userId: formData.userId || '--',
      version: formData.version || '--',
      createtime: createtime,
      signTime: signTime,
      name: formData.name || '--',
      age: formData.age || 0,
      mobile: formData.mobile || '--',
      birthDate: formData.birthDate || 0,
      extraInfo: formData.extraInfo || '--',
      isRepeatSign, // 当天是否重复报名，以手机号为准
      affiliation,
      signHistory
    }
    if (!!itemId) {
      await updateConfigCustomItem(itemId,configItem);
    } else {
      await addConfigCustomItem(configItem);
    }
  }, 0);
}

// 统计报名信息
exports.customCount = async function(ctx, next) {
  // 筛选条件
  let { extraData = '{}'} = ctx.query;
  let params = {};
  try {
    params = JSON.parse(extraData);
    if(!!params.id) {
      params.id = filterSpecialChar(params.id);
    }
    if(!!params.phone) {
      params.phone = filterSpecialChar(params.phone);
    }
  } catch (error) {
    return falied(ctx, next, '额外参数出错了')
  }
  // 用户
  if (!(ctx.session.leve & power.admin)) {
    params.userId = ctx.session.id;
  }

  const res = await customAggregateCount( params );
  success(ctx, next, res);
}


