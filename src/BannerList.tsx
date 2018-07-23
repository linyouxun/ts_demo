import * as React from "react";
import {Table} from "antd";
import ContentHeader from "./components/ContentHeader";
import FormField from "./components/FormField";
import Tools from './util/tools';
import { withRouter } from 'react-router-dom';
// import { PAGE } from './util/const';
// import QueueAnim from 'rc-queue-anim';
// import Tools from '../utils/tools';

class BannerList extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {
      bannerList: [],
      column: [
        {
          dataIndex: 'id',
          title: 'ID',
        }, {
          dataIndex: 'name',
          title: 'banner名称',
        }, {
          render:(text: any, record: any, index: any) => {
            return <div>
              <a className='primary-tips' onClick={this.handleModify.bind(this, text, record, index)}>修改</a>
            </div>
          },
          title: '操作',
          width: 200,
        }],
      loading:false,
      pagination: false,
    };
  }

  public handleModify(text: any, record: any, index: any) {
    this.props.history.push(`/manage/banner/add?${Tools.objToUrlString(record)}`);
  }


  public async componentDidMount(){
    this.setState({
      bannerList: [{
        id: 1,
        name: '首页banner'
      }]
    });
  }

  public render(){
    const {loading, bannerList, column, pagination} = this.state;
    const tableProps = {
      bordered  : true,
      columns   : column,
      dataSource: bannerList,
      loading,
      pagination,
      rowKey    : (record: any, index: number) => {
        return (index + '')
      },
    };
    return (
      <div className="page">
        <ContentHeader title="banner管理" />
        <FormField>
          <Table {...tableProps} />
        </FormField>
      </div>
    );
  }
}

export default withRouter(BannerList);
