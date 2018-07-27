import * as React from 'react';
import './CaseAdd.less';
import ContentHeader from "./components/ContentHeader";
import CaseAddForm, { IParamsSubmit } from "./components/CaseAddForm";
import { message } from 'antd';
import { withRouter } from 'react-router-dom';
import FormField from './components/FormField';
import Tools from "./util/tools";
import { fetchData } from "./util/request";


class CaseAdd extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    const paramsStr = props.location.search.substr(1);
    const params: {
      id?: string;
      image?: any;
      title?: string;
      value?: string;
      category?: string | number;
    } = Tools.urlStringToObj(paramsStr);
    this.state = {
      category: (typeof params.category === 'undefined') ? '' : params.category,
      id: params.id || '',
      image: params.image || [],
      loading: false,
      title: params.title || '',
      value: params.value || '',
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.goback = this.goback.bind(this);
  }

  public onSubmit(o: any) {
    const imageUrl = o.imgs.fileList.map((item: any) => {
      return {
        name: item.name,
        uid: item.uid,
        url: item.url,
      }
    })
    const data: IParamsSubmit = {
      category: o.category,
      image: JSON.stringify(imageUrl),
      title: o.title,
      value: o.value,
    }
    if (!!o.id) {
      data.id = o.id;
      data.itemId = o.id;
      data.operate = '1';
      this.updateItem(data);
    } else {
      this.addItem(data);
    }
  }
  public async updateItem(data: any) {
    this.setState({loading: true})
    const res = await fetchData( data, 'case/updateCase', {
      method: 'POST'
    });
    this.setState({loading: false});
    if (res.code !== 200) {
      message.error('更新案例信息失败');
    } else {
      this.goback();
      message.success('更新案例信息成功');
    }
  }
  public async addItem(data: any) {
    this.setState({loading: true})
    const res = await fetchData( data, 'case/addCase', {
      method: 'POST'
    });
    this.setState({loading: false});
    if (res.code !== 200) {
      message.error('保存案例信息失败');
    } else {
      this.goback();
      message.success('保存案例信息成功');
    }
  }


  public goback() {
    this.props.history.goBack();
  }

  public render(){
    const {id, category, title, image, loading, value} = this.state;
    return (
      <div className="page case-add">
        <ContentHeader title={!!id ? "修改案例":"添加案例"}/>
        <FormField>
          <CaseAddForm onSubmit={this.onSubmit} goback={this.goback} params={{id, category, title, image, loading, value}}/>
        </FormField>
      </div>
    );
  }
}


export default withRouter(CaseAdd);
