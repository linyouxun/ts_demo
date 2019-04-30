import * as React from "react";
import Home from './Home';
import BannerList from './BannerList';
import BannerAdd from './BannerAdd';
import CaseList from './CaseList';
import CaseAdd from './CaseAdd';
// 活动页面配置
import ActiveList from './active/ActiveList';
import ActiveAdd from './active/ActiveAdd';
import NotFound from './NotFound';
// 统计页面
import StatisticsList from './statistics/StatisticsList';
import CommonStatisticsList from './statistics/CommonStatisticsList';
import UserStatisticsList from './statistics/UserStatisticsList';
import PageStatisticsList from './statistics/PageStatisticsList';
import NewPageStatisticsList from './statistics/NewPageStatisticsList';

// 用户管理
import UserList from './user/UserList';

// 用户信息
import userInfo from './util/power';
import { power } from './util/const';

// 智慧门店
import WisdomList from './wisdom/Index';
import WisdomAdd from './wisdom/Add';


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
  breadcrumbName:'banner图管理',
  userLeve: power.admin,
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
  breadcrumbName:'案例管理',
  userLeve: power.admin,
  children: [{
    breadcrumbName:'案例列表',
    children: [{
      breadcrumbName:'案例添加',
      component: CaseAdd,
      path:'/add',
      sideIcon: 'anticon anticon-file-word',
    }, {
      breadcrumbName:'案例修改',
      component: CaseAdd,
      path:'/modify',
      sideIcon: 'anticon anticon-file-word',
    }],
    component: CaseList,
    path:'/list',
    sideIcon: 'anticon anticon-file-word',
  }],
  component:CaseList,
  path:'/case',
  sideIcon: 'anticon anticon-file-word',
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
  breadcrumbName:'统计',
  children: [{
    breadcrumbName:'页面统计',
    component: PageStatisticsList,
    path:'/page',
    children: [],
    sideIcon: 'anticon anticon-file-word'
  }, {
    breadcrumbName:'页面统计-新版',
    component: NewPageStatisticsList,
    userLeve: power.admin,
    path:'/newpage',
    children: [],
    sideIcon: 'anticon anticon-file-word'
  }, {
    breadcrumbName:'通用统计',
    component: CommonStatisticsList,
    path:'/common',
    children: [],
    sideIcon: 'anticon anticon-file-word'
  }, {
    breadcrumbName:'报名统计',
    component: UserStatisticsList,
    path:'/user',
    userLeve: power.admin,
    children: [],
    sideIcon: 'anticon anticon-file-word'
  }],
  component: StatisticsList,
  path:'/statistics',
  sideIcon: 'anticon anticon-file-word'
}, {
  breadcrumbName:'用户管理',
  userLeve: power.admin,
  component: UserList,
  path:'/user',
  sideIcon: 'anticon anticon-file-word',
}, {
  breadcrumbName:'智慧门店',
  userLeve: power.admin,
  children: [{
    breadcrumbName:'发布列表',
    children: [{
      breadcrumbName:'发布添加',
      component: WisdomAdd,
      path:'/add',
      sideIcon: 'anticon anticon-file-word',
    }, {
      breadcrumbName:'发布修改',
      component: WisdomAdd,
      path:'/modify',
      sideIcon: 'anticon anticon-file-word',
    }],
    component: WisdomList,
    path:'/list',
    sideIcon: 'anticon anticon-file-word',
  }],
  component: WisdomList,
  path:'/wisdom',
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
