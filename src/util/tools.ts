/**
 *  @description 将对象转换为URL字符串,方便发送或存储
 *  @param o 将要转为URL参数字符串的对象
 *  @return string URL参数字符串
 */
export function objToUrlString(o: object) {
  if (o === null) {
    return ''
  };
  const paramsList = []
  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      const element = o[key];
      const type = typeof element;
      if(type === 'string' || type === 'number' || type === 'boolean') {
        paramsList.push(key + '=' +  encodeURIComponent(element));
      } else {
        paramsList.push(key + '=' +  encodeURIComponent(JSON.stringify(element)));
      }
    }
  }
  return paramsList.join('&');
}
/**
 * @description url字符串转换成对象
 * @param [s]
 * @returns {{}}
 */
export function urlStringToObj(s: string) {
  if (s === null || s.trim() === '') {
    return {};
  };
  const params = {};
  const q = s ? s : window.location.search.substring(1);
  const e = q.split('&');
  const l = e.length;
  let f;
  let i = 0;
  for (i; i < l; i += 1) {
    f = e[i].split('=');
    try {
      params[f[0]] = JSON.parse(decodeURIComponent(f[1]));
    } catch (error) {
      params[f[0]] = decodeURIComponent(f[1]);
    }
  }
  return params;
}

/**
 * @description 过滤对象键值
 * @param [s]
 * @returns {{}}
 */
export function deleteInstanceKeys(instance: any, keys: string[]) {
  switch (typeof instance) {
    case 'string':
      try {
        instance = JSON.parse(instance);
      } catch (error) {
        instance = {};
      }
      break;
    case 'object':
      break
    default:
      instance = {};
      break;
  }
  for (const iterator of keys) {
    delete instance[iterator];
  }
  return instance;
}

export function setShortNum(num: string, minLen: number) {
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

export function setCookie(name: any, value: any, exdays: any) {
  if (value) {
      if ((/^\d+(\.\d+)?$/).test(exdays)) {
          const Days = !!exdays ? exdays : 30;
          const exp = new Date();
          exp.setTime(exp.getTime() + Days * 60 * 60 * 1000);
          document.cookie = name + "=" + escape(value) + ";expires=" + exp.toUTCString() + ";path=/";
      } else {
          document.cookie = name + "=" + escape(value) + ";expires=Session;path=/";
      }
  }
}

export function getCookie(name: any) {
  const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  const arr = document.cookie.match(reg);
  if (!!arr) {
      return decodeURIComponent(arr[2]);
  } else {
      return null;
  }
}

export default {
  objToUrlString,
  urlStringToObj,
  setShortNum,
  setCookie,
  getCookie,
}
