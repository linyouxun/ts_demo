import * as React from "react";
import Home from './Home';
import BannerList from './BannerList';
import BannerAdd from './BannerAdd';
import NotFound from './NotFound';

interface Iprop {
  breadcrumbName?: string,
  component: typeof React.Component,
  exact?: boolean, // 默认是true
  path: string,
  sideIcon?: string,
  children?: Iprop[],
  isNotMenu?: boolean, // 默认是菜单里面
  isFull?: boolean, // 默认是不全屏 是否全屏
}

export const routes = [{
  breadcrumbName:'主页',
  component: Home,
  isNotMenu: true,
  path: '/',
  sideIcon: 'anticon anticon-picture',
}, {
  breadcrumbName:'banner图管理',
  children: [{
    breadcrumbName:'banner管理',
    children: [{
      breadcrumbName:'banner图片添加',
      component: BannerAdd,
      path:'/add',
      sideIcon: 'anticon anticon-file-word',
    }],
    component: BannerList,
    path:'/banner',
    sideIcon: 'anticon anticon-file-word',
  }],
  component:BannerList,
  path:'/manage',
  sideIcon: 'anticon anticon-file-word',
}, {
  component:NotFound,
  isFull: false,
  isNotMenu: true,
  path:'*',
}];

export const routesList: Iprop[] = [];
export const routesObject: any = {};
for (const iterator of routes) {
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

console.log(routesList,routesObject);

export default {
  routes,
  routesList,
  routesObject
};
