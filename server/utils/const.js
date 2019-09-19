// 权限
// 1最高权限
// 2普通用户
// 4查看用户
const power = {
  admin: Math.pow(2, 0),
  general: Math.pow(2, 1),
  abserver: Math.pow(2, 2),
}

// 活动报名配置选项
const ActiveComponentType = {
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
  btn: {
    key: '4',
    name: '按钮'
  },
}

const ERRORCODE = {
  success: 200,
  noChangeEmpty: 204,
  failed: 500,
  nologin: 401,
  noAPI: 418,
  noHTML: 419,
  noAllow: 420
}

module.exports = {
  ActiveComponentType,
  ERRORCODE,
  power
}
