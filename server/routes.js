const Router = require('koa-router');
const koaBody = require('koa-body');
const path = require('path');
const util = require('./utils/tools');
const { addConfigHtml, listConfigHtml, getConfigHtmlItem } = require('./controller/configHtml');
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
  router.get('/api2/active/list', listConfigHtml);
  router.get('/api2/active/list/item', getConfigHtmlItem);
  return router;
}
