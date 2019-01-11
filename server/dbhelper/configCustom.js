var mongoose = require('mongoose');
const Custom = mongoose.model('Custom');

/**
 * 保存配置信息
 * @param {保存配置信息} config
 */
exports.addConfigCustomItem = async (config) => {
  config = await Custom(config).save();
	return config;
}

/**
 * 更新配置信息
 * @param {保存配置信息} config
 */
exports.updateConfigCustomItem = async (objectId, config) => {
  const res2 = await Custom.update({'_id': mongoose.Types.ObjectId(objectId)}, config).exec();
  if (res2.ok > 0) {
    return res2;
  }
  return {};
}

exports.findConfigCustomItem = async (findParams) => {
  const res = await Custom.findOne(findParams).exec();
  if(!res) {
    return {};
  }
  return res;
}


/**
 * 列表信息
 * @param {保存配置信息} params
 */
exports.listCustomItem = async (currentPage, pageSize, params) => {
  let findParams = {};
  if(!!params.userId) {
    findParams['affiliation.id'] =  params.userId;
  }
  if(!!params.phone) {
    findParams['mobile'] =  RegExp(params.phone);
  }
  if(!!params.id) {
    findParams['affiliation.pageId'] = RegExp(params.id);
  }
  if(!!params.time && params.time.length > 0) {
    findParams['signTime'] = {
      '$gte': params.time[0]+'',
      '$lte': params.time[1]+''
    };
  }
  const total = await Custom.find(findParams).countDocuments();
  let list = await Custom.find(findParams).sort({'signTime': -1}).skip((currentPage - 1) * pageSize).limit(+pageSize).exec();
  list = list.map(item => {
    return {
      isRepeatSign:item.isRepeatSign,
      userId:item.userId,
      mobile:item.mobile,
      createtime:item.createtime,
      source:item.source,
      signTime:item.signTime,
      name:item.name,
      age:item.age,
      version:item.version,
      cityInfo:item.cityInfo,
      extraInfo:item.extraInfo,
      birthDate:item.birthDate,
      signHistory:item.signHistory,
      affiliation:item.affiliation
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
 * 报名数据时间
 * @param { timestamp时间，configId配置ID }
 */
exports.countCustomAggregateTime = async (params) => {
  const match = {};
  if(!!params.time && params.time.length > 0) {
    match['signTime'] = {
      '$gte': params.time[0],
      '$lte': params.time[1]
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

  const res = await Custom.aggregate([
    {'$match': match}, // 匹配字段
    {
      '$project': {
        'signTime': 1,
        'groupDate': {
          '$dateToString': {
            // 'format': "%Y-%m-%d %H:%M:%S:%L",
            'format': "%Y-%m-%d %H:%M:%S",
            'date': {
              "$add": [
                startTime,
                {'$subtract': ['$signTime', {"$mod": ['$signTime', splitTime]}]},
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
