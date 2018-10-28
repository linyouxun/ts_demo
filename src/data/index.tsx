import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import App from './App';
import './index.css';
// 暂时不做web缓存
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <App/>
  </Router>,
  document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
