import * as React from 'react';
import { ChartCard, MiniArea } from 'ant-design-pro/lib/Charts';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import FormField from "../../components/FormField";
import { Row, Col, Tooltip, Icon, Select } from 'antd';
import { fetchData } from "../../util/request";
const Option = Select.Option;
import * as numeral from 'numeral';
import * as moment from 'moment';
import './Index.less';

class Index extends React.Component<any, any> {
  public state = {
    visitData: [],
    shops: []
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
  public render() {
    const {visitData, shops} = this.state;
    const selectChildren: any[] = [];
    shops.map((item: any) => {
      selectChildren.push(<Option
        key={item.id + ''}
        value={item.id + ''}>
          {item.name}
        </Option>);
    })
    return (<div className="index">
    <FormField>
      <Select
        style={{ width: '240px' }}>
        {selectChildren}
      </Select>
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
