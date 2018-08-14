const fs = require('fs');

// 获取上传文件后缀
function getUploadFileExt(name) {
  const ext = name.split('.');
  return ext[ext.length - 1];
}

//生成日期
function getUploadDirName(){
  const date = new Date();
  let month = Number.parseInt(date.getMonth()) + 1;
  month = month.toString().length > 1 ? month : `0${month}`;
  const dir = `${date.getFullYear()}${month}${date.getDate()}`;
  return dir;
}

// 判断文件夹是否存在 如果不存在则创建文件夹
function checkDirExist(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

// 判断文件是否存在
function checkFileExist(p) {
  return fs.existsSync(p);
}

module.exports = {
  getUploadFileExt,
  checkDirExist,
  checkFileExist,
  getUploadDirName,
};
