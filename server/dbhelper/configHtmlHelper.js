var mongoose = require('mongoose');
const ConfigHtml = mongoose.model('ConfigHtml');
const ConfigItem = mongoose.model('ConfigItem');
const ConfigImg = mongoose.model('ConfigImg');
const ConfigForm = mongoose.model('ConfigForm');

/**
 * 保存配置信息
 * @param {保存配置信息} config
 */
exports.addConfigHtml = async (config) => {
	config = await config.save();
	return config;
}
/**
 * 保存配置信息
 * @param {保存配置信息} config list
 */
exports.addConfigItem = async (config) => {
	config = await config.save();
	return config;
}

/**
 * 保存配置信息
 * @param {保存配置信息} config img
 */
exports.addConfigImg = async (config) => {
	config = await config.save();
	return config;
}

/**
 * 保存配置信息
 * @param {保存配置信息} config form
 */
exports.addConfigForm = async (config) => {
	config = await config.save();
	return config;
}

/**
 * 查找配置列表信息
 */
exports.listConfigHtml = async(pageSize = 10, currentPage = 1, objectId = '000000000000000000000000') => {
  let query = ConfigHtml.find({});
  // 总数
  const total = await query.countDocuments();
  // 如果有id按id分类，不然传统分类
  if (parseInt(objectId, 16) > 0) {
    // 查找分页内容
    query = ConfigHtml.find({'_id': {'$gt': mongoose.Types.ObjectId(objectId)}}).limit(+pageSize);
  } else {
    query = ConfigHtml.find().skip((currentPage - 1) * pageSize).limit(+pageSize);
  }
  const list = await query.exec();
  return {
    list,
    pageSize: +pageSize,
    currentPage: currentPage > 0 ? +currentPage : 1,
    total: +total,
  };
}


/**
 * 查找单条记录
 */
exports.getConfigHtmlItem = async(objectId = '000000000000000000000000') => {
  let list = await ConfigHtml.find({'_id': mongoose.Types.ObjectId(objectId)}).exec();
  if (list.length < 1) {
    return null;
  }
  const configBase = {
    _id: list[0]._id,
    meta: list[0].meta,
    title: list[0].title,
    bgColor: list[0].bgColor,
  };
  let list2 = await ConfigItem.find({'id': mongoose.Types.ObjectId(configBase._id)}).sort({'_id': 1}).exec();
  let configList = [];
  for (let i = 0; i < list2.length; i++) {
    const element = {
      _id: list2[i]._id,
      key: list2[i].key,
      name: list2[i].name,
      count: list2[i].count,
    };
    if (element.key == 1) {
      let imgs = await ConfigImg.find({'id': mongoose.Types.ObjectId(element._id)}).sort({'_id': 1}).exec();
      const filelist = imgs.map(item => {
        return {
          width: item.width,
          url: item.url,
          height: item.height,
          uid: item.uid,
        }
      })
      element.config = {
        fileList: filelist
      };
    } else {
      const config = {};
      const checkList = [];
      let formItem = await ConfigForm.find({'id': mongoose.Types.ObjectId(element._id)}).sort({'_id': 1}).exec();
      for (let i = 0; i < formItem.length; i++) {
        const element2 = {
          bgColor: formItem[i].bgColor,
          color: formItem[i].color,
          errorTip: formItem[i].errorTip,
          tip: formItem[i].tip,
          type: formItem[i].type
        };
        config[element2.type] = element2;
        if (element2.type !== 'button') {
          checkList.push(element2.type);
        }
        delete element2.type;
      }
      config.checkList = checkList;
      element.config = config;
    }
    delete element._id;
    configList.push(element);
  }

  return {
    configBase,
    configList
  };
}

/**
 * 删除单条记录
 */
exports.deleteConfigHtmlItem = async(objectId = '000000000000000000000000') => {
  console.log('---------------------------------------------------------------------');
  console.log('start delete id=', objectId);
  let list = await ConfigHtml.find({'_id': mongoose.Types.ObjectId(objectId)}).exec();
  if (list.length < 1) {
    return null;
  }
  await ConfigHtml.remove({'_id': mongoose.Types.ObjectId(objectId)}).exec();
  const configBase = {
    _id: list[0]._id,
    meta: list[0].meta,
    title: list[0].title,
    bgColor: list[0].bgColor,
  };
  let list2 = await ConfigItem.find({'id': mongoose.Types.ObjectId(configBase._id)}).sort({'_id': 1}).exec();
  await ConfigItem.remove({'id': mongoose.Types.ObjectId(configBase._id)}).exec();
  let configList = [];
  for (let i = 0; i < list2.length; i++) {
    const element = {
      _id: list2[i]._id,
      key: list2[i].key,
      name: list2[i].name,
      count: list2[i].count,
    };
    if (element.key == 1) {
      let imgs = await ConfigImg.find({'id': mongoose.Types.ObjectId(element._id)}).sort({'_id': 1}).exec();
      await ConfigImg.remove({'id': mongoose.Types.ObjectId(element._id)}).exec();
      const filelist = imgs.map(item => {
        return {
          width: item.width,
          url: item.url,
          height: item.height,
          uid: item.uid,
        }
      })
      element.config = {
        fileList: filelist
      };
    } else {
      const config = {};
      const checkList = [];
      let formItem = await ConfigForm.find({'id': mongoose.Types.ObjectId(element._id)}).sort({'_id': 1}).exec();
      await ConfigForm.remove({'id': mongoose.Types.ObjectId(element._id)}).exec();
      for (let i = 0; i < formItem.length; i++) {
        const element2 = {
          bgColor: formItem[i].bgColor,
          color: formItem[i].color,
          errorTip: formItem[i].errorTip,
          tip: formItem[i].tip,
          type: formItem[i].type
        };
        config[element2.type] = element2;
        if (element2.type !== 'button') {
          checkList.push(element2.type);
        }
        delete element2.type;
      }
      config.checkList = checkList;
      element.config = config;
    }
    delete element._id;
    configList.push(element);
  }
  console.log('delete: id=', objectId, ' \n all=',JSON.stringify({
    configBase,
    configList
  }));
  console.log('---------------------------------------------------------------------');
  return {};
}
