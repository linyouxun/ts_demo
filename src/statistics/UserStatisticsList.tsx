import * as React from 'react';
import * as moment from 'moment';
import ContentHeader from "../components/ContentHeader";
import UserStatisticsFilter from './components/UserStatisticsFilter';
import FormField from "../components/FormField";
import { Table, Modal } from 'antd';
import { fetchData } from "../util/request";
import { PAGE, APISERVER } from '../util/const';
import { deleteInstanceKeys } from '../util/tools';

import './UserStatisticsList.less';

enum FixedTpye {
  right = 'right',
  left = 'left',
  center = 'center'
}

class UserStatisticsList extends React.Component<any, any> {
  public page = {
    pageSize: PAGE.defaultPageSize,
    currentPage: PAGE.defaultCurrentPage,
    total: PAGE.total
  }
  // 存放筛选参数
  public extraData = {};
  public state = {
    column: [
      {title: '序号', dataIndex: 'index', width: 90, align: FixedTpye.center, render:(text: any, record: any, index: any)=> {
        const { currentPage, pageSize } = this.page;
        return <div className="item-index">{ (currentPage - 1) * pageSize + index + 1 }</div>
      }},
      {title: '页面信息', dataIndex: 'configId', width: 220, render:(text: any,record: any, index: any)=> {
        return  <div>
          <div>标题：{record.affiliation.pageTitle}</div>
          <div className='page-id'>ID：{record.affiliation.pageId}</div>
        </div>
      }},
      {title: '姓名', dataIndex: 'name', width: 220},
      {title: '电话', dataIndex: 'mobile', width: 220},
      {title: '额外信息', dataIndex: 'extraInfo', width: 220, render:(text: any,record: any, index: any)=> {
        const extraInfo = deleteInstanceKeys(text, ['name', 'mobile']);
        const itemDiv = [];
        for (const key in extraInfo) {
          if (extraInfo.hasOwnProperty(key)) {
            const element = extraInfo[key];
            itemDiv.push(<div key={key}>
              {key}: {element}
            </div>)
          }
        }
        return  <div>
          {itemDiv}
        </div>
      }},
      {title: '报名时间', dataIndex: 'signTime',width: 180, render:(text: any,record: any, index: any)=> {
        let title = '';
        let historyDom: any = null;
        if (!!record.signHistory && record.signHistory.length > 0) {
          title = '上一次报名时间为: ' + moment(+record.signHistory[0].signTime).format('YYYY年MM月DD HH小时mm分钟ss秒');
          historyDom = <span className='iconfont icon-history' onClick={this.showHistory.bind(this, record)}/>
        }
        return  <div title={title}>
          {moment(+record.signTime).format('YYYY-MM-DD HH:mm:ss')}
          {historyDom}
        </div>
      }}
    ],
    loading: false,
    list: [],
    history: [],
    pageTitle: '',
    isHistoryShow: false
  }
  public constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onReset = this.onReset.bind(this);
    this.okBtn = this.okBtn.bind(this);
    this.cancelBtn = this.cancelBtn.bind(this);
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
    }, `${APISERVER}/api2/custom/list`, {
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
        list: res.result.list,
      });
    }
  }
  public onSubmit(params: any) {
    if (!!params.time && params.time.length > 0) {
      params.time = [+params.time[0], +params.time[1]];
    }
    this.extraData = params;
    const { pageSize } = this.page;
    this.loadList(pageSize, PAGE.defaultCurrentPage);
  }
  public onReset() {
    this.extraData = {};
    const { pageSize } = this.page;
    this.loadList(pageSize, PAGE.defaultCurrentPage);
  }

  public onPageChange(current: any, pageSize: any) {
    this.loadList(+pageSize, +current);
  }

  public showHistory(record: any) {
    this.setState({
      history: record.signHistory,
      pageTitle: record.affiliation.pageTitle,
      isHistoryShow: true
    })
  }

  public okBtn() {
    this.cancelBtn();
  }
  public cancelBtn() {
    this.setState({
      history: [],
      pageTitle: '',
      isHistoryShow: false
    })
  }

  public render(): JSX.Element {
    const { column, loading, list, history, pageTitle, isHistoryShow } = this.state;
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
        showTotal: () => `第${currentPage}页, 共有${Math.ceil(Math.ceil(total / pageSize))}页，有${total}条`
      },
      rowClassName: (record: any, index: number) => {
        let className = '';
        if (!!record.signHistory && record.signHistory.length > 0) {
          className = 'sign-repeat'
        }
        return className;
      },
      rowKey    : (record: any, index: number) => {
        return (index + '')
      },
    };
    return <div className="page user-statistics-list">
      <ContentHeader title="报名统计" />
      <FormField>
        <UserStatisticsFilter onSubmit={this.onSubmit} onReset={this.onReset}/>
      </FormField>
      <FormField>
        <Table scroll={{x:1420}} {...tableProps} />
      </FormField>
      <Modal
        title={pageTitle + '的历史报名数据'}
        visible={isHistoryShow}
        className='user-statistics-list-model'
        cancelText="取消"
        okText="确定"
        onOk={this.okBtn}
        onCancel={this.cancelBtn}
      >
        <div className="flex">
          <div className="m-name">姓名</div>
          <div className="m-mobile">电话</div>
          <div className="m-sign">报名时间</div>
          {/* <div className="flex-1">
            {item.name}
          </div> */}
        </div>
        {
          history.map((item: any, index: any) => {
            // const extraInfo = deleteInstanceKeys(item.extraInfo, ['name', 'mobile']);
            return <div key={index} className="flex">
              <div className="m-name">{item.name}</div>
              <div className="m-mobile">{item.mobile}</div>
              <div className="m-sign">{moment(item.signTime).format('YYYY-MM-DD hh:mm:ss')}</div>
              {/* <div className="flex-1">
                {item.name}
              </div> */}
            </div>
          })
        }
      </Modal>
    </div>;
  }
}
export default UserStatisticsList;
