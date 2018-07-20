import * as React from 'react';
// import { Switch, Route, withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteSide from './components/SiteSide';
import './App.less';
import {routes, routesList} from './routes';

class App extends React.Component<any, any> {
  public render() {
    return (
      <div className="app">
        <SiteHeader />
        <div className="wrapper">
          <SiteSide routes={routes}/>
          <div className="container" key="container">
            <Switch>
              {routesList.map((item: any, index: number) => <Route key={index} {...item} />)}
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
