const Router = require('koa-router');
const koaBody = require('koa-body');
const path = require('path');
const util = require('./utils/tools');
const { addConfigHtml, listConfigHtml, getConfigHtmlItem, deleteConfigHtml, updateConfigHtml, downloadData, curlHtmlItem } = require('./controller/configHtml');
const { statistics, statisticsjs, statisticsList } = require('./controller/statistics');
const { cityLocation, cityList, cityListFull, citySetList } = require('./controller/city');
const { addImg } = require('./controller/configFile');
const { return204, checkUserInfo } = require('./controller/base');
const { login, logout, loginHTML } = require('./controller/login');
const { createUser, updateUser, deleteUser, listUser } = require('./controller/user');



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
  router.get('/api2/active/list/curl/:id', curlHtmlItem);
  router.post('/api2/active/list/curl/:id', curlHtmlItem);
  router.get('/api2/active/download/:id', downloadData);


  // 统计
  router.get('/statistics/count.png', statistics);
  router.get('/statistics/:id/count.png', statistics);
  router.get('/statistics/s.js', statisticsjs);
  router.get('/statistics/:id/s.js', statisticsjs);
  router.get('/api2/statistics/list', statisticsList);

  // 城市
  router.get('/api2/city/location', cityLocation);
  router.get('/api2/city/list', cityList);
  router.get('/api2/city/listFull', cityListFull);

  // 设置城市
  router.get('/api2/city/setList', citySetList);

  // 登录
  router.get('/login', loginHTML);
  router.post('/api/login', login);
  router.get('/api2/logout', logout);

  // 用户信息
  router.post('/api2/user/create', createUser);
  router.post('/api2/user/update', updateUser);
  router.post('/api2/user/delete', deleteUser);
  router.get('/api2/user/list', checkUserInfo, listUser);
  router.get('/api2/user/create', createUser);
  router.get('/api2/user/update', updateUser);
  router.get('/api2/user/delete', deleteUser);

  router.get('/api2/user/delete',  async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.status = ERRORCODE.failed;
      ctx.body = {
        code: ERRORCODE.failed,
        message: error.message,
      };
    }
  });


  return router;
}
