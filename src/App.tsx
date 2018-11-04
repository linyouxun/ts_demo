import * as React from 'react';
// import { Switch, Route, withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteSide from './components/SiteSide';
import Login from './login/Login';
// import SiteFooter from './components/SiteFooter';
import SiteBreadcrumb from './components/SiteBreadcrumb';
import './App.less';
import 'ant-design-pro/dist/ant-design-pro.css'; // 统一引入样式
// import {routes2, routesList, routesObject} from './routes';
// 智慧门店
import {routes2 as wisdomRoutes2, routesList as wisdomRoutesList, routesObject as wisdomRoutesObject} from './wisdomShop/routes';
// 我的数据
import {routes2 as dataRoutes2, routesList as dataRoutesList, routesObject as dataRoutesObject} from './data/routes';
// 智慧营销
import {routes2 as marketingRoutes2, routesList as marketingRoutesList, routesObject as marketingRoutesObject} from './marketing/routes';
// 订单系统
import {routes2 as orderRoutes2, routesList as orderRoutesList, routesObject as orderRoutesObject} from './order/routes';
// 我的大学
import {routes2 as universityRoutes2, routesList as universityRoutesList, routesObject as universityRoutesObject} from './university/routes';
import * as moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

class App extends React.Component<any, any> {
  public render() {
    let routes2: any = wisdomRoutes2;
    let routesObject: any = wisdomRoutesObject;
    let routesList: any = wisdomRoutesList;
    if (window.location.pathname === '/login') {
      return <Login/>;
    }
    if (/^\/data.*/.test(window.location.pathname)) {
      routes2 = dataRoutes2;
      routesObject = dataRoutesObject;
      routesList = dataRoutesList;
    }
    if (/^\/marketing.*/.test(window.location.pathname)) {
      routes2 = marketingRoutes2;
      routesObject = marketingRoutesObject;
      routesList = marketingRoutesList;
    }
    if (/^\/order.*/.test(window.location.pathname)) {
      routes2 = orderRoutes2;
      routesObject = orderRoutesObject;
      routesList = orderRoutesList;
    }
    if (/^\/university.*/.test(window.location.pathname)) {
      routes2 = universityRoutes2;
      routesObject = universityRoutesObject;
      routesList = universityRoutesList;
    }
    return (
      <div className="app">
        <SiteHeader />
        <div className="wrapper">
          <SiteSide routes={routes2}/>
          <div className="container" key="container">
            <SiteBreadcrumb routes={routesObject}/>
            <Switch>
              {routesList.filter((item: any) => !item.isFull).map((item: any, index: number) => <Route key={index} {...item} />)}
            </Switch>
            {/* <SiteFooter /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
