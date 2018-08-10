import * as React from 'react';
// import { Switch, Route, withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteSide from './components/SiteSide';
import SiteFooter from './components/SiteFooter';
import SiteBreadcrumb from './components/SiteBreadcrumb';
import './App.less';
import {routes, routesList, routesObject} from './routes';

class App extends React.Component<any, any> {
  public render() {
    return (
      <div className="app">
        <SiteHeader />
        <div className="wrapper">
          <SiteSide routes={routes}/>
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
