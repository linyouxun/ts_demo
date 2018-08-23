const fetch = require('node-fetch')
function objToUrlString(data) {
  let paramsArr = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key];
      paramsArr.push(`${key}=${element}`);
    }
  }
  return paramsArr.join('&');
}


exports.fetchData = function(data, url, opts) {
  // 清除空参数
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key];
      if (!element) {
        delete data[key];
      }
    }
  }
  const params = Object.assign(opts,{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  if (opts.method === 'GET') {
    url += ('?' + objToUrlString(data));
  } else {
    params.body = objToUrlString(data);
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
    return json;
  });
}
