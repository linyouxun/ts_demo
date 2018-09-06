import * as React from 'react';
import ContentHeader from "../components/ContentHeader";
import FormField from "../components/FormField";
import { Table } from 'antd';
import { fetchData } from "../util/request";
import { PAGE, APISERVER } from '../util/const';
import './UserList.less';

enum FixedTpye {
  right = 'right',
  left = 'left',
  center = 'center'
}

class UserList extends React.Component<any, any> {
  public page = {
    pageSize: PAGE.defaultPageSize,
    currentPage: PAGE.defaultCurrentPage,
    total: PAGE.total
  }
  // 存放筛选参数
  public extraData = {};
  public state = {
    column: [
      {title: '序号', dataIndex: 'index', align: FixedTpye.center, render:(text: any, record: any, index: any)=> {
        const { currentPage, pageSize } = this.page;
        return <div className="item-index">{ (currentPage - 1) * pageSize + index + 1 }</div>
      }},
      {title: 'ID', dataIndex: '_id'},
      {title: '姓名', dataIndex: 'name'},
      {title: '手机', dataIndex: 'mobile'},
      {dataIndex: 'operation', render:(text: number | string | boolean, record: object, index: number)=> {
        return <div>
          操作
        </div>
      }, title: '操作'}
    ],
    loading: false,
    list: [],
    cityList: []
  }
  public constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onReset = this.onReset.bind(this);
  }
  public componentDidMount() {
    const { pageSize, currentPage } = this.page;
    this.loadList(pageSize, currentPage);
  }
  public async loadList(pageSize: number | string, currentPage: number | string) {
    this.setState({
      loading: true
    });
    const res = await fetchData( {
      pageSize,
      currentPage,
      extraData: JSON.stringify(this.extraData)
    }, `${APISERVER}/api2/user/list`, {
      method: 'GET'
    });
    this.setState({
      loading: false
    });
    if (res.code === 200) {
      this.page = {
        pageSize: res.result.pageSize,
        currentPage: res.result.currentPage,
        total: res.result.total
      }
      this.setState({
        list: res.result.list,
      });
    }
  }
  public onSubmit(params: any) {
    const data: {
      channel_city?: string[],
      city?: string[],
      html?: string,
      id?: string,
      time?: number[],
    } = {};
    if(!!params.channel_city && params.channel_city.length > 0) {
      data.channel_city = params.channel_city;
    }
    if(!!params.city && params.city.length > 0) {
      data.city = params.city;
    }
    if(!!params.html) {
      data.html = params.html;
    }
    if(!!params.id) {
      data.id = params.id;
    }
    if(!!params.time && params.time.length > 0) {
      data.time = [params.time[0].valueOf(), params.time[1].valueOf()];
    }
    this.extraData = data;
    this.page.currentPage = 1;
    const { pageSize, currentPage } = this.page;
    this.loadList(pageSize, currentPage);
  }
  public onReset() {
    this.extraData = {};
    this.page.currentPage = 1;
    const { pageSize, currentPage } = this.page;
    this.loadList(pageSize, currentPage);
  }

  public onPageChange(current: any, pageSize: any) {
    this.loadList(+pageSize, +current);
  }

  public render(): JSX.Element {
    const { column, loading, list } = this.state;
    const { pageSize, currentPage, total } = this.page;
    const tableProps = {
      bordered  : true,
      columns   : column,
      dataSource: list,
      loading,
      pagination: {
        current: currentPage,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageChange,
        pageSizeOptions: PAGE.defaultPageSizeOptions,
        pageSize,
        showTotal: () => `第${currentPage}页, 共${Math.ceil(total / pageSize)}页, 有${total}条`
      },
      rowKey    : (record: any, index: number) => {
        return (index + '')
      },
    };
    return <div className="page user-list">
      <ContentHeader title="用户管理" />
      <FormField>
        2
      </FormField>
      <FormField>
        {/* scroll={{x:1300}} */}
        <Table {...tableProps} />
      </FormField>
    </div>;
  }
}
export default UserList;
