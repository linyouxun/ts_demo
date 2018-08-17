const path = require('path');
const fs = require('fs');
const {htmlhead, htmlImgList, htmlForm, htmlModel, htmlFooter, jsLoction, jsFormPost, jsExtra, jsLayerRender, cssLayerRender} = require('../utils/htmltool');
const { ActiveComponentType } = require('../utils/const');
const util = require('../utils/tools');


function renderHtml(htmlData) {
  let configBase = {};
  let configList = [];
  try {
    configBase = JSON.parse(htmlData.configBase);
    configList = JSON.parse(htmlData.configList);
  } catch (error) {
    return {
      code: 400,
      message: ''
    }
  }
  let strHtml = htmlhead(configBase.title, configBase.bgColor);
  for(const item of configList) {
    strHtml += renderSection(item);
  }
  strHtml += htmlModel() + htmlFooter();
  return strHtml;
}

function renderSection(configObj) {
  switch (configObj.key) {
    case ActiveComponentType.pic.key:{
      return htmlImgList(configObj.config);
    }
    case ActiveComponentType.form.key:{
      return htmlForm(configObj.config);
    }
    default:
      break;
  }
  return '';
}
function renderJs() {
  return jsLoction() + jsFormPost() + jsExtra();
}

function renderSection(configObj) {
  switch (configObj.key) {
    case ActiveComponentType.pic.key:{
      return htmlImgList(configObj.config);
    }
    case ActiveComponentType.form.key:{
      return htmlForm(configObj.config);
    }
    default:
      break;
  }
  return '';
}

function saveHtml(id, htmlData) {
  const htmlRootPath =  path.resolve(__dirname, '../../static/html/', id+'');
  const htmlJsPath =  path.resolve(htmlRootPath, 'js');
  const htmlCssPath =  path.resolve(htmlRootPath, 'css');
  // 判断创建目录
  util.checkDirExist(htmlRootPath);
  util.checkDirExist(htmlJsPath);
  util.checkDirExist(htmlCssPath);
  fs.writeFileSync(htmlRootPath + '/index.html', renderHtml(htmlData));
  fs.writeFileSync(htmlJsPath + '/index.js', renderJs());
  fs.writeFileSync(htmlJsPath + '/layer.js', jsLayerRender());
  fs.writeFileSync(htmlCssPath + '/layer.css', cssLayerRender());

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
