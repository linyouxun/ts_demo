import * as React from "react";
import CommonStatisticsList from './statistics/CommonStatisticsList';
import Index from './data/Index';
import NotFound from './NotFound';

// 用户信息
import userInfo from './util/power';
import { power } from './util/const';



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
  breadcrumbName:'概览',
  component: Index,
  isNotMenu: true,
  path: '/',
  sideIcon: 'anticon anticon-picture',
}, {
  breadcrumbName:'Face ID数据',
  children: [{
    breadcrumbName:'概览',
    children: [{
      breadcrumbName:'实时客流分析',
      component: CommonStatisticsList,
      path:'/add',
      sideIcon: 'anticon anticon-file-word',
    }],
    component: Index,
    path:'/index',
    sideIcon: 'anticon anticon-file-word',
  }, {
    breadcrumbName:'数据报表',
    component: CommonStatisticsList,
    path:'/datareport',
    children: [],
    sideIcon: 'anticon anticon-file-word',
  }, {
    breadcrumbName:'识别列表查询',
    component: CommonStatisticsList,
    path:'/list3',
    children: [],
    sideIcon: 'anticon anticon-file-word',
  }],
  component:CommonStatisticsList,
  path:'/active',
  userLeve: power.general + power.admin,
  sideIcon: 'anticon anticon-file-word',
}, {
  breadcrumbName:'顾客管理',
  component:CommonStatisticsList,
  children: [{
    breadcrumbName:'会员组管理',
    component: CommonStatisticsList,
    path:'/list',
    children: [],
    sideIcon: 'anticon anticon-file-word',
  }, {
    breadcrumbName:'会员管理',
    component: CommonStatisticsList,
    path:'/list2',
    children: [],
    sideIcon: 'anticon anticon-file-word',
  }],
  path:'/active2',
  userLeve: power.general + power.admin,
  sideIcon: 'anticon anticon-file-word',
}, {
  breadcrumbName:'设备管理',
  component:CommonStatisticsList,
  path:'/active3',
  userLeve: power.general + power.admin,
  sideIcon: 'anticon anticon-file-word',
}, {
  breadcrumbName:'公司管理',
  component:CommonStatisticsList,
  path:'/active4',
  userLeve: power.general + power.admin,
  children: [{
    breadcrumbName:'门店管理',
    component: CommonStatisticsList,
    path:'/list',
    children: [],
    sideIcon: 'anticon anticon-file-word',
  }, {
    breadcrumbName:'员工账号管理',
    component: CommonStatisticsList,
    path:'/list2',
    children: [],
    sideIcon: 'anticon anticon-file-word',
  }],
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
