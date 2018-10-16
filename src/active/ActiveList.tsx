import * as React from 'react';
import * as moment from 'moment';
import ContentHeader from "../components/ContentHeader";
import ActiveFilter from "./components/ActiveFilter";
import FormField from "../components/FormField";
import * as QRCode  from 'qrcode.react';
import { Table, Popconfirm } from 'antd';
import { fetchData } from "../util/request";
import { PAGE, APISERVER, power } from '../util/const';
import userInfo from '../util/power';
import './ActiveList.less';


class ActiveList extends React.Component<any, any> {
  public page = {
    pageSize: PAGE.defaultPageSize,
    currentPage: PAGE.defaultCurrentPage,
    total: PAGE.total
  }
  public state = {
    activeColumn: [
      {title: '序号', width: 50, dataIndex: 'index', render:(text: any, record: any, index: any)=> {
        const { currentPage, pageSize } = this.page;
        return <div>{ (currentPage - 1) * pageSize + index + 1 }</div>
      }},
      {title: `${userInfo.userLeve < 1 ? 'ID (所属者)' : 'ID'}`, width: 520, dataIndex: '_id', render:(text: any,record: any, index: any)=> {
        if (!!record.isUpdate && record.isRelease) {
          return <div className='remark'>
            <a className='t-id' target='_black' href={`http://m.youju360.com/static/${record._id}/index.html`}>
              {text}{!!(userInfo.userLeve & power.admin) ? ' (' + (record.user.name || '无') + ')' : ''}
            </a>
            {!!record.remark ? <div>{record.remark}</div> : ''}
            {/* <div className='remark-btn' title='添加备注信息' onClick={this.addRemark.bind(this, record)}/> */}
          </div>
        }
        return <div className='remark'>
          {text}{ !!(userInfo.userLeve & power.admin) ? ' (' + record.user.name + ')' : ''}
          {!!record.remark ? <div>{record.remark}</div> : ''}
          {/* <div className='remark-btn' title='添加备注信息' onClick={this.addRemark.bind(this, record)}/> */}
        </div>
      }},
      {title: '标题', width: 300, dataIndex: 'title'},
      {title: '更新时间', width: 180, dataIndex: 'updateTime', render:(text: any,record: any, index: any)=> {
        return <div>
          <span title={'更新时间'}>{moment(record.meta.updatetime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>
      }},
      // {title: '创建时间', dataIndex: 'createTime', render:(text: any,record: any, index: any)=> {
      // {moment(record.meta.createtime).format('YYYY-MM-DD HH:mm:ss')}
      // }},
      {dataIndex: 'operation', width: 250, render:(text: number | string | boolean, record: any, index: number)=> {
        return <div style={{textAlign: 'right'}}>
          {record.isUpdate === true ? <a className='primary-tips' onClick={this.handleModify.bind(this, record)}>修改</a> : ''}
          {record.isUpdate === true ? <div className="ant-divider ant-divider-vertical"/> : ''}
          {record.isRelease === false ? <a className='primary-tips' onClick={this.curlInfo.bind(this, record)}>发布</a> : ''}
          {record.isRelease === false ? <div className="ant-divider ant-divider-vertical"/> : ''}
          <Popconfirm title={'确定要删除么？？？'} onConfirm={this.deleteRecord.bind(this, record)} okText="是的" cancelText="点错了">
            <a className="dangerous-tips">删除</a>
          </Popconfirm>
          <div className="ant-divider ant-divider-vertical"/>
          <a className='primary-tips '>
            <span className='qr'>
              预览
              <div className='pre'>
                <QRCode size={140} value={`http://m.youju360.com/static/${record._id}/index.html`} />
              </div>
            </span>
          </a>
          <div className="ant-divider ant-divider-vertical"/>
            <a className='primary-tips' onClick={this.downloadHtml.bind(this, record)}>下载</a>
          </div>
      }, title: '操作'}
    ],
    loading: false,
    activeList: [],
  }
  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  public downloadHtml(record: any) {
    window.open(`${APISERVER}/api2/active/download/${record._id}`);
  }

  public componentDidMount() {
    const { pageSize, currentPage } = this.page;
    this.loadList(pageSize, currentPage);
  }

  public addRemark(record: any) {
    console.log(record)
  }

  public async loadList(pageSize: number | string, currentPage: number | string) {
    this.setState({
      loading: true
    });
    const res = await fetchData( {
      pageSize,
      currentPage
    }, `${APISERVER}/api2/active/list`, {
      method: 'GET'
    });
    this.setState({
      loading: false
    });
    if (res.stutasCode === 200) {
      this.page = {
        pageSize: res.result.pageSize,
        currentPage: res.result.currentPage,
        total: res.result.total
      }
      this.setState({
        activeList: res.result.list,
      });
    }
  }

  public onSubmit() {
    console.log('onSubmit');
  }
  public onAdd() {
    this.props.history.push(`/active/list/add`);
  }
  public handleModify(record: any) {
    this.props.history.push(`/active/list/modify?id=${record._id}`);
  }
  public async curlInfo(record: any) {
    this.setState({
      loading: true
    });
    const res = await fetchData( {
      id: record._id
    }, `${APISERVER}/api2/active/list/curl/${record._id}`, {
      method: 'POST'
    });
    this.setState({
      loading: false
    });
    if (res.stutasCode === 200) {
      const { pageSize, currentPage } = this.page;
      this.loadList(pageSize, currentPage);
    }
  }

  public async deleteRecord(record: any) {
    this.setState({
      loading: true
    });
    const res = await fetchData( {
      id: record._id
    }, `${APISERVER}/api2/active/list/delete`, {
      method: 'POST'
    });
    this.setState({
      loading: false
    });
    if (res.stutasCode === 200) {
      const { pageSize, currentPage } = this.page;
      this.loadList(pageSize, currentPage);
    }
  }
  public onPageChange(current: any, pageSize: any) {
    this.loadList(+pageSize, +current);
  }
  public render(): JSX.Element {
    const { loading, activeList, activeColumn } = this.state;
    const { total, pageSize, currentPage } = this.page;
    const tableProps = {
      bordered  : true,
      columns   : activeColumn,
      dataSource: activeList,
      loading,
      pagination: {
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageChange,
        pageSizeOptions: PAGE.defaultPageSizeOptions,
        pageSize,
        showTotal: () => `第${currentPage}页, 共有${Math.ceil(Math.ceil(total / pageSize))}页，有${total}条`
      },
      rowKey    : (record: any, index: number) => {
        return (index + '')
      },
    };
    return (<div className="page">
      <ContentHeader title="活动推广页面配置" />
      <FormField>
        <ActiveFilter onSubmit={this.onSubmit} onAdd={this.onAdd}/>
      </FormField>
      <FormField>
        <Table scroll={{x:1200}} {...tableProps} />
      </FormField>
    </div>);
  }
}

export default ActiveList;
