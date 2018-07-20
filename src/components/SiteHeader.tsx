import * as React from 'react';
import {Modal, Icon} from 'antd';
import "./SiteHeader.less";

export class SiteHeader extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {
      account: ''
    };
    this.onClickLogout = this.onClickLogout.bind(this);
    this.submitModal = this.submitModal.bind(this);
    this.cancelModal = this.cancelModal.bind(this);
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
    window.location.href = '/user/login';
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
  public render(){
    const {account} = this.state;
    return (
      <header className="component site-header">
        <a className="header-logo" href="/" title="首页"/>
        <div className="header-action">
          <nav>
            <span className="action-shop-name"> ※ 优居小程序后台管理系统 </span>
            <span className="action-user-name"><Icon type="user"/><span>{account}</span></span>
            <span className="action-log-out" onClick={this.onClickLogout}><Icon type="logout"/><span>退出系统</span></span>
          </nav>
        </div>
      </header>
    )
  }
}
export default SiteHeader;
