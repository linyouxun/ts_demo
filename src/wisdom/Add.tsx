import * as React from 'react';
import './Add.less';
import ContentHeader from "../components/ContentHeader";
import WisdomAddForm, { IParamsSubmit } from "../components/WisdomAddForm";
import { message } from 'antd';
import { withRouter } from 'react-router-dom';
import FormField from '../components/FormField';
import Tools from "../util/tools";
import { fetchData } from "../util/request";


class Add extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    const paramsStr = props.location.search.substr(1);
    const params: {
      id?: string;
      image?: any;
      title?: string;
      value?: string;
      labels?: string | number;
    } = Tools.urlStringToObj(paramsStr);
    this.state = {
      labels: (typeof params.labels === 'undefined') ? '' : params.labels,
      id: params.id || '',
      image: params.image || [],
      loading: false,
      title: params.title || '',
      value: params.value || '',
      labelsList: []
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.goback = this.goback.bind(this);
  }

  public async componentDidMount() {
    const res = await fetchData( {}, '/api-wisdom/label/publishStatus', {
      method: 'GET',
    });
    if (res.stutasCode === 200) {
      this.setState({
        labelsList: res.result.list
      });
    } else {
      this.setState({
        labelsList: []
      });
    }
  }

  public onSubmit(o: any) {
    const imageUrl: string[] = o.fileList.map((item: any) => {
      return item.url;
    })
    const data: IParamsSubmit = {
      labels: o.labels,
      accessory: imageUrl.join(','),
      title: o.title,
      html: o.value,
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
    console.log(data);
    const res = await fetchData( data, '/xcx/api/case/updateCase', {
      method: 'POST',
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
    const res = await fetchData( data, '/api-wisdom/update/add', {
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
    const {id, labels, title, image, loading, value, labelsList} = this.state;
    return (
      <div className="page case-add">
        <ContentHeader title={!!id ? "修改发布内容":"添加发布内容"}/>
        <FormField>
          <WisdomAddForm labelsList={labelsList} onSubmit={this.onSubmit} goback={this.goback} params={{id, labels, title, image, loading, value}}/>
        </FormField>
      </div>
    );
  }
}


export default withRouter(Add);
