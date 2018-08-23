const { fetchData } = require('../utils/request');
const { GAODE_KEY } = require('../utils/const');
const { ihdr, idat } = require('../utils/png');
const { addConfigStatisticsItem } = require('../dbhelper/configStatistics');

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
  const city = {
    province: '',
    city: '',
    adcode: ''
  }
  if (res.status == 1) {
    if(!!res.adcode.toString()) {
      city.province = res.province;
      city.city = res.city;
      city.adcode = res.adcode;
    }
  }
  const configItem = {
    ip: ctx.ipv4,
    deviseStr: ctx.req.headers['user-agent'],
    currentHtml: ctx.req.headers['referer'],
    source: ctx.query.referrer,
    deviseInfo: {
      platform: ctx.query.platform,
      screen: ctx.query.screen,
      browser: ctx.query.browser,
    },
    city
  }
  console.log(configItem);
  await addConfigStatisticsItem(configItem);
}
