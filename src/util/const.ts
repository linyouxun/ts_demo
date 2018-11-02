
export const IMGSERVER = (function s() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3100';
  }
  return 'http://47.106.174.88';
})();
export const APISERVER = (function s() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3100';
  }
  return 'http://47.106.174.88';
})();
// 小程序图片前缀
export const miniImgPath = 'http://xcx.yoju360.com';

// 阅面常量
// 位置
export const ymPosition = {
  corridor: {
    key: 'corridor',
    name: '过道',
    id: '1'
  },
  entrance: {
    key: 'entrance',
    name: '入口',
    id: '2'
  },
  checkout_desk: {
    key: 'checkout_desk',
    name: '收银台',
    id: '3'
  }
}
// 状态
export const ymStatus = {
  'true': {
    name: '在线',
    status: true,
    id: '1'
  },
  'false': {
    name: '未知',
    status: false,
    id: '2'
  }
}
// 阅面登录token
export const ymToken = '887e7f12f869ed11e0f98c0b19c13d4445efbc70';
// export const ymToken = '42f4c8d0aa4b3aefd5a875da24904d931b6b1d6c';



// 初始化分页
export const PAGE = {
  defaultPageSize: 10,
  defaultCurrentPage: 1,
  defaultPageSizeOptions: ['10', '25', '50'],
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
  HIDE = 2,
  SHOW = 3,
}

export const gender = {
  '0': '女',
  '1': '男',
  '2': '未知'
};


export const marksWidth = {
  0: '0',
  10: '10vw',
  90: '90vw',
  100: '100vw',
};
export const marksRadius = {
  0: '0',
  5: '5px',
  10: '10px',
  15: '15px',
  20: '20px',
  25: '25px',
};

export const marksTop = {
  0: '0',
  10: '10vw',
  20: '20vw',
  30: '30vw',
  40: '40vw',
  50: '50vw',
  60: '60vw',
  70: '70vw',
  80: '80vw',
  90: '90vw',
  100: '100vw'
};

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
  swiper: {
    key: '3',
    name: '轮播图'
  },
}
// 活动报名表单配置选项
export const ActiveFormItem = {
  mobile: {
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
  // undefined1: {
  //   name: '自定义',
  //   tip: '自定义',
  //   errorTip: '自定义不能为空',
  //   color: 'rgba(0,0,0,1)',
  //   bgColor: 'rgba(255,255,255,1)',
  // },
  // undefined2: {
  //   name: '自定义2',
  //   tip: '自定义2',
  //   errorTip: '自定义2不能为空',
  //   color: 'rgba(0,0,0,1)',
  //   bgColor: 'rgba(255,255,255,1)',
  // },
  // undefined3: {
  //   name: '自定义3',
  //   tip: '自定义3',
  //   errorTip: '自定义3不能为空',
  //   color: 'rgba(0,0,0,1)',
  //   bgColor: 'rgba(255,255,255,1)',
  // },
  // undefined4: {
  //   name: '自定义4',
  //   tip: '自定义4',
  //   errorTip: '自定义4不能为空',
  //   color: 'rgba(0,0,0,1)',
  //   bgColor: 'rgba(255,255,255,1)',
  // },
}

// 权限
// 1最高权限
// 2普通用户
// 4查看用户
export const power = {
  admin: Math.pow(2, 0),
  general: Math.pow(2, 1),
  abserver: Math.pow(2, 2),
}



export default {
  DECORATIONSTYLE,
  IMGSERVER,
  PAGE,
  FILETYPE,
  ARROW,
  ActiveComponentType,
  ActiveFormItem,
  miniImgPath,
  power
}
