var mongoose = require('mongoose');
const Statistics = mongoose.model('Statistics');
// const Custom = mongoose.model('Custom');

/**
 * 保存配置信息
 * @param {保存配置信息} config
 */
exports.addConfigStatisticsItem = async (config) => {
  config = await Statistics(config).save();
	return config;
}


/**
 * 列表信息
 * @param {保存配置信息} params
 */
exports.listStatisticsItem = async (currentPage, pageSize, params) => {

  let findParams = {};
  if(!!params.userId) {
    findParams['affiliation.id'] =  params.userId;
  }
  if(!!params.channel_city && params.channel_city.length > 0) {
    findParams['channel_city'] =  params.channel_city;
  }
  if(!!params.city && params.city.length > 0) {
    findParams['cityInfo.city'] =  params.city;
  }
  if(!!params.html) {
    findParams['currentHtml'] =  RegExp(params.html);
  }
  if(!!params.id) {
    // findParams['_id'] = mongoose.Types.ObjectId(params.id);
    findParams['configId'] = RegExp(params.id);
  }
  if(!!params.time && params.time.length > 0) {
    findParams['timestamp'] = {
      '$gte': params.time[0]+'',
      '$lte': params.time[1]+''
    };
  }
  const total = await Statistics.find(findParams).countDocuments();
  let list = await Statistics.find(findParams).sort({'_id': -1}).skip((currentPage - 1) * pageSize).limit(+pageSize).exec();
  list = list.map(item => {
    return {
      affiliation:item.affiliation,
      cityInfo:item.cityInfo,
      configId:item.configId,
      deviseInfo:item.deviseInfo,
      currentHtml:item.currentHtml,
      ip:item.ip,
      source:item.source,
      timestamp:item.timestamp,
      visitHtmlCount:item.visitHtmlCount,
      visitCount:item.visitCount,
      visitCountTotal:item.visitCountTotal,
      isOlder:item.isOlder,
      visitor:item.visitor,
    };
  })
  return {
    list,
    pageSize: +pageSize,
    currentPage: currentPage,
    total: +total,
  };
}
/**
 * @param {timestamp时间，configId配置ID }
 */
exports.countStatisticsAggregate = async (params) => {
  const match = {};
  if(!!params.time && params.time.length > 0) {
    match['timestamp'] = {
      '$gte': params.time[0]+'',
      '$lte': params.time[1]+''
    };
  }
  if(!!params.configIds && params.configIds.length > 0) {
    match['configId'] = {
      '$in': params.configIds,
    };
  }
  if(!!params.userId) {
    match['affiliation.id'] =  params.userId;
  }
  // if(!!params.configId) {
  //   match['configId'] = RegExp(params.configId);
  // }
  const res = await Statistics.aggregate([
    {'$match': match}, // 匹配字段
    {'$group': { // 分组字段
      _id: '$cityInfo.province',
      province: {'$first': '$cityInfo.province'},
      adcode: {'$first': '$cityInfo.adcode'},
      sum: {'$sum': 1}
    }},
    {'$project': {
      _id: 0
    }}, // 隐藏字段
    {'$sort': {sum: -1}}, // 排序 1升 -1降
  ]);
  const total = res.length;
  let totalSum = 0;
  if (res.length > 0) {
    totalSum = res.reduce((a, b) => {
      return {
        sum: a.sum + b.sum
      }
    }).sum;
  }
  return {
    list: res,
    total,
    totalSum
  };
}

/**
 * @param { timestamp时间，configId配置ID }
 */
exports.countStatisticsAggregateTime = async (params) => {
  const match = {};
  if(!!params.time && params.time.length > 0) {
    match['timestamp'] = {
      '$gte': params.time[0] + '',
      '$lte': params.time[1] + ''
    };
  }
  if(!!params.configIds && params.configIds.length > 0) {
    match['configId'] = {
      '$in': params.configIds,
    };
  }
  if(!!params.userId) {
    match['affiliation.id'] =  params.userId;
  }


  const res = await Statistics.mapReduce({
    query: match,
    map: function() {
      // 现在默认10分钟选择
      const splitTime = 10 * 60 * 1000;
      // // 时差8小时
      // const subTime = 8 * 60 * 60 * 1000;
      // 发送数据
      const timeStamp = this.timestamp - (+this.timestamp % splitTime);
      const day = new Date(timeStamp);
      const year = day.getFullYear();
      const month = '00'.substr((day.getMonth() + 1 +'').length, 2) + (day.getMonth() + 1);
      const date = '00'.substr((day.getDate()+'').length, 2) + day.getDate();
      const hour = '00'.substr((day.getHours()+'').length, 2) + day.getHours();
      const minutes = '00'.substr((day.getMinutes()+'').length, 2) + day.getMinutes();
      const seconds = '00'.substr((day.getSeconds()+'').length, 2) + day.getSeconds();
      const time = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds;
      emit(time, 1);
    },
    reduce: function(key, value) {
      return value.reduce((i, i2) => {
        return i + i2
      });
    }
  })
  const { results } = res;
  const total = results.length;
  let totalSum = 0;
  if (results.length > 0) {
    totalSum = results.reduce((a, b) => {
      return {
        value: a.value + b.value
      }
    }).value;
  }
  return {
    list: res.results,
    total,
    totalSum
  };
}
