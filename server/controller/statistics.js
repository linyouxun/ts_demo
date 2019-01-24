var parser = require('ua-parser-js');
const { fetchData } = require('../utils/request');
const { GAODE_KEY } = require('../utils/const');
const { strToObj, setShortNum, filterSpecialChar } = require('../utils/tools');
const { jsStatistics } = require('../utils/htmltool');
const { ihdr, idat } = require('../utils/png');
// const { encrypt, decrypt } = require('../utils/encrypt');
const { power } = require('../utils/const');

const { success, falied } = require('./base');
const { addConfigStatisticsItem, listStatisticsItem, userStatisticsItem, countStatisticsAggregate, countStatisticsAggregateTime } = require('../dbhelper/configStatistics');

const { getConfigHtmlItem } = require('../dbhelper/configHtmlHelper');

const moment = require('moment');


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
        const configHtmlInfo = await getConfigHtmlItem(setShortNum(id, 24), false);
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
    const currentHtml = ctx.query.url || ctx.req.headers['referer'];
    const configItem = {
      ip: ctx.ipv4,
      deviseStr: ctx.req.headers['user-agent'],
      currentHtml,
      currentHtmlParams: strToObj(!!currentHtml ? (!!currentHtml.split('?')[1] ? currentHtml.split('?')[1] : '') : '') || [],
      source: ctx.query.referrer,
      sourceParams: strToObj(!!ctx.query.referrer ? (!!ctx.query.referrer.split('?')[1] ? ctx.query.referrer.split('?')[1] : '') : '') || [],
      deviseInfo,
      cityInfo,
      configId: id || ctx.query.id,
      visitHtmlCount: ctx.query.vh || 1,
      visitCount: ctx.query.vc || 1,
      visitCountTotal: ctx.query.vt || 1,
      visitor: ctx.query.userId || '未知',
      isOlder: ctx.query.vt > 1 ? true: false,
      affiliation
    }
    console.log(configItem);
    await addConfigStatisticsItem(configItem);
  }, 0);
}

exports.statisticsjs = async function(ctx, next) {
  const { id } = ctx.params;
  // 设置cookie 现在统计的是单用户访问的所有页面都添加
  // let paths = ctx.path.split('/');
  // paths.pop();
  // const pathStr = paths.join('/');
  // if (!ctx.cookies.get('visitor')) {
  //   const day = new Date();
  //   day.setHours(23);
  //   day.setMinutes(59);
  //   day.setSeconds(59);
  //   day.setMilliseconds(999);
  //   day.setHours(day.getHours() + 8);
  //   ctx.cookies.set('visitor', encrypt(!!id ? id: 'none') + '_' + (+new Date()), {
  //       // domain: ctx.host, // 写cookie所在的域名
  //       // path: pathStr,       // 写cookie所在的路径
  //       // maxAge: 2*60*60*1000,   // cookie有效时长
  //       expires:new Date('2100-01-01'), // cookie失效时间
  //       httpOnly:false,  // 是否只用于http请求中获取
  //       // overwrite:false  // 是否允许重写
  //   });
  // }
  ctx.response.type = 'text/javascript';
  ctx.body = jsStatistics(id);
}

exports.statisticsList = async function(ctx, next) {
  // 筛选条件
  let { currentPage = 1, pageSize = 10 , extraData = '{}'} = ctx.query;
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
    return falied(ctx, next, {}, '额外参数出错了')
  }

  // 用户
  if (!(ctx.session.leve & power.admin)) {
    params.userId = ctx.session.id;
  }

  const res = await listStatisticsItem(+currentPage, +pageSize, params);
  success(ctx, next, res);
}
/**
 *
 */
exports.aggregateCount = async function(ctx, next) {
  // 筛选条件
  let { extraData = '{}'} = ctx.query;
  let params = {};
  try {
    params = JSON.parse(extraData);
  } catch (error) {
    return falied(ctx, next, {}, '额外参数出错了')
  }

  // 用户
  if (!(ctx.session.leve & power.admin)) {
    params.userId = ctx.session.id;
  }
  const res = await countStatisticsAggregate(params);
  success(ctx, next, res);
}

exports.aggregateCountTime = async function(ctx, next) {

  // 筛选条件
  let { extraData = '{}'} = ctx.query;
  let params = {};
  try {
    params = JSON.parse(extraData);
  } catch (error) {
    return falied(ctx, next, {}, '额外参数出错了')
  }
  // 处理时间
  if(!params.time || params.time.length !== 2) {
    params.time = [+moment({hour:0,minute:0,second:0,millisecond: 0}), +moment({hour:23,minute:59,second:59,millisecond: 0})]
  }
  if (moment(+params.time[0]).format('YYYY-MM-DD') !== moment(+params.time[1]).format('YYYY-MM-DD')) {
    return falied(ctx, next, {}, '时间暂不支持跨天查询');
  }


  // 用户
  if (!(ctx.session.leve & power.admin)) {
    params.userId = ctx.session.id;
  }
  const res = await countStatisticsAggregateTime(params);
  const result = {
    total: res.total,
    list: [],
    totalSum: res.totalSum,
  }
  // 处理时间
  const splitTime = 10 * 60 * 1000;
  for (let i = params.time[0], j = 0; i < params.time[1]; i+=splitTime) {
    const timeStamp = i - (i % splitTime);
    const time = moment(timeStamp).format('YYYY-MM-DD HH:mm:ss');
    let value = 0;
    if (j < res.list.length && res.list[j]._id == time) {
      value = res.list[j].value;
      j++;
    }
    result.list.push({
      time,
      value,
    })
  }
  result.total = result.list.length;
  success(ctx, next, result);
}

