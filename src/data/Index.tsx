import * as React from 'react';
import { ChartCard } from 'ant-design-pro/lib/Charts';
import FormField from "../components/FormField";
// import { Bar } from 'ant-design-pro/lib/Charts';
import { Row, Tooltip, Icon, Col } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip as Tooltip2,
  Legend,
  Label,
} from "bizcharts";
// const { RangePicker } = DatePicker;
// import { fetchData } from "../util/request";
// const Option = Select.Option;
import * as numeral from 'numeral';
// import * as moment from 'moment';
import './Index.less';

class Index extends React.Component<any, any> {
  public state = {
    customerCount: 454530,
    customerCount2: 454530,
    customerCount3: 4632,
    customerCount4: 3730,
    customerCount5: 5
  }
  constructor(props: any) {
    super(props);
   
  }
  // public async componentDidMount() {
    
  // }
  

  public render() {
    const {
      customerCount,
      customerCount2,
      customerCount3,
      customerCount4,
      customerCount5
    } = this.state;
    const data = [{
      category: '品牌总用户',
      sold: customerCount
    }, {
      category: '触达用户',
      sold: customerCount2
    }, {
      category: '兴趣用户',
      sold: customerCount3
    }, {
      category: '转化用户',
      sold: customerCount4
    }, {
      category: '忠诚用户',
      sold: customerCount5
    }];
    const scale = {
      sold: {
        type: 'linear',
        min: 0,
        max: Math.max(customerCount, customerCount2, customerCount3, customerCount4, customerCount5) 
      }
    };
    const handleAlwaysShowTooltip = (ev: any) => {
      ev.showTooltip(ev.getXY(data[3]));
    };
    return (<div className="index">
      <Row className="flex flex-wrap form-field-item2">
        <FormField className="flex-1">
          <ChartCard
            title="品牌总用户"
            total={<span className='tip' dangerouslySetInnerHTML={{ __html: numeral(customerCount || 0).format('0,0') }} />}
            contentHeight={134}
            action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
          />
        </FormField>
        <FormField className="flex-1">
          <ChartCard
            title="触达用户"
            total={<span className='tip' dangerouslySetInnerHTML={{ __html: numeral(customerCount2 || 0).format('0,0') }} />}
            contentHeight={134}
            action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
          />
        </FormField>
        <FormField className="flex-1">
          <ChartCard
            title="兴趣用户"
            total={<span className='tip' dangerouslySetInnerHTML={{ __html: numeral(customerCount3 || 0).format('0,0') }} />}
            contentHeight={134}
            action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
          />
        </FormField>
        <FormField className="flex-1">
          <ChartCard
            title="转化用户"
            total={<span className='tip' dangerouslySetInnerHTML={{ __html: numeral(customerCount4 || 0).format('0,0') }} />}
            contentHeight={134}
            action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
          />
        </FormField>
        <FormField className="flex-1">
          <ChartCard
            title="忠诚用户"
            total={<span className='tip' dangerouslySetInnerHTML={{ __html: numeral(customerCount5 || 0).format('0,0') }} />}
            contentHeight={134}
            action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
          />
        </FormField>
      </Row>
      <FormField className="form-item form-field-item">
        <Row className="boder-bottom">
          进店人群画像
        </Row>
        <Row>
          <Col span={24}>
            <Chart forceFit={true} height={400} data={data} scale={scale} onGetG2Instance={handleAlwaysShowTooltip}>
              <Axis name='category' />
              <Tooltip2 />
              <Legend />
              <Geom type='interval' position='category*sold' color='category'>
                <Label labelLine={{
                  lineWidth: 10,
                  stroke: '#ff8800',
                  lineDash: [2, 1] // 虚线样式
                }} />
              </Geom>
            </Chart>
          </Col>
        </Row>
      </FormField>
    </div>)
  }
}

export default Index;
