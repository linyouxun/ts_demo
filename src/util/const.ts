export const IMGSERVER = 'http://localhost:3100';
// 初始化分页
export const PAGE = {
  defaultPageSize: 10,
  defaultCurrentPage: 1,
  defaultPageSizeOptions: ['10', '25', '50', '100'],
  limit: 10,
  offset: 0,
  total: 0,
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
    tip: '请输入电话号码',
    errorTip: '电话号码不能为空',
    color: 'rgba(0,0,0,1)',
    bgColor: 'rgba(255,255,255,1)',
  },
  name: {
    name: '姓名',
    tip: '请输入姓名',
    errorTip: '姓名不能为空',
    color: 'rgba(0,0,0,1)',
    bgColor: 'rgba(255,255,255,1)',
  },
  undefined1: {
    name: '自定义',
    tip: '自定义',
    errorTip: '自定义不能为空',
    color: 'rgba(0,0,0,1)',
    bgColor: 'rgba(255,255,255,1)',
  },
  undefined2: {
    name: '自定义2',
    tip: '自定义2',
    errorTip: '自定义2不能为空',
    color: 'rgba(0,0,0,1)',
    bgColor: 'rgba(255,255,255,1)',
  },
  undefined3: {
    name: '自定义3',
    tip: '自定义3',
    errorTip: '自定义3不能为空',
    color: 'rgba(0,0,0,1)',
    bgColor: 'rgba(255,255,255,1)',
  },
  undefined4: {
    name: '自定义4',
    tip: '自定义4',
    errorTip: '自定义4不能为空',
    color: 'rgba(0,0,0,1)',
    bgColor: 'rgba(255,255,255,1)',
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
