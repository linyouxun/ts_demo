import * as React from 'react';
import {Modal, Icon, message } from 'antd';
import { fetchData } from "../util/request";
import { APISERVER } from '../util/const';
import userInfo from '../util/power';
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
      menuIndex: 'index2',
      menu: [
        {name: '智慧门店', path: '#', key: 'index1'},
        {name: '我的数据', path: '#', key: 'index2'},
        {name: '智慧营销', path: '#', key: 'index3'},
        {name: '呼叫+派单系统', path: '#', key: 'index4'},
        {name: 'ERP系统', path: '#', key: 'index5'},
        {name: '设计软件接入', path: '#', key: 'index6'},
        {name: '在线教育', path: '#', key: 'index7'},
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
    })
  }
  public render(){
    const { menuIndex, menu } = this.state;
    return (
      <header className="component site-header">
        <a className="header-logo" href="/" title="首页"/>
        <div className='header-main-menu'>
          <ul className='header-main-menu-ul'>
            {menu.map((item: IMenuParams, key: any) => {
              return <li data-index={item.key} className={item.key === menuIndex ? 'active' : ''} onClick={this.menuChoose} key={key}>{item.name}</li>
            })}
          </ul>
        </div>
        <div className="header-action">
          <nav>
            <span className="action-shop-name"> ※ 智慧门店 </span>
            <span className="action-user-name"><Icon type="user"/><span>{ userInfo.userName }</span></span>
            <span className="action-log-out" onClick={this.onClickLogout}><Icon type="logout"/><span>退出系统</span></span>
          </nav>
        </div>
      </header>
    )
  }
}
export default SiteHeader;
