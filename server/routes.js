const Router = require('koa-router');
const koaBody = require('koa-body');
const path = require('path');
const util = require('./utils/tools');
const { addConfigHtml, listConfigHtml, getConfigHtmlItem, deleteConfigHtml, updateConfigHtml } = require('./controller/configHtml');
const { statistics } = require('./controller/statistics');
const { cityLocation, cityList, cityListFull, citySetList } = require('./controller/city');
const { addImg } = require('./controller/configFile');
const { return204 } = require('./controller/base');



module.exports = function() {
	// var router = new Router({
  //   prefix: '/api'
  // })

  const router = new Router();

  //文件上传服务
  router.options('/upload', return204);
  router.post('/upload',koaBody({
    multipart:true,
    encoding:'gzip',
    formidable:{
      uploadDir:path.join(__dirname,'../static/images/tmp'),
      keepExtensions: true,
      maxFieldsSize:2 * 1024 * 1024,
      onFileBegin:(name,file) => {
        const relativeDir = `/images/${util.getUploadDirName()}`;
        const dir = path.join(__dirname,`../static${relativeDir}`);
        util.checkDirExist(dir);
        file.path = `${dir}/${+new Date()}_${file.name}`;
        file.imgPath = `${relativeDir}/${+new Date()}_${file.name}`;
      },
      onError:(err)=>{
        console.log(err);
      }
    }
  }), addImg);

  // 处理网页配置信息
  router.post('/api2/active/list/add', addConfigHtml);
  router.post('/api2/active/list/delete', deleteConfigHtml);
  router.post('/api2/active/list/update', updateConfigHtml);
  router.get('/api2/active/list', listConfigHtml);
  router.get('/api2/active/list/item', getConfigHtmlItem);
  // 统计
  router.get('/statistics/count.png', statistics);
  // 城市
  router.get('/city/location', cityLocation);
  router.get('/city/list', cityList);
  router.get('/city/listFull', cityListFull);

  // 设置城市
  // router.get('/city/setList', citySetList);
  return router;
}
