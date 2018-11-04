import * as React from 'react';
import {Modal, Icon, message } from 'antd';
import { fetchData } from "../util/request";
import { APISERVER } from '../util/const';
// import userInfo from '../util/power';
import { withRouter } from "react-router-dom";
import "./SiteHeader.less";

interface IMenuParams {
  name: string;
  path: string;
  key: string;
}

export class SiteHeader extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {
      account: ''
    };
    this.onClickLogout = this.onClickLogout.bind(this);
    this.submitModal = this.submitModal.bind(this);
    this.cancelModal = this.cancelModal.bind(this);
    this.menuChoose = this.menuChoose.bind(this);
    this.state = {
      menuIndex: props.location.pathname,
      menu: [
        {name: '首页', path: '/', key: 'index1'},
        {name: '智慧巡店', path: '/wisdom/active/index', key: 'index2'},
        {name: '我的数据', path: '/data/preview', key: 'index3'},
        {name: '智慧营销', path: '/marketing', key: 'index4'},
        {name: '派单系统', path: '/order', key: 'index5'},
        {name: '智慧大学', path: '/university', key: 'index6'}
      ]
    }
  }

  // public componentDidMount(){
  //   console.log(' header ');
  // }

  public onClickLogout(){
    const self = this;
    Modal.confirm({
      content: '确定要注销吗?',
      title  : '注意',
      onOk(){
        self.outLogin()
      },
      onCancel(){
        console.log('cancel');
      },
    })
  }

  public async outLogin() {
    const res = await fetchData( {}, `${APISERVER}/api2/logout`, {
      method: 'GET'
    });
    if(res.stutasCode === 200) {
      window.location.href = '/login';
    } else {
      message.error(res.message);
    }
  }
  public changePWD() {
    this.setState({
      visibleModal: true
    })
  }
  public submitModal() {
    console.log('log');
  }
  public cancelModal() {
    console.log('log');
  }
  public async updateItem() {
    console.log('log');
  }
  public menuChoose(e: any) {
    this.setState({
      menuIndex: e.target.dataset.index
    });
    this.props.history.push(e.target.dataset.index);
  }
  public render(){
    const { menuIndex, menu } = this.state;
    return (
      <header className="component site-header">
        <a className="header-logo" href="/" title="首页"/>
        <div className='header-main-menu'>
          <ul className='header-main-menu-ul'>
            {menu.map((item: IMenuParams, key: any) => {
              return <li data-index={item.path} className={item.path === menuIndex ? 'active' : ''} onClick={this.menuChoose} key={key}>{item.name}</li>
            })}
          </ul>
        </div>
        <div className="header-action">
          <nav>
            {/* <span className="action-shop-name"> ※ 智慧门店 </span>
            <span className="action-user-name"><Icon type="user"/><span>{ userInfo.userName }</span></span> */}
            <span className="action-log-out" onClick={this.onClickLogout}><Icon type="logout"/><span>退出系统</span></span>
          </nav>
        </div>
      </header>
    )
  }
}

export default withRouter(SiteHeader);
