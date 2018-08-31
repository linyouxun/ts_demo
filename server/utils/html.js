const path = require('path');
const fs = require('fs');
const {htmlhead, htmlImgList, htmlForm, htmlModel, htmlFooter, jsLoction, jsFormPost, jsExtra, jsLayerRender, cssLayerRender} = require('../utils/htmltool');
const { ActiveComponentType } = require('../utils/const');
const util = require('../utils/tools');


function renderHtml(htmlData) {
  const { configBase, configList } = htmlData;
  let strHtml = htmlhead(configBase.title, configBase.bgColor, configBase.modelColor);
  for(const item of configList) {
    strHtml += renderSection(item, configBase);
  }
  strHtml += htmlModel() + htmlFooter();
  return strHtml;
}

function renderSection(configObj, configBase) {
  switch (configObj.key) {
    case ActiveComponentType.pic.key:{
      return htmlImgList(configObj.config);
    }
    case ActiveComponentType.form.key:{
      return htmlForm(configObj.config, configObj.count, configBase);
    }
    default:
      break;
  }
  return '';
}
function renderJs(htmlData) {
  return jsLoction() + jsFormPost(htmlData) + jsExtra(htmlData);
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
  fs.writeFileSync(htmlRootPath + '/index.html', renderHtml(htmlData));
  fs.writeFileSync(htmlJsPath + '/index.js', renderJs(htmlData));
  fs.writeFileSync(htmlJsPath + '/layer.js', jsLayerRender());
  fs.writeFileSync(htmlCssPath + '/layer.css', cssLayerRender());
  // 拷贝文件
  for (const iterator of htmlData.configList) {
    if (iterator.key === ActiveComponentType.pic.key) {
      for (const iterator2 of iterator.config.fileList) {
        const src = path.resolve(__dirname, '../../static/images/', './' + iterator2.url.split('images').pop());
        const descSrc = path.resolve(htmlImgPath , './' + iterator2.url.split('/').pop());
        util.copyFile(src, descSrc);
      }
    }
  }
  console.log(htmlRootPath);
  util.tarDir(id, htmlRootPath);

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
