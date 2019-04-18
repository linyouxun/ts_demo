import * as React from 'react';
import { Modal } from 'antd'
import './Home.less';
import { getCookie, setCookie } from './util/tools';

class Home extends React.Component<any, any> {
  public componentDidMount() {
    const self = this;
    const readme = getCookie('readme');
    if (!!readme) {
      return;
    }
    Modal.warn({
      width: 600,
      title: <div>各位大佬，现在账号有点错乱，数据有点对应不上了，建议各自使用自己的账号登陆</div>,
      content: <img style={{width: '100%'}} src="http://localhost:3100/accout.png" alt=""/>,
      onCancel: () => {
        self.props.history.push('/active/list');
      },
      onOk: () => {
        setCookie('readme', '1', 99999);
        self.props.history.push('/active/list');
      },
      okText: '我用的是我自己的账号'
    });
  }
  public render() {
    return (<div className="home">
      <h3>Welcome!</h3>
      <h4>欢迎登录优居小程序后台管理系统!</h4>
      <h4>
        {/* <img src="http://localhost:3100/ku.jpg" alt=""/> */}
        各位<span>大佬</span>，现在<span>账号有点错乱</span>，数据有点对应不上了，<span>建议</span>各自使用<span>自己</span>的<span>账号登陆</span>
        {/* <img src="http://localhost:3100/ku.jpg" alt=""/> */}
      </h4>
      <img src="http://localhost:3100/accout.png" alt=""/>
      <br/>
      <br/>
      <h4>如有遗漏，纯属巧合</h4>
      <pre>
        下版预计更新：
          1.单点登录;限制账号同时多点登录，多用户使用同一账号;
          2.新功能开发
      </pre>
    </div>)
  }
}

export default Home;
