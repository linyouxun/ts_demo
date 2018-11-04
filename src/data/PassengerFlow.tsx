import * as React from 'react';
import { Button, DatePicker, Cascader, Row, Spin, Col, Radio} from 'antd';
// import { message, Select, Button, DatePicker, Table, Modal, Cascader} from 'antd';
import FormField from "../components/FormField";
const { RangePicker } = DatePicker;
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import * as moment from 'moment';
// import { fetchData, fetchDataList } from "../util/request";
import { cityList } from '../util/city';
import './PassengerFlow.less';

class PassengerFlow extends React.Component<any, any> {
  public state = {
    from_date: moment({hour:0,minute:0,second:0,millisecond: 0}), // 搜索开始时间
    to_date: moment({hour:23,minute:59,second:59,millisecond: 0}), // 搜索结束时间
    loading: false,
    list: [],
    area: [],
    dateType: 'hour'
  }
  constructor(props: any) {
    super(props);
    this.handlePickDateChange = this.handlePickDateChange.bind(this);
    this.searchBtn = this.searchBtn.bind(this);
    this.cityListSelect = this.cityListSelect.bind(this);
    this.exportBtn = this.exportBtn.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
  }
  public handlePickDateChange(value: any, mode: any) {
    this.setState({
      from_date: value[0].clone().set({hour:0,minute:0,second:0,millisecond: 0}),
      to_date: value[1].clone().set({hour:23,minute:59,second:59,millisecond: 0}),
    });
  }
  public handleSizeChange(e: any) {
    const { from_date, to_date, area } = this.state;
    const type = e.target.value;
    this.setState({
      dateType: type
    });
    this.loadList(from_date, to_date, area, type);
  }
  public searchBtn() {
    const { from_date, to_date, area, dateType } = this.state;
    this.loadList(from_date, to_date, area, dateType);
  }
  public componentDidMount() {
    const { from_date, to_date, area, dateType } = this.state;
    this.loadList(from_date, to_date, area, dateType);
  }

  public async loadList(fromDate: any, toDate: any, area: any, dateType: any) {
    this.setState({
      loading: true
    });
    const list = await new Promise((resolve: any, reject: any) => {
      setTimeout(() => {
        resolve([{"x":"00:00","进店客流":0,"去重客流":0},{"x":"01:00","进店客流":0,"去重客流":0},{"x":"02:00","进店客流":0,"去重客流":0},{"x":"03:00","进店客流":0,"去重客流":0},{"x":"04:00","进店客流":0,"去重客流":0},{"x":"05:00","进店客流":0,"去重客流":0},{"x":"06:00","进店客流":0,"去重客流":0},{"x":"07:00","进店客流":0,"去重客流":0},{"x":"08:00","进店客流":0,"去重客流":0},{"x":"09:00","进店客流":3,"去重客流":3},{"x":"10:00","进店客流":0,"去重客流":0},{"x":"11:00","进店客流":8,"去重客流":8},{"x":"12:00","进店客流":11,"去重客流":11},{"x":"13:00","进店客流":13,"去重客流":12},{"x":"14:00","进店客流":14,"去重客流":14},{"x":"15:00","进店客流":23,"去重客流":19},{"x":"16:00","进店客流":8,"去重客流":8},{"x":"17:00","进店客流":2,"去重客流":2},{"x":"18:00","进店客流":8,"去重客流":8},{"x":"19:00","进店客流":1,"去重客流":1},{"x":"20:00","进店客流":4,"去重客流":4},{"x":"21:00","进店客流":0,"去重客流":0},{"x":"22:00","进店客流":0,"去重客流":0},{"x":"23:00","进店客流":0,"去重客流":0}]);
      }, 2000);
    })
    this.setState({
      loading: false
    });
    this.setState({
      list
    });
  }

  public cityListSelect(value: any) {
    this.setState({
      area: value
    });
  }

  public disabledDate(current: any) {
    return current > moment().endOf('day');
  }
  public exportBtn() {
    console.log('exportBtn')
  }

  public render() {
    const {
      from_date,
      to_date,
      list,
      loading,
      dateType
    } = this.state;
    const ds = new window.DataSet();
    const dv = ds.createView().source(list);
    dv.transform({
      type: "fold",
      fields: ["进店客流", "去重客流"],
      key: "city",
      value: "temperature" // value字段
    });
    const cols = {
      x: {
        range: [0, 1]
      }
    };
    return (<div className="passenger-flow">
      <FormField className="form-item">
        <Cascader className="padding" placeholder="请选择地区" style={{ width: '400px' }} options={cityList} onChange={this.cityListSelect}/>
        <RangePicker
          allowClear={false}
          disabledDate={this.disabledDate}
          onChange={this.handlePickDateChange}
          value={[from_date, to_date]}
          className="padding"
        />
        <Button className="padding" onClick={this.searchBtn} type="primary">搜索</Button>
        <Button className="padding" onClick={this.exportBtn} >导出</Button>
      </FormField>
      <FormField className="form-item2">
        <Row className="boder-bottom">
          客流趋势图
          <div className='float-right padding-right'>
            <Radio.Group value={dateType} className="padding" onChange={this.handleSizeChange}>
              <Radio.Button value="hour">小时</Radio.Button>
              <Radio.Button value="day">日</Radio.Button>
              <Radio.Button value="week">周</Radio.Button>
              <Radio.Button value="month">月</Radio.Button>
            </Radio.Group>
          </div>
        </Row>
        <Row>
          <Spin spinning={loading}>
            {
              list.length > 0 ? <Col span={24}>
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

export default PassengerFlow;
