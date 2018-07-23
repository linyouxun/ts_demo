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

export default {
  objToUrlString,
  urlStringToObj,
}
