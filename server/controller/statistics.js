var parser = require('ua-parser-js');
const { fetchData } = require('../utils/request');
const { GAODE_KEY } = require('../utils/const');
const { strToObj, setShortNum, filterSpecialChar } = require('../utils/tools');
const { jsStatistics } = require('../utils/htmltool');
const { ihdr, idat } = require('../utils/png');
const { success, falied } = require('./base');
const { addConfigStatisticsItem, listStatisticsItem } = require('../dbhelper/configStatistics');
const { getConfigHtmlItem } = require('../dbhelper/configHtmlHelper');


exports.statistics = async function(ctx, next) {
  // const r = await fetchData({key: 'f1f341fd8aa165eda6c0f29db0f5ef5d', ip: '113.65.13.91'}, 'https://restapi.amap.com/v3/ip', {
  //   method: 'GET'
  // });
  const { id } = ctx.params;
  ctx.response.type = 'png';
  ctx.body = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    ihdr(1, 1),
    idat(1, 1),
    Buffer.from('IEND'),
  ]);

  // 先返回在延迟处理
  setTimeout(async () => {
    let affiliation = {};
    if(!!id) {
      // 查找页面所属用户
      try {
        const configHtmlInfo = await getConfigHtmlItem(setShortNum(id, 24));
        if(!!configHtmlInfo) {
          affiliation = configHtmlInfo.userInfo;
        }
      } catch (error) {
        console.log('no find user');
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
      cityInfo,
      configId: id,
      visitCount: +ctx.cookies.get(`visitcount${!!id ? '-' + id: ''}`) || 1,
      visitCountTotal: +ctx.cookies.get('visitcount') || 1,
      visitor: +ctx.cookies.get('visitor') || '未知',
      affiliation
    }
    await addConfigStatisticsItem(configItem);
  }, 0);
}

exports.statisticsjs = async function(ctx, next) {
  const { id } = ctx.params;
  // 设置cookie 现在统计的是单用户访问的所有页面都添加
  if (!!ctx.cookies.get('visitor')) {
    let count = +ctx.cookies.get('visitcount') || 0;
    ctx.cookies.set('visitcount', count + 1);
    count = +ctx.cookies.get(`visitcount-${!!id ? id: ''}`) || 0;
    ctx.cookies.set(`visitcount-${!!id ? id: ''}`, count + 1);
  } else {
    ctx.cookies.set('visitor', +new Date() + '');
    ctx.cookies.set('visitcount', 1);
    ctx.cookies.set(`visitcount-${!!id ? id: ''}`, 1);
  }
  ctx.response.type = 'text/javascript';
  ctx.body = jsStatistics(id);
}

exports.statisticsList = async function(ctx, next) {
  // 筛选条件
  let { currentPage = 1, pageSize = 10 , extraData = {}} = ctx.query;
  currentPage = Math.floor(currentPage);
  if (+currentPage < 1) {
    currentPage = 1;
  }
  let params = {};
  try {
    params = JSON.parse(extraData);
    if(!!params.id) {
      params.id = filterSpecialChar(params.id);
    }
    if(!!params.html) {
      params.html = filterSpecialChar(params.html);
    }
  } catch (error) {
    return falied(ctx, next, '额外参数出错了')
  }

  // 用户
  if (ctx.session.leve > 0) {
    params.userId = ctx.session.id;
  }

  const res = await listStatisticsItem(+currentPage, +pageSize, params);
  success(ctx, next, res);
}
