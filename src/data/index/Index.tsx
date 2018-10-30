import * as React from 'react';
import { ChartCard, MiniArea, Pie, yuan, TimelineChart } from 'ant-design-pro/lib/Charts';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import FormField from "../../components/FormField";
import { Row, Col, Tooltip, Icon, Select, DatePicker, Button } from 'antd';
// import {Chart, Axis, Tooltip as Tooltip2, Geom} from "bizcharts";
const { RangePicker } = DatePicker;
import { fetchData } from "../../util/request";
const Option = Select.Option;
import * as numeral from 'numeral';
import * as moment from 'moment';
import './Index.less';

class Index extends React.Component<any, any> {
  public state = {
    visitData: [],
    shops: [],
    shopId: 0,
    from_date: moment(),
    to_date: moment(),
  }
  constructor(props: any) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handlePickDateChange = this.handlePickDateChange.bind(this);
    this.searchBtn = this.searchBtn.bind(this);
  }
  public async componentDidMount() {
    const visitData = [];
    const beginDay = new Date().getTime();
    for (let i = 0; i < 20; i += 1) {
      visitData.push({
        x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('YYYY-MM-DD'),
        y: Math.floor(Math.random() * 100) + 10,
      });
    }
    this.setState({
      visitData
    });
    // 获取门店
    const res: any = await fetchData({return: 'all_list'}, '/v1/api/company/shops', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 887e7f12f869ed11e0f98c0b19c13d4445efbc70'
      }
    })
    if(res.length > 0) {
      this.setState({
        shops: res
      })
    }
    
  }
  public handleSelectChange(value: any) {
    this.setState({
      shopId: value
    });
  }
  public searchBtn() {
    const {shopId, from_date, to_date} = this.state;
    console.log(`search data ${shopId}, ${from_date}, ${to_date}`);
  }
  public handlePickDateChange(value: any, mode: any) {
    if (!!value && value.length > 0) {
      this.setState({
        from_date: value[0],
        to_date: value[1],
      });
    }
  }
  public pieValueFormat(val: any) {
    return <span dangerouslySetInnerHTML={{ __html: yuan(val)}} />;
  }
  public pieTotal(val: any, salesPieData: any) {
    return <span
      dangerouslySetInnerHTML={{
        __html: yuan(salesPieData.reduce((pre: any, now: any) => now.y + pre, 0))
      }}
    />;
  }
  
  public render() {
    const {visitData, shops, from_date, to_date} = this.state;
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
    })
    const salesPieData = [
      {
        x: '家用电器',
        y: 4544,
      },
      {
        x: '食用酒水',
        y: 3321,
      },
      {
        x: '个护健康',
        y: 3113,
      },
      {
        x: '服饰箱包',
        y: 2341,
      },
      {
        x: '母婴产品',
        y: 1231,
      },
      {
        x: '其他',
        y: 1231,
      },
    ];
    const chartData = [];
    for (let i = 0; i < 20; i += 1) {
      chartData.push({
        x: (new Date().getTime()) + (1000 * 60 * 30 * i),
        y1: Math.floor(Math.random() * 100) + 1000,
        y2: Math.floor(Math.random() * 100) + 10,
      });
    }
    return (<div className="index">
    <FormField className="form-item">
      <Select
        defaultValue="全部门店"
        className="padding" 
        onChange={this.handleSelectChange}
        style={{ width: '240px' }}>
        {selectChildren} 
      </Select>
      <RangePicker 
        allowClear={true} 
        onChange={this.handlePickDateChange} 
        value={[from_date, to_date]} 
        className="padding" 
      />
      <Button className="padding" onClick={this.searchBtn}>搜索</Button>
    </FormField>
    <FormField className="form-item form-field-item">
      <Row className="boder-bottom">
        进店人群画像
      </Row>
      <Row>
        <Col span={12}>
          <Pie
            hasLegend={true}
            title="年龄分布图"
            subTitle="进店客流"
            // total={this.pieTotal.bind(salesPieData)}
            data={salesPieData}
            valueFormat={this.pieValueFormat.bind(salesPieData)}
            height={200}
          />
        </Col>
        <Col span={12}>
          <Pie
            colors={['red', 'blue']}
            hasLegend={true}
            title="男女比例环形图"
            subTitle="进店客流"
            // total={() => (
            //   <span
            //     dangerouslySetInnerHTML={{
            //       __html: yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))
            //     }}
            //   />
            // )}
            data={salesPieData}
            valueFormat={this.pieValueFormat.bind(salesPieData)}
            height={200}
          />
        </Col>
      </Row>
      <Row>
      <TimelineChart
        height={200}
        data={chartData}
        titleMap={{ y1: '客流量', y2: '支付笔数' }}
      />
      </Row>
    </FormField>
    <Row>
      <Col span={8}>
        <ChartCard
          title="搜索用户数量"
          total={numeral(8846).format('0,0')}
          contentHeight={134}
          action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
        >
          <NumberInfo
            subTitle={<span>本周访问</span>}
            total={numeral(12321).format('0,0')}
            status="up"
            subTotal={17.1}
          />
          <MiniArea line={true} height={45} data={visitData}
          />
        </ChartCard>
      </Col>
    </Row>
    </div>)
  }
}

export default Index;
