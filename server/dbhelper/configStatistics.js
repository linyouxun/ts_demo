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

  // 现在默认10分钟选择
  const splitTime = 10 * 60 * 1000;
  // IOSTime比我们少8个小时
  const IOSTime = 8 * 60 * 60 * 1000;
  // 初始时间
  const startTime = new Date(0);

  const res = await Statistics.aggregate([
    {'$match': match}, // 匹配字段
    {
      '$project': {
        'timestamp': 1,
        'groupDate': {
          '$dateToString': {
            // 'format': "%Y-%m-%d %H:%M:%S:%L",
            'format': "%Y-%m-%d %H:%M:%S",
            'date': {
              "$add": [
                startTime,
                {'$subtract': [parseFloat('$timestamp'), {"$mod": [parseFloat('$timestamp'), splitTime]}]},
                IOSTime
              ]
            }
          }
        },
      }
    },
    {'$group': { // 分组字段
      _id: '$groupDate',
      groupDate: {'$first': '$groupDate'},
      sum: {'$sum': 1}
    }},
    {'$project': {
      _id: 0
    }}, // 隐藏字段
    {'$sort': {groupDate: 1}}, // 排序 1升 -1降
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
