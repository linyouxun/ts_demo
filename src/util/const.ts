export const IMGSERVER = 'http://localhost:4000';
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

export default {
  DECORATIONSTYLE,
  IMGSERVER,
  PAGE,
}
