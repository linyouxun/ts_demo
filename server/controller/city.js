const path = require('path');
const fs = require('fs');
const { success, falied } = require('./base');
const { addConfigCityItem } = require('../dbhelper/configCity');
const { GAODE_KEY } = require('../utils/const');
const { fetchData } = require('../utils/request');


exports.cityLocation = async function(ctx, next) {
  const res = await fetchData({key: GAODE_KEY, ip: ctx.ipv4 }, 'https://restapi.amap.com/v3/ip', {
    method: 'GET'
  });
  if (res.status == 1) {
    if(!!res.adcode.toString()) {
      return success(ctx, next, {
        province: res.province,
        city: res.city,
        adcode: res.adcode,
        rectangle: res.rectangle
      });
    }
  }
  falied(ctx, next, '定位失败');
}
exports.cityList = async function(ctx, next) {
  const filePath = path.resolve(__dirname, '../utils/city_2.json');
  const res = fs.readFileSync(filePath, 'utf8');
  try {
    success(ctx, next, JSON.parse(res));
  } catch (error) {
    falied(ctx, next, 'json 格式转化错误');
  }
}
exports.cityListFull = async function(ctx, next) {
  const filePath = path.resolve(__dirname, '../utils/city.json');
  const res = fs.readFileSync(filePath, 'utf8');
  try {
    success(ctx, next, JSON.parse(res));
  } catch (error) {
    falied(ctx, next, 'json 格式转化错误');
  }
}

exports.citySetList = function(ctx, next) {
  // const r = await fetchData({keywords: '中国', key: GAODE_KEY, subdistrict: 4, extensions: 'base'}, 'https://restapi.amap.com/v3/config/district', {
  //   method: 'GET'
  // });
  const filePath = path.resolve(__dirname, '../utils/city.json');
  const res = fs.readFileSync(filePath, 'utf8');
  try {
    const list = JSON.parse(res);
    setCity(list, '10000', 0);
  } catch (error) {
  }
  success(ctx, next, 'ok');
}
function setCity(list, parentId, index) {
  list.map(item => {
    if(item.districts.length > 0) {
      setCity(item.districts, item.adcode, index + 2);
    }
    return addConfigCityItem(Object.assign(item, {
      parentId
    }));
  })
}



