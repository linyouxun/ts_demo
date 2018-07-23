import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import {Breadcrumb} from 'antd';
const {Item} = Breadcrumb;
import "./SiteBreadcrumb.less";

export class SiteBreadcrumb extends React.Component<any, any> {
  constructor(props: any){
    super(props);
  }

  public breadcrumbPath() {
    const {location, routes} = this.props;
    if (location.pathname === '/') {
      return (
        <Breadcrumb>
          <Item key={'/'}><Link to={'/'}>首页</Link></Item>
        </Breadcrumb>
      );
    }
    const paths = location.pathname.split('/');
    const pathDom = [];
    let path = '';
    for (const iterator of paths) {
      path += '/' + iterator;
      path = path.replace('//', '/');
      pathDom.push(<Item key={path}><Link to={path}>{routes[path] || '没有找到'}</Link></Item>);
    }
    return (
      <Breadcrumb separator=" > ">
        {pathDom}
      </Breadcrumb>
    );
  }

  public render(){
    return (
      <div className="component site-breadcrumb">
        {this.breadcrumbPath()}
      </div>
    )
  }
}

export default withRouter(SiteBreadcrumb);
