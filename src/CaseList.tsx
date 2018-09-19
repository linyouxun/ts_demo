import * as React from 'react';
import { Table, Modal, message, Popconfirm} from 'antd';
import ContentHeader from "./components/ContentHeader";
import CaseFilter from "./components/CaseFilter";
import FormField from "./components/FormField";
import { DECORATIONSTYLE } from './util/const';
import Tools from './util/tools';
import { fetchData } from "./util/request";
import './CaseList.less';

class CaseList extends React.Component<any, any> {

  constructor(props: any){
    super(props);
    this.state = {
      caseColumn: [
        {title: 'ID', dataIndex: 'id'},
        {title: '名称', dataIndex: 'title'},
        {dataIndex: 'category', render:(text: number | string | boolean, record: object, index: number)=> {
          for(const o in DECORATIONSTYLE) {
            if(DECORATIONSTYLE.hasOwnProperty(o)) {
              if (+DECORATIONSTYLE[o].id === +text) {
                return DECORATIONSTYLE[o].name;
              }
            }
          }
          return null;
        }, title: '分类'},
        {dataIndex: 'operation', render:(text: number | string | boolean, record: object, index: number)=> {
          return <div>
            <a className='primary-tips' onClick={this.handleModify.bind(this, record)}>修改</a>
            <div className="ant-divider ant-divider-vertical"/>
            <Popconfirm title={'确定要删除么？？？'} onConfirm={this.deleteRecord.bind(this, record)} okText="是的" cancelText="点错了">
              <a className="dangerous-tips">删除</a>
            </Popconfirm>
          </div>
        }, title: '操作', width: 200}
      ],
      caseList: [],
      childrenParams: Tools.objToUrlString(props.location.query),
      loading:true,
      merchandise_id: '',
      merchandise_name: '',
      pagination: false,
    };

    this.onClickQuery = this.onClickQuery.bind(this);
    this.addMerchandiseType = this.addMerchandiseType.bind(this);
  }

  public onClickQuery() {
    console.log('onClickQuery');
  }
  public addMerchandiseType() {
    this.props.history.push(`/case/list/add`);
  }
  public handleModify(record: object) {
    this.props.history.push(`/case/list/modify?${Tools.objToUrlString(record)}`);
  }
  public deleteRecord(record: object) {
    this.deleteItem(record);
  }

  public async deleteItem(record: any) {
    this.setState({loading: true})
    const res = await fetchData( {id: record.id, operate: 2}, '/xcx/api/case/updateCase', {
      method: 'POST'
    });
    this.setState({loading: false});
    if (res.code !== 200) {
      message.error(`id为${record.id}的案例删除失败`);
    } else {
      message.success(`id为${record.id}的案例删除成功`);
      this.loadData();
    }
  }

  public componentDidMount(){
    this.loadData()
  }
  public async loadData(data = {category: '-1'}) {
    this.setState({loading: true})
    const res = await fetchData( data, '/xcx/api/case/listCase', {
      method: 'GET'
    });
    this.setState({loading: false})
    if (res.code === 200) {
      this.setState({
        caseList: res.data.data
      })
    } else if (res.errorCode === -2) {
      Modal.error({
        content: '登陆已失效，请重新登陆',
        onOk: () => {
          window.location.href = '/login';
        },
        title: '',
      });
    } else {
      message.error(res.msg);
    }
  }

  public render(): JSX.Element {
    const {loading, caseList, caseColumn, pagination} = this.state;
    const tableProps = {
      bordered  : true,
      columns   : caseColumn,
      dataSource: caseList,
      loading,
      pagination,
      rowKey    : (record: any, index: number) => {
        return (index + '')
      },
    };
    return (<div className="page case-list">
      <ContentHeader title="案例列表" />
      <FormField>
        <CaseFilter onSubmit={this.onClickQuery} addMerchandiseType={this.addMerchandiseType}/>
      </FormField>
      <FormField>
        <Table {...tableProps} />
      </FormField>
    </div>);
  }
}

export default CaseList;
