import * as React from "react";
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import "./SiteSide.less";
const {Sider} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

interface IMenuParams {
  domEvent: any,
  item: typeof MenuItem,
  key: string,
  keyPath: string[],
}

class SiteSide extends React.Component<any, any> {
  constructor(props: any, context: any){
    super(props, context);
    this.state = {
      collapsed   : false,
      mode        : 'inline',
      openMenu    : []
    };
    this.onCollapse = this.onCollapse.bind(this);
    this.onClickMenu = this.onClickMenu.bind(this);
    this.onOpenChangeMenu = this.onOpenChangeMenu.bind(this);
  }

  public onCollapse(collapsed: boolean){
    if (collapsed) {
      this.setState({
        collapsed,
        mode: 'vertical',
        openMenu: []
      });
    } else {
      this.setState({
        collapsed,
        mode: 'inline',
      });
      this.setOpenMenu();
    }
  }

  public onClickMenu(item: IMenuParams){
    const newPath = item.keyPath[0];
    if (window.location.pathname !== newPath ) {
      this.props.history.push(newPath);
    }
  }

  public onOpenChangeMenu(openKeys: string[]) {
    console.log(openKeys);
    this.setState({
      openMenu: openKeys
    })
  }

  public componentDidMount() {
    this.setOpenMenu();
  }

  public setOpenMenu() {
    const {location} = this.props;
    const paths = location.pathname.split('/');
    this.setState({
      openMenu: ['/' + paths[1]]
    })
  }

  public render(){
    const {routes, location} = this.props;
    const {openMenu, mode, collapsed} = this.state;
    const menuList = [];
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      if(!!item.isNotMenu) {
        continue;
      }
      if (!item.children) {
        menuList.push(<MenuItem key={item.path}><span><i className={"iconfont " + item.sideIcon}/><span>{item.breadcrumbName}</span></span></MenuItem>);
      } else {
        menuList.push(<SubMenu
          key={item.path}
          title={<span><i className={"iconfont " + item.sideIcon}/><span className="nav-text">{item.breadcrumbName}</span></span>}
        >
          {
            item.children.filter((item2: any) => !!item2.sideIcon).map((item3: any) => {
              return <MenuItem key={item3.path}><span><i className={"iconfont " + item3.sideIcon}/><span>{item3.breadcrumbName}</span></span></MenuItem>
            })
          }
        </SubMenu>);
      }
    }
    return (
      <Sider className="component site-side" collapsible={false} collapsed={collapsed} onCollapse={this.onCollapse}>
        <Menu theme="dark" mode={mode} onOpenChange={this.onOpenChangeMenu} openKeys={openMenu} onClick={this.onClickMenu} selectedKeys={[location.pathname]}>
          {menuList}
        </Menu>
      </Sider>
    )
  }
}
export default withRouter(SiteSide);
