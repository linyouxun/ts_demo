import * as React from "react";
import ContentHeader from "./components/ContentHeader";
import { withRouter } from 'react-router-dom';
import BannerForm, {IParamsSubmit} from './components/BannerForm';
import FormField from './components/FormField';
import {message} from 'antd';
import './BannerAdd.less';
import Tools from "./util/tools";
import { fetchData } from "./util/request";

class BannerAdd extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    const paramsStr = props.location.search.substr(1);
    const params: {
      id?: string
    } = Tools.urlStringToObj(paramsStr);
    this.state = {
      id: params.id || '',
      imageUrl: null
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.goback = this.goback.bind(this);
  }

  public async componentDidMount(){
    const res = await fetchData( {}, '/xcx/api/resource/getHomepageBanner', {
      method: 'GET'
    });
    if (res.code === 200) {
      try {
        const imageUrl = JSON.parse(res.data);
        this.setState({
          imageUrl
        });
      } catch (error) {
        this.setState({
          imageUrl: []
        });
        console.log('图片转化失败...');
      }
    } else {
      this.setState({
        imageUrl: []
      });
    }
  }

  public onSubmit(o: IParamsSubmit) {
    const imageUrl = o.imgs.fileList.map(item => {
      return {
        name: item.name,
        uid: item.uid,
        url: item.url,
      }
    })
    const data = {
      value: JSON.stringify(imageUrl),
    }
    this.setItem(data);
  }

  public async setItem(params: object) {
    this.setState({loading: true})
    const res = await fetchData( params, '/xcx/api/resource/setHomepageBanner', {
      method: 'POST'
    });
    this.setState({loading: false});
    if (res.code === 200) {
      message.success('保存banner成功');
      this.goback();
    } else {
      message.error('保存banner出错了');
    }
  }

  public goback() {
    this.props.history.goBack();
  }

  public render(){
    const { id, loading, imageUrl } = this.state;
    return (
      <div className="page shopping-mall-add">
        <ContentHeader title={!!id ? "修改banner":"添加banner"}/>
        <FormField>
          {!!imageUrl? (<BannerForm onSubmit={this.onSubmit} goback={this.goback} params={{id, loading, imageUrl}}/>) : null}
        </FormField>
      </div>
    );
  }
}


export default withRouter(BannerAdd);
