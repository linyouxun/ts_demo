import * as React from 'react';
import { Pie } from 'ant-design-pro/lib/Charts';
import { Row, Col, message, Select, Radio, Button, DatePicker, Spin} from 'antd';
import FormField from "../../components/FormField";
const Option = Select.Option;
const { RangePicker } = DatePicker;
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import * as moment from 'moment';
import { fetchData } from "../../util/request";
import { ymToken } from '../../util/const';
import './DataReport.less';

class DataReport extends React.Component<any, any> {
  public state = {
    shops: [], // 商店
    shopId: 0, // 商店ID
    from_date: moment({hour:0,minute:0,second:0,millisecond: 0}), // 搜索开始时间
    to_date: moment({hour:23,minute:59,second:59,millisecond: 0}), // 搜索结束时间
    memberList: [],
    memberReachList: [],
    dateType: 'hour',
    loading: false,
    loading2: false
  }
  constructor(props: any) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handlePickDateChange = this.handlePickDateChange.bind(this);
    this.searchBtn = this.searchBtn.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
  }
  public handleSelectChange(value: any) {
    this.setState({
      shopId: value
    });
  }
  public handlePickDateChange(value: any, mode: any) {
    this.setState({
      from_date: value[0].clone().set({hour:0,minute:0,second:0,millisecond: 0}),
      to_date: value[1].clone().set({hour:23,minute:59,second:59,millisecond: 0}),
    });
  }
  public searchBtn() {
    const {shopId, from_date, to_date, dateType} = this.state;
    // 会员到店分析
    this.groupByEventFun(shopId, from_date, to_date, dateType);
  }
  public handleSizeChange(e: any) {
    const type = e.target.value;
    this.setState({
      dateType: type
    })
  }
  public componentDidMount() {
    const {shopId, from_date, to_date, dateType} = this.state;
    // 获取门店
    this.shopsFun();
    // 会员占比环形图
    this.customerGroupFun(shopId);
    // 会员到店分析
    this.groupByEventFun(shopId, from_date, to_date, dateType);
  }
  // 获取门店
  public async shopsFun() {
    const res: any = await fetchData({return: 'all_list'}, '/v1/api/company/shops', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + ymToken
      }
    })
    if(res.length > 0) {
      this.setState({
        shops: res
      })
    }
  }
  // 会员占比环形图
  public async customerGroupFun(shopId: any) {
    this.setState({
      loading: true
    });
    const res: any = await fetchData({shop_id: shopId}, '/v1/api/company/reports/group_by_customer_group', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + ymToken
      }
    })
    this.setState({
      loading: false
    });
    if (!!res && !!res.errors) {
      if (!!res.errors[0]) {
        message.error(res.errors[0].detail);
      } else {
        message.error('会员占比环形图拉取出错');
      }
    } else {
      if(res.data.length > 0) {
        this.setState({
          memberList: res.data.map((item: any) => {
            return {
              x: item.name,
              y: item.value
            }
          })
        })
      }
    }
  }
  // 会员到店分析
  public async groupByEventFun(shopId: any, fromDate: any, toDate: any, dateType: any) {
    this.setState({
      loading2: true
    });
    let moreOneDay = false;
    if (+toDate - fromDate > 24 * 60 * 60 * 1000) {
      moreOneDay = true;
    }
    const res: any = await fetchData({
      shop_id: shopId,
      period: dateType,
      return: 'all_list',
      from_date: Math.ceil(+fromDate / 1000),
      to_date: Math.ceil(+toDate / 1000),
      sort_by:'asc',
    }, '/v1/api/company/reports/group_by_event', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + ymToken
      }
    })
    this.setState({
      loading2: false
    });
    if (!!res && !!res.errors) {
      if (!!res.errors[0]) {
        message.error(res.errors[0].detail);
      } else {
        message.error('会员到点分析拉取出错');
      }
    } else {
      if(res.data.length > 0) {
        this.setState({
          memberReachList: res.data.map((item: any) => {
            return  {
              x: moment(item.time).format(dateType === 'hour' ? (moreOneDay ? 'MM/DD H时' : 'H时') : 'MM/DD'),
              '进店人数': item.customer_count,
              '会员人数': item.vip_count,
              // '进店人数(男)': item.male_count,
              // '进店人数(女)': item.female_count,
            }
          })
        })
      }
    }
  }

  public pieValueFormat(val: any) {
    return <span dangerouslySetInnerHTML={{ __html: val + ' 位'}} />;
  }
  public pieTotal(salesPieData: any) {
    let sum = 0;
    for (let index = 0; index < salesPieData.length; index++) {
      const element = salesPieData[index];
      sum += element.y
    }
    return <span>{sum}位</span>;
  }

  public disabledDate(current: any) {
    return current > moment().endOf('day');
  }

  public render() {
    const {
      memberList,
      shops,
      from_date,
      to_date,
      memberReachList,
      dateType,
      loading,
      loading2
    } = this.state;
    const selectChildren: any[] = [];
    selectChildren.push(<Option
      key={'0'}
      value={'0'}>
        {'全部门店'}
      </Option>)
    shops.map((item: any) => {
      selectChildren.push(<Option
        key={item.id + ''}
        value={item.id + ''}>
          {item.name}
        </Option>);
    });
    const ds = new window.DataSet();
    const dv = ds.createView().source(memberReachList);
    dv.transform({
      type: "fold",
      fields: ['进店人数', '会员人数'],
      // fields: ['进店人数', '会员人数', '进店人数(男)', '进店人数(女)'],
      key: "city",
      value: "temperature" // value字段
    });
    const cols = {};
    return (<div className="data-report">
      <FormField className="form-item form-field-item">
        <Row className="boder-bottom">
          会员占比环形图
        </Row>
        <Row>
          <Spin spinning={loading}>
            <Col span={16} offset={3}>
              <Pie
                hasLegend={true}
                colors={['#1890ff', '#13c2c2', '#2fc25b', '#facc14', '#f04864', '#8543e0']}
                title=""
                subTitle="会员总数"
                total={this.pieTotal.bind(this, memberList)}
                data={memberList}
                valueFormat={this.pieValueFormat}
                height={300}
              />
            </Col>
          </Spin>
        </Row>
      </FormField>
      <FormField className="form-item form-field-item">
        <Row className="boder-bottom">
          会员到店分析
          <Select
            defaultValue="全部门店"
            className="padding"
            onChange={this.handleSelectChange}
            style={{ width: '240px' }}>
            {selectChildren}
          </Select>
          <RangePicker
            allowClear={false}
            disabledDate={this.disabledDate}
            onChange={this.handlePickDateChange}
            value={[from_date, to_date]}
            className="padding"
          />
          <Button className="padding" onClick={this.searchBtn} type="primary">搜索</Button>
          <Radio.Group value={dateType} className="padding" onChange={this.handleSizeChange}>
            <Radio.Button value="hour">小时</Radio.Button>
            <Radio.Button value="day">日</Radio.Button>
          </Radio.Group>
        </Row>
        <Row>
          <Spin spinning={loading2}>
            {
              memberReachList.length > 0 ? <Col span={24}>
                <Chart height={400} data={dv} scale={cols} forceFit={true}>
                  <Geom
                    type="line"
                    position="x*temperature"
                    size={2}
                    color={"city"}
                  />
                  <Geom
                    type="point"
                    position="x*temperature"
                    size={4}
                    shape={"circle"}
                    color={"city"}
                    style={{
                      stroke: "#fff",
                      lineWidth: 1
                    }}
                  />
                  <Legend />
                  <Axis name="x" />
                  <Axis
                    name="temperature"
                    label={{
                      formatter: val => `${val}`
                    }}
                  />
                  <Tooltip
                    crosshairs={{
                      type: "y"
                    }}
                  />
                </Chart>
              </Col> : ''
            }
          </Spin>
        </Row>
      </FormField>
    </div>)
  }
}

export default DataReport;
