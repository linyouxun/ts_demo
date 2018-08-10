export const IMGSERVER = 'http://localhost:3100';
// 初始化分页
export const PAGE = {
  defaultPageSize: 10,
  defaultPageSizeOptions: ['10', '25', '50', '100'],
  limit: 10,
  offset: 0,
}

// 装修类型
export const DECORATIONSTYLE = {
  chinese: {
    id: '2',
    name: '中式',
  },
  european: {
    id: '3',
    name: '欧式',
  },
  modern: {
    id: '1',
    name: '现代',
  },
  northernEuropean: {
    id: '4',
    name: '北欧',
  },
  simple: {
    id: '0',
    name: '简约',
  },
}

// 上传图片类型
export enum FILETYPE {
  done = 'done',
  removed = 'removed',
  uploading = 'uploading',
  error = 'error',
}

// 箭头参数
export enum ARROW {
  UP = -1,
  DELETE = 0,
  DOWM = 1,
}

// 活动报名配置选项
export const ActiveComponentType = {
  pic: {
    key: '1',
    name: '图片'
  },
  form: {
    key: '2',
    name: '报名框'
  },
}
// 活动报名表单配置选项
export const ActiveFormItem = {
  moblie: {
    name: '电话号码',
    value: '请输入电话号码'
  },
  name: {
    name: '姓名',
    value: '请输入姓名'
  },
  undefined1: {
    name: '自定义',
    value: '自定义'
  },
  undefined2: {
    name: '自定义2',
    value: '自定义2'
  },
  undefined3: {
    name: '自定义3',
    value: '自定义3'
  },
  undefined4: {
    name: '自定义4',
    value: '自定义4'
  },
}



export default {
  DECORATIONSTYLE,
  IMGSERVER,
  PAGE,
  FILETYPE,
  ARROW,
  ActiveComponentType,
  ActiveFormItem,
}
