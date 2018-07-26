import * as React from 'react';
import './CaseAdd.less';
import ContentHeader from "./components/ContentHeader";
import CaseAddForm from "./components/CaseAddForm";
import { withRouter } from 'react-router-dom';
import FormField from './components/FormField';
import Tools from "./util/tools";
// import { fetchData } from "./util/request";
class CaseAdd extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    const paramsStr = props.location.search.substr(1);
    const params: {
      id?: string
    } = Tools.urlStringToObj(paramsStr);
    console.log(params);
    this.state = {
      id: params.id || '',
      imageUrl: null,
      loading: false
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
    const data = {
      category: o.category,
      image: JSON.stringify(imageUrl),
      title: o.title,
      value: o.value,
    }
    console.log(data)
  }


  public goback() {
    this.props.history.goBack();
  }

  public render(){
    const {id, category, title, imageUrls, loading} = this.state;
    return (
      <div className="page case-add">
        <ContentHeader title={!!id ? "修改案例":"添加案例"}/>
        <FormField>
          <CaseAddForm onSubmit={this.onSubmit} goback={this.goback} params={{id, category, title, imageUrls, loading}}/>
        </FormField>
      </div>
    );
  }
}


export default withRouter(CaseAdd);
