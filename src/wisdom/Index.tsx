import * as React from 'react';
import * as moment from 'moment';
import ContentHeader from "../components/ContentHeader";
import WisdomFilter from "../components/WisdomFilter";
import FormField from "../components/FormField";
import { Table, Tag } from 'antd';
import { fetchData } from "../util/request";
import { PAGE, APISERVER } from '../util/const';
import './Index.less';


class Index extends React.Component<any, any> {
  public page = {
    pageSize: PAGE.defaultPageSize,
    currentPage: PAGE.defaultCurrentPage,
    total: PAGE.total
  }
  public state = {
    activeColumn: [
      {title: '序号', dataIndex: 'index', render:(text: any, record: any, index: any)=> {
        const { currentPage, pageSize } = this.page;
        return <div>{ (currentPage - 1) * pageSize + index + 1 }</div>
      }},
      {title: '标题', dataIndex: 'title'},
      {title: '标签', dataIndex: 'labels', render:(text: any,record: any, index: any)=> {
        return  <div>{record.labels.map((item: any, ind: any) => {
          return  <Tag color="#2db7f5" key={ind}>{item.labelName}</Tag>
        })}</div>
      }},
      {title: '创建时间', dataIndex: 'createTime', render:(text: any,record: any, index: any)=> {
        return  <div>{moment(+record.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
      }},
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
      limit: pageSize,
      cursor: currentPage
    }, `/api-wisdom/update/list`, {
      method: 'GET'
    });
    this.setState({
      loading: false
    });
    if (res.stutasCode === 200) {
      this.page = {
        pageSize: res.result.pagination.limit,
        currentPage: res.result.pagination.cursor,
        total: res.result.pagination.total
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
    this.props.history.push(`/wisdom/list/add`);
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
        <WisdomFilter onSubmit={this.onSubmit} onAdd={this.onAdd}/>
      </FormField>
      <FormField>
        <Table {...tableProps} />
      </FormField>
    </div>);
  }
}

export default Index;
