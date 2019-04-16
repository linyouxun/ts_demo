const path = require('path');
const fs = require('fs');
const {htmlhead, htmlImgList, htmlForm, htmlBtn, htmlModel, htmlFooter, jsLoction, jsFormPost, jsExtra, htmlSwiperImgList} = require('../utils/htmltool');
const { ActiveComponentType } = require('../utils/const');
const util = require('../utils/tools');

function renderHtml(htmlData, id) {
  const { configBase, configList } = htmlData;
  let strHtml = htmlhead(configBase.title, configBase.bgColor, configBase.modelColor, configList);
  for(const item of configList) {
    strHtml += renderSection(item);
  }
  strHtml += htmlModel(configBase.modelTip, configBase.modelSubTip) + htmlFooter(id, configList);
  return strHtml;
}

function renderSection(configObj) {
  switch (configObj.key) {
    case ActiveComponentType.pic.key:{
      return htmlImgList(configObj.config);
    }
    case ActiveComponentType.form.key:{
      return htmlForm(configObj.config, configObj.count);
    }
    case ActiveComponentType.swiper.key:{
      return htmlSwiperImgList(configObj.config, configObj.count);
    }
    case ActiveComponentType.btn.key:{
      return htmlBtn(configObj.config, configObj.count);
    }
    default:
      break;
  }
  return '';
}
function renderJs(htmlData) {
  return jsLoction(htmlData) + jsFormPost(htmlData) + jsExtra(htmlData);
}

function saveHtml(id, htmlData) {
  const htmlRootPath =  path.resolve(__dirname, '../../static/html/', id+'');
  const htmlJsPath =  path.resolve(htmlRootPath, 'js');
  const htmlCssPath =  path.resolve(htmlRootPath, 'css');
  const htmlImgPath =  path.resolve(htmlRootPath, 'img');
  // 判断创建目录
  util.checkDirExist(htmlRootPath);
  util.checkDirExist(htmlJsPath);
  util.checkDirExist(htmlCssPath);
  util.checkDirExist(htmlImgPath);
  fs.writeFileSync(htmlRootPath + '/index.html', renderHtml(htmlData, id));
  fs.writeFileSync(htmlJsPath + '/index.js', renderJs(htmlData));
  fs.writeFileSync(htmlJsPath + '/layer.js', fs.readFileSync(path.resolve(__dirname, './html.layer.js')));
  fs.writeFileSync(htmlJsPath + '/jquery.min.js', fs.readFileSync(path.resolve(__dirname, './html.jquery.min.js')));
  fs.writeFileSync(htmlJsPath + '/swiper.min.js', fs.readFileSync(path.resolve(__dirname, './html.swiper.min.js')));
  fs.writeFileSync(htmlCssPath + '/layer.css', fs.readFileSync(path.resolve(__dirname, './html.layer.css')));
  fs.writeFileSync(htmlCssPath + '/swiper.min.css', fs.readFileSync(path.resolve(__dirname, './html.swiper.min.css')));
  // 拷贝文件
  for (const iterator of htmlData.configList) {
    if (iterator.key === ActiveComponentType.pic.key || iterator.key === ActiveComponentType.form.key || iterator.key === ActiveComponentType.swiper.key || iterator.key === ActiveComponentType.btn.key) {
      for (const iterator2 of iterator.config.fileList) {
        const src = path.resolve(__dirname, '../../static/images/', './' + iterator2.url.split('images').pop());
        const descSrc = path.resolve(htmlImgPath , './' + iterator2.url.split('/').pop());
        util.copyFile(src, descSrc);
      }
    }
  }
  util.tarDir(id);
  return {
    code: 200,
    result: {
      id,
    },
    message: '保存成功'
  }
}

module.exports = {
  renderHtml,
  saveHtml,
}
