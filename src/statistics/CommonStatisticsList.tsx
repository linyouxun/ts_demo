import * as React from 'react';
import './CommonStatisticsList.less';
import { Spin, Table } from 'antd';
import CChinaMap from '../components/CChinaMap';
import CommonStatisticsFilter from './components/CommonStatisticsFilter';
import FormField from "../components/FormField";
import ContentHeader from "../components/ContentHeader";
import { fetchData } from "../util/request";
import { APISERVER } from '../util/const';
import * as moment from 'moment';
import {
  Chart,
  Geom,
  Axis,
  Legend,
  Tooltip
} from "bizcharts";



class CommonStatisticsList extends React.Component<any, any> {
  public extraData: any = {

  };

  public column:any = [
    {title: '省份', dataIndex: 'province', render:(text: any,record: any, index: any)=> {
      return !!text ? text : '未知省份'
    }},
    {title: '投放页面访问量(次数)', dataIndex: 'sum'},
  ]

  public state = {
    fromDate: moment({hour:0,minute:0,second:0,millisecond: 0}), // 搜索开始时间
    toDate: moment({hour:23,minute:59,second:59,millisecond: 0}), // 搜索结束时间
    loading: false,
    loading2: false,
    totalSum: 0,
    cityData: [],
    timeData: [],
    totalTimeSum: 0
  }

  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  public componentDidMount() {
    // 设置时间
    const { fromDate, toDate } = this.state;
    this.extraData.time = [+fromDate, +toDate];
    this.loadList();
    this.loadTimeList();
  }

  public onSubmit(params: any) {
    if (!!params.time && params.time.length > 0) {
      this.extraData.time = [+params.time[0], +params.time[1]];
    }
    if (!!params.title) {
      this.extraData.title = params.title;
    }
    this.loadList();
    this.loadTimeList();
  }
  public onReset() {
    this.extraData = {};
    this.loadList();
    this.loadTimeList();
  }

  /**
   * 拉去每个省访问数据
   * @param value 暂无
   */
  public async loadList(value: string = '') {
    const params: any = {};
    if (!!this.extraData.time && this.extraData.time.length > 0) {
      params.time = this.extraData.time;
    }
    if (!!this.extraData.title) {
      params.configIds = this.extraData.title.map((item: any) => {
        return item.key
      })
    }
    this.setState({
      loading: true
    })
    const res = await fetchData( {
      extraData: JSON.stringify(params)
    }, `${APISERVER}/api2/statistics/aggregateCount`, {
      method: 'GET'
    });
    // const res = {"code":200,"stutasCode":200,"result":{"list":[{"province":"广东省","adcode":"440100","sum":147584},{"province":"北京市","adcode":"110000","sum":66138},{"province":"上海市","adcode":"310000","sum":37026},{"province":"天津市","adcode":"120000","sum":27016},{"province":"香港特别行政区","adcode":"810000","sum":24711},{"province":"","adcode":"","sum":18698},{"province":"浙江省","adcode":"330200","sum":9504},{"province":"河南省","adcode":"411600","sum":8816},{"province":"江苏省","adcode":"320100","sum":7571},{"province":"贵州省","adcode":"520100","sum":5761},{"province":"河北省","adcode":"130000","sum":5721},{"province":"四川省","adcode":"510100","sum":5229},{"province":"山东省","adcode":"371300","sum":4426},{"province":"安徽省","adcode":"340100","sum":3587},{"province":"湖南省","adcode":"430000","sum":3214},{"province":"福建省","adcode":"350300","sum":2856},{"province":"辽宁省","adcode":"211100","sum":2839},{"province":"湖北省","adcode":"420100","sum":2644},{"province":"重庆市","adcode":"500000","sum":2194},{"province":"黑龙江省","adcode":"230100","sum":2072},{"province":"广西壮族自治区","adcode":"450400","sum":1973},{"province":"江西省","adcode":"360500","sum":1913},{"province":"内蒙古自治区","adcode":"150600","sum":1605},{"province":"陕西省","adcode":"610600","sum":1503},{"province":"云南省","adcode":"530000","sum":1180},{"province":"山西省","adcode":"140800","sum":1052},{"province":"吉林省","adcode":"220100","sum":756},{"province":"甘肃省","adcode":"620000","sum":533},{"province":"海南省","adcode":"460100","sum":431},{"province":"宁夏回族自治区","adcode":"640000","sum":282},{"province":"新疆维吾尔自治区","adcode":"650100","sum":251},{"province":"青海省","adcode":"630000","sum":178},{"province":"台湾省","adcode":"710000","sum":24},{"province":"西藏自治区","adcode":"540100","sum":11}],"total":34,"totalSum":399299},"message":"success"};
    this.setState({
      loading: false
    })
    if (res.stutasCode === 200) {
      this.setState({
        cityData: res.result.list || [],
        totalSum: res.result.totalSum || 0
      });
    }
  }

  /**
   * 拉去每个时段信息
   * @param value 暂无
   */
  public async loadTimeList(value: string = '') {

    const params: any = {};
    if (!!this.extraData.time && this.extraData.time.length > 0) {
      params.time = this.extraData.time;
    }
    if (!!this.extraData.title) {
      params.configIds = this.extraData.title.map((item: any) => {
        return item.key
      })
    }
    this.setState({
      loading2: true
    })
    const res = await fetchData( {
      extraData: JSON.stringify(params)
    }, `${APISERVER}/api2/statistics/aggregateCountTime`, {
      method: 'GET'
    });
    // const res = {"code":200,"stutasCode":200,"result":{"total":144,"list":[{"time":"2019-01-24 00:00:00","value":0},{"time":"2019-01-24 00:10:00","value":0},{"time":"2019-01-24 00:20:00","value":0},{"time":"2019-01-24 00:30:00","value":0},{"time":"2019-01-24 00:40:00","value":0},{"time":"2019-01-24 00:50:00","value":0},{"time":"2019-01-24 01:00:00","value":0},{"time":"2019-01-24 01:10:00","value":0},{"time":"2019-01-24 01:20:00","value":0},{"time":"2019-01-24 01:30:00","value":0},{"time":"2019-01-24 01:40:00","value":0},{"time":"2019-01-24 01:50:00","value":0},{"time":"2019-01-24 02:00:00","value":0},{"time":"2019-01-24 02:10:00","value":0},{"time":"2019-01-24 02:20:00","value":0},{"time":"2019-01-24 02:30:00","value":0},{"time":"2019-01-24 02:40:00","value":0},{"time":"2019-01-24 02:50:00","value":0},{"time":"2019-01-24 03:00:00","value":0},{"time":"2019-01-24 03:10:00","value":0},{"time":"2019-01-24 03:20:00","value":0},{"time":"2019-01-24 03:30:00","value":0},{"time":"2019-01-24 03:40:00","value":0},{"time":"2019-01-24 03:50:00","value":0},{"time":"2019-01-24 04:00:00","value":0},{"time":"2019-01-24 04:10:00","value":0},{"time":"2019-01-24 04:20:00","value":0},{"time":"2019-01-24 04:30:00","value":0},{"time":"2019-01-24 04:40:00","value":0},{"time":"2019-01-24 04:50:00","value":0},{"time":"2019-01-24 05:00:00","value":0},{"time":"2019-01-24 05:10:00","value":0},{"time":"2019-01-24 05:20:00","value":0},{"time":"2019-01-24 05:30:00","value":0},{"time":"2019-01-24 05:40:00","value":0},{"time":"2019-01-24 05:50:00","value":0},{"time":"2019-01-24 06:00:00","value":0},{"time":"2019-01-24 06:10:00","value":0},{"time":"2019-01-24 06:20:00","value":0},{"time":"2019-01-24 06:30:00","value":0},{"time":"2019-01-24 06:40:00","value":0},{"time":"2019-01-24 06:50:00","value":0},{"time":"2019-01-24 07:00:00","value":0},{"time":"2019-01-24 07:10:00","value":0},{"time":"2019-01-24 07:20:00","value":0},{"time":"2019-01-24 07:30:00","value":0},{"time":"2019-01-24 07:40:00","value":0},{"time":"2019-01-24 07:50:00","value":0},{"time":"2019-01-24 08:00:00","value":0},{"time":"2019-01-24 08:10:00","value":0},{"time":"2019-01-24 08:20:00","value":0},{"time":"2019-01-24 08:30:00","value":0},{"time":"2019-01-24 08:40:00","value":0},{"time":"2019-01-24 08:50:00","value":0},{"time":"2019-01-24 09:00:00","value":0},{"time":"2019-01-24 09:10:00","value":0},{"time":"2019-01-24 09:20:00","value":0},{"time":"2019-01-24 09:30:00","value":0},{"time":"2019-01-24 09:40:00","value":0},{"time":"2019-01-24 09:50:00","value":0},{"time":"2019-01-24 10:00:00","value":0},{"time":"2019-01-24 10:10:00","value":0},{"time":"2019-01-24 10:20:00","value":0},{"time":"2019-01-24 10:30:00","value":0},{"time":"2019-01-24 10:40:00","value":0},{"time":"2019-01-24 10:50:00","value":0},{"time":"2019-01-24 11:00:00","value":0},{"time":"2019-01-24 11:10:00","value":0},{"time":"2019-01-24 11:20:00","value":0},{"time":"2019-01-24 11:30:00","value":0},{"time":"2019-01-24 11:40:00","value":0},{"time":"2019-01-24 11:50:00","value":0},{"time":"2019-01-24 12:00:00","value":0},{"time":"2019-01-24 12:10:00","value":0},{"time":"2019-01-24 12:20:00","value":0},{"time":"2019-01-24 12:30:00","value":0},{"time":"2019-01-24 12:40:00","value":0},{"time":"2019-01-24 12:50:00","value":0},{"time":"2019-01-24 13:00:00","value":0},{"time":"2019-01-24 13:10:00","value":0},{"time":"2019-01-24 13:20:00","value":0},{"time":"2019-01-24 13:30:00","value":0},{"time":"2019-01-24 13:40:00","value":0},{"time":"2019-01-24 13:50:00","value":0},{"time":"2019-01-24 14:00:00","value":0},{"time":"2019-01-24 14:10:00","value":0},{"time":"2019-01-24 14:20:00","value":0},{"time":"2019-01-24 14:30:00","value":0},{"time":"2019-01-24 14:40:00","value":0},{"time":"2019-01-24 14:50:00","value":0},{"time":"2019-01-24 15:00:00","value":0},{"time":"2019-01-24 15:10:00","value":0},{"time":"2019-01-24 15:20:00","value":0},{"time":"2019-01-24 15:30:00","value":0},{"time":"2019-01-24 15:40:00","value":0},{"time":"2019-01-24 15:50:00","value":0},{"time":"2019-01-24 16:00:00","value":0},{"time":"2019-01-24 16:10:00","value":0},{"time":"2019-01-24 16:20:00","value":0},{"time":"2019-01-24 16:30:00","value":0},{"time":"2019-01-24 16:40:00","value":0},{"time":"2019-01-24 16:50:00","value":0},{"time":"2019-01-24 17:00:00","value":0},{"time":"2019-01-24 17:10:00","value":0},{"time":"2019-01-24 17:20:00","value":0},{"time":"2019-01-24 17:30:00","value":0},{"time":"2019-01-24 17:40:00","value":0},{"time":"2019-01-24 17:50:00","value":0},{"time":"2019-01-24 18:00:00","value":0},{"time":"2019-01-24 18:10:00","value":0},{"time":"2019-01-24 18:20:00","value":0},{"time":"2019-01-24 18:30:00","value":0},{"time":"2019-01-24 18:40:00","value":0},{"time":"2019-01-24 18:50:00","value":0},{"time":"2019-01-24 19:00:00","value":0},{"time":"2019-01-24 19:10:00","value":0},{"time":"2019-01-24 19:20:00","value":0},{"time":"2019-01-24 19:30:00","value":0},{"time":"2019-01-24 19:40:00","value":0},{"time":"2019-01-24 19:50:00","value":0},{"time":"2019-01-24 20:00:00","value":0},{"time":"2019-01-24 20:10:00","value":0},{"time":"2019-01-24 20:20:00","value":0},{"time":"2019-01-24 20:30:00","value":0},{"time":"2019-01-24 20:40:00","value":0},{"time":"2019-01-24 20:50:00","value":0},{"time":"2019-01-24 21:00:00","value":0},{"time":"2019-01-24 21:10:00","value":0},{"time":"2019-01-24 21:20:00","value":0},{"time":"2019-01-24 21:30:00","value":0},{"time":"2019-01-24 21:40:00","value":0},{"time":"2019-01-24 21:50:00","value":0},{"time":"2019-01-24 22:00:00","value":0},{"time":"2019-01-24 22:10:00","value":0},{"time":"2019-01-24 22:20:00","value":0},{"time":"2019-01-24 22:30:00","value":0},{"time":"2019-01-24 22:40:00","value":0},{"time":"2019-01-24 22:50:00","value":0},{"time":"2019-01-24 23:00:00","value":0},{"time":"2019-01-24 23:10:00","value":0},{"time":"2019-01-24 23:20:00","value":0},{"time":"2019-01-24 23:30:00","value":0},{"time":"2019-01-24 23:40:00","value":0},{"time":"2019-01-24 23:50:00","value":0}],"totalSum":0},"message":"success"};
    // const res = {"code":200,"stutasCode":200,"result":{"list":[{"province":"广东省","adcode":"440100","sum":147584},{"province":"北京市","adcode":"110000","sum":66138},{"province":"上海市","adcode":"310000","sum":37026},{"province":"天津市","adcode":"120000","sum":27016},{"province":"香港特别行政区","adcode":"810000","sum":24711},{"province":"","adcode":"","sum":18698},{"province":"浙江省","adcode":"330200","sum":9504},{"province":"河南省","adcode":"411600","sum":8816},{"province":"江苏省","adcode":"320100","sum":7571},{"province":"贵州省","adcode":"520100","sum":5761},{"province":"河北省","adcode":"130000","sum":5721},{"province":"四川省","adcode":"510100","sum":5229},{"province":"山东省","adcode":"371300","sum":4426},{"province":"安徽省","adcode":"340100","sum":3587},{"province":"湖南省","adcode":"430000","sum":3214},{"province":"福建省","adcode":"350300","sum":2856},{"province":"辽宁省","adcode":"211100","sum":2839},{"province":"湖北省","adcode":"420100","sum":2644},{"province":"重庆市","adcode":"500000","sum":2194},{"province":"黑龙江省","adcode":"230100","sum":2072},{"province":"广西壮族自治区","adcode":"450400","sum":1973},{"province":"江西省","adcode":"360500","sum":1913},{"province":"内蒙古自治区","adcode":"150600","sum":1605},{"province":"陕西省","adcode":"610600","sum":1503},{"province":"云南省","adcode":"530000","sum":1180},{"province":"山西省","adcode":"140800","sum":1052},{"province":"吉林省","adcode":"220100","sum":756},{"province":"甘肃省","adcode":"620000","sum":533},{"province":"海南省","adcode":"460100","sum":431},{"province":"宁夏回族自治区","adcode":"640000","sum":282},{"province":"新疆维吾尔自治区","adcode":"650100","sum":251},{"province":"青海省","adcode":"630000","sum":178},{"province":"台湾省","adcode":"710000","sum":24},{"province":"西藏自治区","adcode":"540100","sum":11}],"total":34,"totalSum":399299},"message":"success"};
    this.setState({
      loading2: false
    })
    if (res.stutasCode === 200) {
      this.setState({
        timeData: res.result.list || [],
        totalTimeSum: res.result.totalSum || 0
      });
    }
    console.log(res);
  }


  public render(): JSX.Element {
    const pagination: any = false;
    const { loading, loading2, cityData, totalSum, timeData } = this.state;
    const tableProps = {
      bordered  : false,
      columns   : this.column,
      dataSource: totalSum > 0 ? [{
        province: '省份总计',
        sum: totalSum
      }, ...cityData] : [],
      pagination,
      locale: {
        filterTitle: '筛选',
        filterConfirm: '确定',
        filterReset: '重置',
        emptyText: '暂无数据',
      },
      rowKey    : (record: any, index: number) => {
        return (index + '')
      },
    };
    const ticks: any = [];
    const ds = new window.DataSet();
    const dv = ds.createView().source(timeData);
    dv.transform({
      type: 'rename',
      map: {
        value: '页面访问量' // row.xxx 会被替换成 row.yyy
      }
    });
    dv.transform({
      type: 'map',
      callback(row: any, index: any) { // 加工数据后返回新的一行，默认返回行数据本身
        row.time = row.time.split(' ')[1];
        if (index % 6 === 0) {
          ticks.push(row.time);
        }
        return row;
      }
    });
    dv.transform({
      type: "fold",
      fields: ["页面访问量"],
      // 展开字段集
      key: "time2",
      // key字段
      value: "time2str" // value字段
    });
    const cols = {
      // month: {
      //   range: [0, 1]
      // },
      time2str: {
        alias: '次数'
      },
      time: {
        alias: '时间',
        range: [0, 1],
        ticks,
      },
    }

    return <div className="page common-statistics-list">
      <Spin spinning={loading && loading2}>
        <ContentHeader title="通用统计" />
        <FormField>
          <CommonStatisticsFilter onSubmit={this.onSubmit} onReset={this.onReset}/>
        </FormField>
        <FormField
          header={{
            title: '时间访问量'
          }}>
          <Chart height={400} data={dv} forceFit={true} scale={cols}>
            <Legend />
            <Axis name="time" subTickCount={3} title={{
              autoRotate: false,
              position: 'end',
              offset: -8,
            }}/>
            <Axis name="time2str" label={{formatter: val => `${val}`}} title={{
              autoRotate: false,
              position: 'end',
            }}/>
            <Tooltip crosshairs={{type : "y"}}/>
            <Geom type="line" position="time*time2str" color={'time2'} size={2}/>
          </Chart>
        </FormField>
        <FormField
          header={{
            title: '区域访问量'
          }}>
            <div className="flex">
              <div className="china-map">
                <CChinaMap cityData={cityData} />
              </div>
              <div className="flex-1"/>
              <div className="china-map-list">
                <Table scroll={{y: 320}} {...tableProps} />
              </div>
            </div>
        </FormField>
      </Spin>
    </div>
  }
}
export default CommonStatisticsList;
