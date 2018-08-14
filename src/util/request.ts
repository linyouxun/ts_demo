const preUrl = '/api/';
import {objToUrlString} from './tools';
export function fetchData(data: object, url: string, opts: RequestInit = {}) {
  // 清除空参数
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key];
      if (!element) {
        delete data[key];
      }
    }
  }
  const params: RequestInit = Object.assign(opts,{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  if (opts.method === 'POST') {
    params.body = objToUrlString(data);
  } else {
    url += ('?' + objToUrlString(data))
  }
  if (!(new RegExp('http')).test(url)) {
    url = preUrl + url;
    params.credentials = 'include';
  }
  return fetch(url , params).then(resp => {
    return resp.json()
  }).catch(error => {
    return {
      code: 500,
      message: `JSON解析错误：${error.message}`,
      msg: `JSON解析错误：${error.message}`,
    };
  }).then(json => {
    return Object.assign(json, {
      message: json.message || json.msg || '请求错误',
      msg: json.message || json.msg || '请求错误',
    })
  });
}
