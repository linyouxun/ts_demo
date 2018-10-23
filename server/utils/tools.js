const fs = require('fs');
const path = require('path');
var exec = require('child_process').exec;

// 解析url后缀参数
function strToObj(str) {
  if (str.trim() === '') return;
  str = decodeURIComponent(str);
  return str.split('&').map(item => {
    var a = item.split('=');
    return {
      key: a[0],
      value: a[1],
    }
  })
}
// 过滤js中的特殊字符
function filterSpecialChar(s) {
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
  var rs = "";
  for (var i = 0; i < s.length; i++) {
  var c = s.substr(i, 1);
    rs = rs + c.replace(pattern, '\\'+c);
  }
  return rs;
}

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

function copyFile(src, descSrc) {
  if (checkFileExist(src)) {
    fs.writeFileSync(descSrc, fs.readFileSync(src));
  }
}

function tarDir(id) {
  var cmdStr = `cd ./static/html/${id} && tar cvf ${id}.tar * --exclude=${id}.tar`;
  exec(cmdStr, function(err, out){
    if(err) {
      console.log('failed' + err);
    } else {
      console.log('success');
    }
  });
}

async function curlPostTar(id) {
  var cmdStr = `cd ./static/html/${id} && curl -F "tar=@${id}.tar"  http://m.youju360.com/upload/staticTar`;
  return new Promise(function(resolve, reject) {
    exec(cmdStr, function(err, stdout){
      if(err) {
        resolve(stdout);
      } else {
        resolve(stdout);
      }
    })
  });
}

// 发布
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

function isCurrentDay(d, d2) {
  var d = new Date();
  d.setSeconds(0);
  d.setMilliseconds(0)
  d.setMinutes(0)
  d.setHours(0);
  var d2 = new Date();
  d2.setSeconds(0);
  d2.setMilliseconds(0)
  d2.setMinutes(0)
  d2.setHours(0);
  return +d === +d2
}

module.exports = {
  getUploadFileExt,
  checkDirExist,
  checkFileExist,
  getUploadDirName,
  setShortNum,
  strToObj,
  copyObj,
  filterSpecialChar,
  copyFile,
  tarDir,
  curlPostTar,
  isCurrentDay
};
