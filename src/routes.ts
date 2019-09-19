import * as React from "react";
import Home from './Home';
// 活动页面配置
import ActiveList from './active/ActiveList';
import ActiveAdd from './active/ActiveAdd';
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
  userLeve?: number,
}

export const routes = [{
  breadcrumbName:'主页',
  component: Home,
  isNotMenu: true,
  path: '/',
  sideIcon: 'anticon anticon-picture',
}, {
  breadcrumbName:'活动推广页面配置',
  children: [{
    breadcrumbName:'页面配置列表',
    children: [{
      breadcrumbName:'页面配置添加',
      component: ActiveAdd,
      path:'/add',
      sideIcon: 'anticon anticon-file-word',
    }, {
      breadcrumbName:'页面配置修改',
      component: ActiveAdd,
      path:'/modify',
      sideIcon: 'anticon anticon-file-word',
    }],
    component: ActiveList,
    path:'/list',
    sideIcon: 'anticon anticon-file-word',
  }],
  component:ActiveList,
  path:'/active',
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
  return true;
})
export default {
  routes,
  routes2,
  routesList,
  routesObject
};
