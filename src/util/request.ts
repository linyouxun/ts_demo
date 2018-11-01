import {objToUrlString} from './tools';
import { Modal, message } from 'antd';
export function fetchData(data: object, url: string, opts: RequestInit = {}) {
  // // 清除空参数
  // for (const key in data) {
  //   if (data.hasOwnProperty(key)) {
  //     const element = data[key];
  //     if (!element) {
  //       delete data[key];
  //     }
  //   }
  // }
  const params: RequestInit = Object.assign({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, opts)
  if (opts.method === 'GET') {
    url += ('?' + objToUrlString(data));
  } else {
    params.body = JSON.stringify(data);
  }
  params.credentials = 'include';
  try {
    return fetch(url , params).then(resp => {
      return resp.json()
    }).catch(error => {
      return {
        code: 500,
        stutasCode: 500,
        message: `JSON解析错误：${error.message}`,
        msg: `JSON解析错误：${error.message}`,
      };
    }).then(json => {
      if(json.stutasCode === 401) {
        Modal.error({
          title: '登陆已失效',
          okText: '返回登陆',
          onOk: () => {
            window.location.href = '/login';
          }
        });
      } else if (!!json.stutasCode && json.stutasCode !== 200) {
        message.error(json.result);
      }
      return Object.assign(json)
    }).catch(error => {
      console.log(error);
    });
  } catch (error) {
    console.log(error)
  }
  return {code: 401}
}
