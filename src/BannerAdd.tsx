import * as React from "react";
import ContentHeader from "./components/ContentHeader";
import { withRouter } from 'react-router-dom';
import './BannerAdd.less';
import Tools from "./util/tools";

class BannerAdd extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    const paramsStr = props.location.search.substr(1);
    const params: {
      id?: string
    } = Tools.urlStringToObj(paramsStr);
    console.log(params);
    this.state = {
      id: params.id || ''
    };
  }

  public render(){
    const { id } = this.state;
    return (
      <div className="page shopping-mall-add">
        <ContentHeader title={!!id ? "修改banner":"添加banner"}/>
        {/* <FormField>
          <ShoppingForm onSubmit={this.onSubmit} goback={this.goback} params={{id, clickUrl, imageUrl, name, loading}}/>
        </FormField> */}
      </div>
    );
  }
}


export default withRouter(BannerAdd);
