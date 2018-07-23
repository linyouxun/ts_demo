import * as React from 'react';
import './SiteFooter.less';

export default class SiteFooter extends React.Component<any, any> {
  public render() {
    return (
      <footer className="component site-footer">
        优居小程序后台管理 © <a className="footer-a" href="//xcx.yoju360.com">xcx.yoju360.com</a>
      </footer>
    );
  }
}
