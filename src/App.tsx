import * as React from 'react';
// import { Switch, Route, withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteSide from './components/SiteSide';
import SiteFooter from './components/SiteFooter';
import SiteBreadcrumb from './components/SiteBreadcrumb';
import './App.less';
import {routes2, routesList, routesObject} from './routes';
// 用户信息
import userInfo from './util/power';
import * as moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

class App extends React.Component<any, any> {
  public render() {
    if(!!window.sTool && !!window.sTool.visitPage) {
      window.sTool.setInfo(userInfo.userName || '' + '-' +userInfo.userLeve);
      window.sTool.visitPage();
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
            <SiteFooter />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
