import * as React from "react";
import CommonStatisticsList from '../statistics/CommonStatisticsList';
import Index from './Index';
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
  breadcrumbName:'智慧营销',
  component: Index,
  isNotMenu: true,
  path: '/marketing',
  sideIcon: 'anticon anticon-picture',
}, {
  breadcrumbName:'数据预览',
  component:CommonStatisticsList,
  path:'/marketing/preview',
  userLeve: power.general + power.admin,
}, {
  breadcrumbName:'客户数据管理',
  component: CommonStatisticsList,
  path:'/marketing/administration',
  children: [{
    breadcrumbName:'概览',
    children: [{
      breadcrumbName:'实时客流分析',
      component: CommonStatisticsList,
      path:'/add',
    }],
    component: Index,
    path:'/index',
  }],
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
