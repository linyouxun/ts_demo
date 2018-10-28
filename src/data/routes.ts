import * as React from "react";
import Home from '../Home';
import CommonStatisticsList from '../statistics/CommonStatisticsList';
import NotFound from '../NotFound';

// 用户信息
import userInfo from '../util/power';
import { power } from '../util/const';


interface Iprop {
  breadcrumbName?: string,
  component: typeof React.Component,
  exact?: boolean, // 默认是true
  path: string,
  sideIcon?: string,
  children?: Iprop[],
  isNotMenu?: boolean, // 默认是菜单里面
  isFull?: boolean, // 默认是不全屏 是否全屏
  userLeve?: number,
}

export const routes = [{
  breadcrumbName:'智慧巡店',
  component: Home,
  isNotMenu: true,
  path: '/',
  sideIcon: 'anticon anticon-picture',
}, {
  breadcrumbName:'门店流量',
  children: [{
    breadcrumbName:'实时客流分析',
    children: [{
      breadcrumbName:'实时客流分析',
      component: CommonStatisticsList,
      path:'/add',
      sideIcon: 'anticon anticon-file-word',
    }],
    component: CommonStatisticsList,
    path:'/list',
    sideIcon: 'anticon anticon-file-word',
  }, {
    breadcrumbName:'实时客流分析',
    component: CommonStatisticsList,
    path:'/list2',
    children: [],
    sideIcon: 'anticon anticon-file-word',
  }, {
    breadcrumbName:'客流分析',
    component: CommonStatisticsList,
    path:'/list3',
    children: [],
    sideIcon: 'anticon anticon-file-word',
  }, {
    breadcrumbName:'探针客流分析',
    component: CommonStatisticsList,
    path:'/list4',
    children: [],
    sideIcon: 'anticon anticon-file-word',
  }, {
    breadcrumbName:'客流热图',
    component: CommonStatisticsList,
    path:'/list5',
    children: [],
    sideIcon: 'anticon anticon-file-word',
  }, {
    breadcrumbName:'客流动线图',
    component: CommonStatisticsList,
    path:'/list6',
    children: [],
    sideIcon: 'anticon anticon-file-word',
  }, {
    breadcrumbName:'客户画像',
    component: CommonStatisticsList,
    path:'/list7',
    children: [],
    sideIcon: 'anticon anticon-file-word',
  }],
  component:CommonStatisticsList,
  path:'/active',
  userLeve: power.general,
  sideIcon: 'anticon anticon-file-word',
}, {
  breadcrumbName:'人群资产预览',
  component:CommonStatisticsList,
  path:'/active2',
  userLeve: power.general,
  sideIcon: 'anticon anticon-file-word',
}, {
  breadcrumbName:'会员系统',
  component:CommonStatisticsList,
  path:'/active3',
  userLeve: power.general,
  sideIcon: 'anticon anticon-file-word',
}, {
  breadcrumbName:'设计方案',
  component:CommonStatisticsList,
  path:'/active4',
  userLeve: power.general,
  sideIcon: 'anticon anticon-file-word',
}, {
  breadcrumbName:'客户资料库',
  component:CommonStatisticsList,
  path:'/active5',
  userLeve: power.general,
  sideIcon: 'anticon anticon-file-word',
}, {
  component:NotFound,
  isFull: true,
  isNotMenu: true,
  path:'*',
}];

export const routesList: Iprop[] = [];
export const routesObject: any = {};
for (const iterator of routes) {
  if(iterator.userLeve !== undefined && !(iterator.userLeve & userInfo.userLeve)) {
    continue;
  }
  if(!!iterator.children && iterator.children.length > 0) {
    for (const iterator2 of iterator.children) {
      iterator2.path = iterator.path + iterator2.path;
      for (const iterator3 of iterator2.children) {
        iterator3.path = iterator2.path + iterator3.path;
        routesList.push({
          exact: true,
          ...iterator3
        });
        routesObject[iterator3.path] = iterator3.breadcrumbName;
      }
      const i2 = {...iterator2};
      delete i2.children;
      routesList.push({
        exact: true,
        ...i2
      });
      routesObject[i2.path] = i2.breadcrumbName;
    }
  }
  const i = {...iterator};
  delete i.children;
  routesList.push({
    exact: true,
    ...i
  });
  routesObject[i.path] = i.breadcrumbName;
}
export const routes2 = routes.filter(item => {
  if(item.userLeve !== undefined && item.userLeve < userInfo.userLeve) {
    return false;
  }
  return true;
})
export default {
  routes,
  routes2,
  routesList,
  routesObject
};
