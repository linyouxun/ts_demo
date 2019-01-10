import * as React from 'react';
import './CommonStatisticsList.less';
import { Spin, Table } from 'antd';
import CChinaMap from '../components/CChinaMap';
import CommonStatisticsFilter from './components/CommonStatisticsFilter';
import FormField from "../components/FormField";
import ContentHeader from "../components/ContentHeader";
import { fetchData } from "../util/request";
import { APISERVER } from '../util/const';



class CommonStatisticsList extends React.Component<any, any> {
  public extraData: any = {

  };

  public column:any = [
    {title: '省', dataIndex: 'province', render:(text: any,record: any, index: any)=> {
      return !!text ? text : '未知省'
    }},
    {title: '访问量', dataIndex: 'sum'},
  ]

  public state = {
    loading: false,
    cityData: []
  }

  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  public componentDidMount() {
    this.loadList();
  }

  public onSubmit(params: any) {
    if (!!params.time && params.time.length > 0) {
      this.extraData.time = [+params.time[0], +params.time[1]];
    }
    if (!!params.title) {
      this.extraData.title = params.title;
    }
    this.loadList();
  }
  public onReset() {
    this.extraData = {};
    this.loadList();
  }

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
        cityData: res.result.list || []
      });
    }
  }


  public render(): JSX.Element {
    const pagination: any = false;
    const { loading, cityData } = this.state;
    const tableProps = {
      bordered  : false,
      columns   : this.column,
      dataSource: cityData,
      pagination,
      rowKey    : (record: any, index: number) => {
        return (index + '')
      },
    };
    return <div className="page common-statistics-list">
      <ContentHeader title="通用统计" />
      <FormField>
        <CommonStatisticsFilter onSubmit={this.onSubmit} onReset={this.onReset}/>
      </FormField>
      <FormField>
        <Spin spinning={loading}>
          <div className="flex">
            <div className="china-map">
              <CChinaMap cityData={cityData} />
            </div>
            <div className="flex-1"/>
            <div className="china-map-list">
              <Table scroll={{y: 320}} {...tableProps} />
            </div>
          </div>
        </Spin>
      </FormField>
    </div>
  }
}
export default CommonStatisticsList;
