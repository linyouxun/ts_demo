var parser = require('ua-parser-js');
const { fetchData } = require('../utils/request');
const { GAODE_KEY } = require('../utils/const');
const { strToObj } = require('../utils/tools');
const { ihdr, idat } = require('../utils/png');
const { success, falied } = require('./base');
const { addConfigStatisticsItem, listStatisticsItem } = require('../dbhelper/configStatistics');

exports.statistics = async function(ctx, next) {
  // const r = await fetchData({key: 'f1f341fd8aa165eda6c0f29db0f5ef5d', ip: '113.65.13.91'}, 'https://restapi.amap.com/v3/ip', {
  //   method: 'GET'
  // });

  ctx.response.type = 'png';
  ctx.body = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    ihdr(1, 1),
    idat(1, 1),
    Buffer.from('IEND'),
  ]);


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
  const ua = parser(ctx.req.headers['user-agent']);
  const deviseInfo = {
    screen: ctx.query.screen || '未知',
    platform: '未知',
    browser: '未知',
  }
  if (ua.browser.name) {
    deviseInfo['platform'] = ua.os.name + ' ' + ua.os.version;
    deviseInfo['browser'] = ua.browser.name + ' ' + ua.browser.version;
  }
  const configItem = {
    ip: ctx.ipv4,
    deviseStr: ctx.req.headers['user-agent'],
    currentHtml: ctx.req.headers['referer'],
    currentHtmlParams: strToObj(!!ctx.req.headers['referer'] ? (!!ctx.req.headers['referer'].split('?')[1] ? ctx.req.headers['referer'].split('?')[1] : '') : '') || [],
    source: ctx.query.referrer,
    sourceParams: strToObj(!!ctx.query.referrer ? (!!ctx.query.referrer.split('?')[1] ? ctx.query.referrer.split('?')[1] : '') : '') || [],
    deviseInfo,
    cityInfo
  }

  await addConfigStatisticsItem(configItem);
}

exports.statisticsList = async function(ctx, next) {
  // 筛选条件
  let { currentPage = 1, pageSize = 10 , extraData = {}} = ctx.query;
  currentPage = Math.floor(currentPage);
  if (+currentPage < 1) {
    currentPage = 1;
  }
  const params = {};
  try {
    params = JSON.parse(extraData);
  } catch (error) {
    return falied(ctx, next, '额外参数出错了')
  }
  console.log(params);
  const res = await listStatisticsItem(+currentPage, +pageSize, params);
  success(ctx, next, res);
}
