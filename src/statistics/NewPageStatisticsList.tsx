import * as React from 'react';
import * as moment from 'moment';
import ContentHeader from "../components/ContentHeader";
import NewStatisticsFilter from "./components/NewStatisticsFilter";
import FormField from "../components/FormField";
import { Table } from 'antd';
import { fetchData } from "../util/request";
import { PAGE, APISERVER } from '../util/const';
import './PageStatisticsList.less';

enum FixedTpye {
  right = 'right',
  left = 'left',
  center = 'center'
}

class StatisticsList extends React.Component<any, any> {
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
      {title: '配置ID', dataIndex: 'configId', width: 90, align: FixedTpye.center,},
      {title: '(所属)当前页面', dataIndex: 'viewUrl', width: 635, render:(text: any,record: any, index: any)=> {
        return  <div title={text} className="item-html">
          ({record.config.title})<a target='_blank' className='link-color' href={text}>{text}</a>
        </div>
      }},
      {title: '统计类型', dataIndex: 'type', width: 100, align: FixedTpye.center, render:(text: any,record: any, index: any)=> {
        return  <div title={text}>
          {record.config.type}
        </div>
      }},
      {title: '城市', dataIndex: 'city', align: FixedTpye.center, width: 180, render:(text: any,record: any, index: any)=> {
        return  <div title={text}>{record.province} {record.city}</div>
      }},
      {title: '访问时间', dataIndex: 'createTime',width: 220, render:(text: any,record: any, index: any)=> {
        return  <div>{moment(+record.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
      }},
      {title: '访问者', dataIndex: 'visitor', width: 320, render:(text: any,record: any, index: any)=> {
        let visitor = '暂无';
        if (!!record.visitor && (record.visitor === 'undefined' || record.visitor === 'null')) {
          visitor = '暂无';
        } else {
          visitor = record.visitor;
        }
        return  <div title={visitor}>
          {visitor}
        </div>
      }},
      // {dataIndex: 'operation', width: 100, render:(text: number | string | boolean, record: object, index: number)=> {
      //   return <div>
      //     操作
      //   </div>
      // }, title: '操作'}
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
    // 加载城市信息
    this.loadCityInfo();
  }
  public async loadCityInfo() {
    const res = await fetchData({}, `${APISERVER}/api2/city/list`, {
      method: 'GET'
    });
    if (res.stutasCode === 200) {
      let tempList: any[] = [];
      for (const iterator of res.result) {
        tempList = [...tempList, ...iterator.districts]
      }
      this.setState({
        cityList: tempList
      });
    }
  }
  public async loadList(pageSize: number | string, currentPage: number | string) {
    this.setState({
      loading: true
    });
    const res = await fetchData( {
      limit: pageSize,
      cursor: currentPage,
      params: JSON.stringify(this.extraData)
    }, `/api-wisdom/statistics/list`, {
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
      times?: number[],
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
      data.times = [params.time[0].valueOf(), params.time[1].valueOf()];
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
    const { column, loading, list, cityList } = this.state;
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
      rowKey    : (record: any, index: number) => {
        return (index + '')
      },
    };
    return <div className="page statistics-list">
      <ContentHeader title="页面统计" />
      <FormField>
        <NewStatisticsFilter cityList={cityList} onSubmit={this.onSubmit} onReset={this.onReset}/>
      </FormField>
      <FormField>
        <Table scroll={{x:1420}} {...tableProps} />
      </FormField>
    </div>;
  }
}
export default StatisticsList;