import * as React from 'react';
import './Home.less';

class Home extends React.Component<any, any> {
  public render() {
    return (<div className="home">
      <h3>Welcome!</h3>
      <h4>欢迎登录优居小程序后台管理系统!</h4>
    </div>)
  }
}

export default Home;
