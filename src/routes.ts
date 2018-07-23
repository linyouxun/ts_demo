import Home from './Home';
import Home2 from './Home2';
import NotFound from './NotFound';

interface Iprop {
  breadcrumbName?: string,
  component:typeof Home,
  exact?: boolean, // 默认是true
  path: string,
  sideIcon?: string,
  children?: Iprop[],
  isNotMenu?: boolean, // 默认是菜单里面
  isFull?: boolean, // 默认是不全屏 是否全屏
}

export const routes = [{
  breadcrumbName:'首页',
  component:Home,
  path: '/',
  sideIcon: 'anticon anticon-picture',
}, {
  breadcrumbName:'首页2',
  children: [{
    breadcrumbName:'首页2.1',
    component:Home2,
    path:'/home',
    sideIcon: 'anticon anticon-file-word',
  }, {
    breadcrumbName:'首页2.2',
    component:Home2,
    path:'/home2',
    sideIcon: 'anticon anticon-file-word',
  }],
  component:Home2,
  path:'/home1',
  sideIcon: 'anticon anticon-file-word',
}, {
  breadcrumbName:'首页3',
  children: [{
    breadcrumbName:'首页3.1',
    component:Home2,
    path:'/home3',
    sideIcon: 'anticon anticon-file-word',
  }, {
    breadcrumbName:'首页3.2',
    component:Home2,
    path:'/home32',
    sideIcon: 'anticon anticon-file-word',
  }],
  component:Home2,
  path:'/home31',
  sideIcon: 'anticon anticon-file-word',
},  {
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
      routesList.push({
        exact: true,
        ...iterator2
      });
      routesObject[iterator2.path] = iterator2.breadcrumbName;
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

export default {
  routes,
  routesList,
  routesObject
};
