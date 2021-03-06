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

function setShortNum(num, minLen) {
	let str = '';
	const munLen = num.length;
	if ( munLen>= minLen) {
		return num;
	}
	for(let i = 0; i < minLen; i++) {
		str += '0';
	}
	return str.substr(0, minLen - munLen) + num;
}

function copyObj(obj) {
  let newObj = {};
  for (const key in obj) {
    if (object.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

module.exports = {
  getUploadFileExt,
  checkDirExist,
  checkFileExist,
  getUploadDirName,
  setShortNum
};
