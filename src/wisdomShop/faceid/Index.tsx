import * as React from 'react';
import { ChartCard, MiniArea, Pie, MiniBar } from 'ant-design-pro/lib/Charts';
import FormField from "../../components/FormField";
import { Bar } from 'ant-design-pro/lib/Charts';
import { Row, Col, Select, DatePicker, Button, Modal, InputNumber, message, Icon, Radio } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
const { RangePicker } = DatePicker;
import { fetchData } from "../../util/request";
const Option = Select.Option;
import * as numeral from 'numeral';
import * as moment from 'moment';
import './Index.less';

class Index extends React.Component<any, any> {
  public state = {
    shops: [], // 商店
    shopId: 0, // 商店ID
    from_date: moment({hour:0,minute:0,second:0,millisecond: 0}), // 搜索开始时间
    to_date: moment({hour:23,minute:59,second:59,millisecond: 0}), // 搜索结束时间
    eventCount: 0, // 访问顾客数
    customerCount: 0, // 访问顾客数(去重)
    vipCount: 0, // 访问VIP顾客数(去重)
    oldEventCount: 0, // 老访问顾客数
    oldCustomerCount: 0, // 老访问顾客数(去重)
    oldVipCount: 0, // 老访问VIP顾客数(去重)
    eventList: [], // 访问顾客列表
    customerList: [], // 访问顾客列表(去重)
    vipList: [], // 访问VIP顾客列表(去重)
    ageList: [], // 访问顾客年龄列表(去重)
    femaleCount: 0, // 访问年龄列表(女)
    maleCount: 0, // 访问年龄列表(男)
    customerDefList: [], // 对比
    menberList: [], // 会员列表
    vitalityIntervalList: [],// 进店间隔
    vitalityFrequencyList: [],// 进店频次
    vitalityRules: {
      frequency: {},
      interval: {}
    },
    modalVisible: false,
    vitalityType: 'interval',
    firstNumber: 0,
    lastNumber: 0,
    tipType: '',
    tipName: '昨天',
  }
  constructor(props: any) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handlePickDateChange = this.handlePickDateChange.bind(this);
    this.searchBtn = this.searchBtn.bind(this);
    this.pieValueFormat = this.pieValueFormat.bind(this);
    this.handleModalOk = this.handleModalOk.bind(this);
    this.handleModalCancel = this.handleModalCancel.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
  }
  public async componentDidMount() {
    const {shopId, from_date, to_date} = this.state;
    // 获取门店
    this.shopsFun();
    // 客流量
    this.groupByEventNewFun(shopId, from_date.clone(), to_date.clone());
    // 昨日客流量
    this.groupByEventOldFun(shopId, from_date.clone(), to_date.clone());
    // 男女列表
    this.groupByEventFun(shopId, from_date.clone(), to_date.clone());
    // 进店顾客
    this.vipRecordsFun(shopId, from_date.clone());
    // 进店频次
    this.vitalityFun(shopId, from_date.clone(), 'frequency');
    // 进店间隔
    this.vitalityFun(shopId, from_date.clone(), 'interval');
    // 获取规则
    this.vitalityRulesFun(shopId, from_date.clone());
  }
  // 获取门店
  public async shopsFun() {
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
  // 客流量
  public async groupByEventNewFun(shopId: any, fromDate: any, toDate: any) {
    const res2: any = await fetchData({
      from_date: Math.ceil(+fromDate / 1000),
      to_date: Math.ceil(+toDate / 1000),
      shop_id: shopId + '',
      return: 'all_list',
      sort_by: 'asc',
      period: fromDate.format('YYYY-MM-DD') === toDate.format('YYYY-MM-DD') ? 'hour' : 'day'
    }, '/v1/api/company/reports/group_by_event', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 887e7f12f869ed11e0f98c0b19c13d4445efbc70'
      }
    })
    if (!!res2 && !!res2.errors) {
      if (!!res2.errors[0]) {
        message.error(res2.errors[0].detail);
      } else {
        message.error('客流量列表拉取出错');
      }
    } else {
      let eventCount = 0;
      let customerCount = 0;
      let vipCount = 0;
      const eventList: any[] = [];
      const customerList: any[] = [];
      const vipList: any[] = [];
      const customerDefList: any[] = [];
      res2.data.map((item: any) => {
        eventCount += +item.event_count || 0;
        customerCount += +item.customer_count || 0;
        vipCount += +item.vip_count || 0;
        const newItem = fromDate.format('YYYY-MM-DD') === toDate.format('YYYY-MM-DD') ? moment(item.time).format('YYYY-MM-DD HH:mm:ss') : moment(item.time).format('YYYY-MM-DD')
        eventList.push({
          x: newItem,
          y: item.event_count,
        })
        customerList.push({
          x: newItem,
          y: item.customer_count,
        })
        vipList.push({
          x: newItem,
          y: item.vip_count,
        })
        customerDefList.push({
          x: moment(item.time).format(fromDate.format('YYYY-MM-DD') === toDate.format('YYYY-MM-DD') ? 'H时' : 'MM/DD'),
          '进店客流': item.event_count,
          '去重客流': item.customer_count,
        })
        return item
      });
      this.setState({
        eventCount,
        customerCount,
        vipCount,
        eventList,
        customerList,
        customerDefList,
        vipList,
      });
    }
  }
  // 昨日客流量
  public async groupByEventOldFun(shopId: any, fromDate: any, toDate: any) {
    const stamptime = toDate - fromDate;
    let params = {
      from_date: Math.ceil(+moment(fromDate - stamptime) / 1000),
      to_date: Math.ceil(+moment(toDate - stamptime) / 1000),
      shop_id: shopId + '',
      return: 'all_count'
    };
    if (stamptime > 704799000) {
      params = {
        from_date: Math.ceil(+moment(fromDate.format('YYYY-MM-DD')).add(-1, 'month') / 1000),
        to_date: Math.ceil(+fromDate / 1000) - 1,
        shop_id: shopId + '',
        return: 'all_count'
      };
    }
    const res3: any = await fetchData(params, '/v1/api/company/reports/group_by_event', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 887e7f12f869ed11e0f98c0b19c13d4445efbc70'
      }
    })
    if (!!res3 && !!res3.errors) {
      if (!!res3.errors[0]) {
        message.error(res3.errors[0].detail);
      } else {
        message.error('昨日客流量拉取出错');
      }
    } else {
      const oldEventCount = res3.data[0].event_count || 0;
      const oldCustomerCount = res3.data[0].customer_count || 0;
      const oldVipCount = res3.data[0].vip_count || 0;
      this.setState({
        oldEventCount,
        oldCustomerCount,
        oldVipCount,
      });
    }
  }
  // 男女列表
  public async groupByEventFun(shopId: any, fromDate: any, toDate: any) {
    const res4: any = await fetchData({
      from_date: Math.ceil(+fromDate / 1000),
      to_date: Math.ceil(+toDate / 1000),
      shop_id: shopId + '',
      return: 'all_count'
    }, '/v1/api/company/reports/group_by_event', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 887e7f12f869ed11e0f98c0b19c13d4445efbc70'
      }
    })
    const ageObj = {
      '20岁以下': 0,
      '20岁到30岁': 0,
      '30岁到40岁': 0,
      '40岁到50岁': 0,
      '50岁以上': 0,
    };
    const ageList = [];
    let femaleCount = 0;
    let maleCount = 0;
    if (!!res4.data && res4.data.length > 0 && typeof res4.data[0].age_count === 'object') {
      const ageCountObj = res4.data[0].age_count;
      for (const key in ageCountObj) {
        if (ageCountObj.hasOwnProperty(key)) {
          const element = this.getSection(key)
          ageObj[element] += ageCountObj[key];
        }
      }
      femaleCount = res4.data[0].female_count;
      maleCount = res4.data[0].male_count;
    }
    for (const key in ageObj) {
      if (ageObj.hasOwnProperty(key)) {
        const element = ageObj[key];
        ageList.push({
          x: key,
          y: element
        });
      }
    }
    this.setState({
      ageList,
      femaleCount,
      maleCount,
    });
  }
  // 进店顾客
  public async vipRecordsFun(shopId: any, fromDate: any) {
    const res5: any = await fetchData({
      since: Math.ceil(+fromDate / 1000),
      shop_id: shopId + '',
      order_by: 'capture_at'
    }, '/v1/api/company/reports/vip_records', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 887e7f12f869ed11e0f98c0b19c13d4445efbc70'
      }
    })
    if (!!res5 && res5.length > 0) {
      this.setState({
        menberList: res5
      })
    }
  }

  // 进店间隔 进店频次
  public async vitalityFun(shopId: any, fromDate: any, type: any) {
    const res7: any = await fetchData({
      since: Math.ceil(+fromDate / 1000),
      shop_id: shopId + '',
      rule_type: type
    }, '/v1/api/company/reports/vitality', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 887e7f12f869ed11e0f98c0b19c13d4445efbc70'
      }
    })
    if (!!res7 && !!res7.errors) {
      if (!!res7.errors[0]) {
        message.error(res7.errors[0].detail);
      } else {
        message.error('进店间隔没有找到，暂时无法生成表格');
      }
    } else if (!!res7 && res7.sections.length > 0) {
      if (type === 'interval') {
        this.setState({
          vitalityIntervalList: res7.sections.map((item: any) => {
            return {
              x: `${item.from}~${item.to}天`,
              y: item.vip_count
            }
          })
        })
      } else {
        this.setState({
          vitalityFrequencyList: res7.sections.map((item: any) => {
            return {
              x: `${item.from}~${item.to}天`,
              y: item.vip_count
            }
          })
        })
      }
    }
  }

  // 获取规则
  public async vitalityRulesFun(shopId: any, fromDate: any) {
    const res8: any = await fetchData({
      since: Math.ceil(+fromDate / 1000),
      shop_id: shopId + '',
    }, '/v1/api/vitality_rules', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 887e7f12f869ed11e0f98c0b19c13d4445efbc70'
      }
    })
    if (!!res8) {
      this.setState({
        vitalityRules: res8
      })
    }
  }

  public async deleteVitalityItem(item: any) {
    const res: any = await fetchData({
    }, `/v1/api/vitality_rules/${item.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer 887e7f12f869ed11e0f98c0b19c13d4445efbc70'
      }
    });
    if (!!res.interval) {
      this.setState({
        vitalityRules: res
      }, () => {
        message.success('删除成功');
      });
    } else if (!!res.errors) {
      if (!!res.errors[0]) {
        message.error(res.errors[0].detail);
      } else {
        message.error('删除失败');
      }
    }
  }


  public async addVitalityItem(key: any) {
    const { firstNumber, lastNumber } = this.state;
    if (+lastNumber <= 0) {
      return message.error('持续时间不能为0~0天');
    }
    const res: any = await fetchData({
      rule_type: key,
      from: firstNumber || 0,
      to: lastNumber || 0,
    }, `/v1/api/vitality_rules`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer 887e7f12f869ed11e0f98c0b19c13d4445efbc70',
        'Content-Type': 'application/json'
      }
    });
    if (!!res.interval) {
      this.setState({
        vitalityRules: res
      }, () => {
        message.success('添加成功');
      });
    } else if (!!res.errors) {
      if (!!res.errors[0]) {
        message.error(res.errors[0].detail);
      } else {
        message.error('添加失败');
      }
    }
  }

  public handleSizeChange(e: any) {
    const type = e.target.value;
    if (type === 'w') {
      const weekOfday = moment().format('E');// 计算今天是这周第几天
      const monday = moment().subtract(+weekOfday - 1, 'days').clone().set({hour:0,minute:0,second:0,millisecond: 0});// 周一日期
      const sunday = moment().subtract(+ weekOfday - 7, 'days').clone().set({hour:23,minute:59,second:59,millisecond: 0});// 周日日期
      this.setState({
        from_date: monday,
        to_date: sunday,
        tipType: '上周'
      })
    } else if (type === 'w2') {
      const weekOfday = moment().format('E');// 计算今天是这周第几天
      const monday = moment().subtract(+weekOfday+7-1, 'days').clone().set({hour:0,minute:0,second:0,millisecond: 0});// 周一日期
      const sunday = moment().subtract(weekOfday, 'days').clone().set({hour:23,minute:59,second:59,millisecond: 0});// 周日日期
      this.setState({
        from_date: monday,
        to_date: sunday,
        tipType: '上上周'
      })
    } else if (type === 'm') {
      const firstDay = moment(moment().subtract('month', 0).format('YYYY-MM') + '-01').clone().set({hour:0,minute:0,second:0,millisecond: 0});// 周一日期
      const lastDay = moment(moment().subtract('month', -1).format('YYYY-MM') + '-01').add('days', -1).clone().set({hour:23,minute:59,second:59,millisecond: 0});// 周日日期
      this.setState({
        from_date: firstDay,
        to_date: lastDay,
        tipType: '上月'
      })
    } else if (type === 'm2') {
      const firstDay = moment(moment().subtract('month', 1).format('YYYY-MM') + '-01').clone().set({hour:0,minute:0,second:0,millisecond: 0});// 周一日期
      const lastDay = moment(moment().subtract('month', 0).format('YYYY-MM') + '-01').add('days', -1).clone().set({hour:23,minute:59,second:59,millisecond: 0});// 周日日期
      this.setState({
        from_date: firstDay,
        to_date: lastDay,
        tipType: '上上月'
      })
    }
  }

  public getSection(age: any) {
    if(age < 20) {
      return '20岁以下';
    }
    if(age < 30) {
      return '20岁到30岁';
    }
    if(age < 40) {
      return '30岁到40岁';
    }
    if(age < 50) {
      return '40岁到50岁';
    }
    return '50岁以上';
  }
  public handleSelectChange(value: any) {
    this.setState({
      shopId: value
    });
  }
  public searchBtn() {
    const {shopId, from_date, to_date, tipType} = this.state;
    // 客流量
    this.groupByEventNewFun(shopId, from_date.clone(), to_date.clone());
    // 昨日客流量
    this.groupByEventOldFun(shopId, from_date.clone(), to_date.clone());
    // 男女列表
    this.groupByEventFun(shopId, from_date.clone(), to_date.clone());
    // 进店顾客
    this.vipRecordsFun(shopId, from_date.clone());
    // 进店频次
    this.vitalityFun(shopId, from_date.clone(), 'frequency');
    // 进店间隔
    this.vitalityFun(shopId, from_date.clone(), 'interval');
    this.setState({
      tipName: tipType
    });
  }
  public handlePickDateChange(value: any, mode: any) {
    if (!!value && value.length > 0) {
      if (value[0].format('YYYY-MM-DD') === value[1].format('YYYY-MM-DD')) {
        if (value[0].format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
          this.setState({
            from_date: value[0].clone().set({hour:0,minute:0,second:0,millisecond: 0}),
            to_date: value[1].clone().set({hour:23,minute:59,second:59,millisecond: 0}),
            tipType: '昨天'
          });
        } else {
          this.setState({
            from_date: value[0].clone().set({hour:0,minute:0,second:0,millisecond: 0}),
            to_date: value[1].clone().set({hour:23,minute:59,second:59,millisecond: 0}),
            tipType: value[0].add(-1, 'days').format('MM/DD')
          });
        }
      } else {
        message.warn('只能选择同一天')
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

  public vitalityConfig(vitalityType: string) {
    this.setState({
      vitalityType,
      modalVisible: true
    })
  }

  public handleModalOk() {
    // 
    const {shopId, from_date} = this.state;
    // 进店频次
    this.vitalityFun(shopId, from_date.clone(), 'frequency');
    // 进店间隔
    this.vitalityFun(shopId, from_date.clone(), 'interval');
    this.setState({
      modalVisible: false
    });
  }
  public handleModalCancel() {
    this.setState({
      modalVisible: false
    });
  }
  public onInputChange(key: any, value: any) {
    this.setState({
      [key]: value
    })
  }

  public modalRender() {
    const {vitalityRules, vitalityType} = this.state;
    let items = [];
    if (!!vitalityRules[vitalityType].vitality_rule_items) {
      items = vitalityRules[vitalityType].vitality_rule_items.map((item: any, key: any) => {
        return <Row key={key}>
          <Col span={18}>{`${item.from} ~ ${item.to} 天`}</Col>
          <Col span={6}><Button type="danger" onClick={this.deleteVitalityItem.bind(this, item)}>删除</Button></Col>
        </Row>;
      })
    }
    return <div>
      <Row style={{'textAlign': 'left'}}>
        {vitalityType === 'interval' ? "进店时间间隔:" : "进店频率区间:"}
      </Row>
      <Row>
        <Col span={18}>
          <InputNumber step={1} onChange={this.onInputChange.bind(this, 'firstNumber')} /> ~
          <InputNumber step={1} onChange={this.onInputChange.bind(this, 'lastNumber')} /> 天
        </Col>
        <Col span={6}>
          <Button className="add-btn" type="primary" onClick={this.addVitalityItem.bind(this, vitalityType)}>添加</Button>
        </Col>
      </Row>
      <Row style={{'textAlign': 'left'}}>
        已存在的时间间隔:
      </Row>
      {items}
    </div>
  }

  public disabledDate(current: any) {
    return current > moment().endOf('day');
  }

  public render() {
    const {
      shops,
      from_date,
      to_date,
      eventCount,
      customerCount,
      vipCount,
      eventList,
      customerList,
      customerDefList,
      vipList,
      oldEventCount,
      oldCustomerCount,
      oldVipCount,
      ageList,
      femaleCount,
      maleCount,
      menberList,
      vitalityIntervalList,
      vitalityFrequencyList,
      tipName
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
    })

    const ds = new window.DataSet();
    const dv = ds.createView().source(customerDefList);
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
        allowClear={false}
        disabledDate={this.disabledDate}
        onChange={this.handlePickDateChange}
        value={[from_date, to_date]}
        className="padding"
      />
      <Radio.Group value={''} className="padding" onChange={this.handleSizeChange}>
        <Radio.Button value="w">本周</Radio.Button>
        <Radio.Button value="w2">上周</Radio.Button>
        <Radio.Button value="m">本月</Radio.Button>
        <Radio.Button value="m2">上月</Radio.Button>
      </Radio.Group>
      <Button className="padding" onClick={this.searchBtn} type="primary">搜索</Button>
    </FormField>
    <Row className="flex form-field-item2">
      <FormField className="flex-1">
        <ChartCard
          title="进店客流"
          total={numeral(eventCount || 0).format('0,0')}
          contentHeight={134}
          // action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
        >
          <MiniArea line={true} height={45} data={eventList}/>
          {
            oldEventCount > 0 ? <div className="antd-pro-number-info-numberInfo">
              {`${tipName}: ${oldEventCount} 变化率:`}
              {
                eventCount > oldEventCount ?
                <span className={'up'}>{Math.ceil(((eventCount - oldEventCount) / oldEventCount) * 100) + '%'}<Icon type="rise"/></span>:
                <span className={'down'}>{Math.ceil(((eventCount - oldEventCount) / oldEventCount) * 100) + '%'}<Icon type="fall"/></span>
              }
            </div> : <div className="antd-pro-number-info-numberInfo">{`${tipName}: 0 变化率: 0`}</div>
          }
        </ChartCard>
      </FormField>
      <FormField className="flex-1">
        <ChartCard
          title="去重客流"
          total={numeral(customerCount || 0).format('0,0')}
          contentHeight={134}
          // action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
        >
          <MiniArea line={true} height={45} data={customerList}/>
          {
            oldCustomerCount > 0 ? <div className="antd-pro-number-info-numberInfo">
              {`${tipName}: ${oldCustomerCount} 变化率:`}
              {
                customerCount > oldCustomerCount ?
                <span className={'up'}>{Math.ceil(((customerCount - oldCustomerCount) / oldCustomerCount) * 100) + '%'}<Icon type="rise"/></span>:
                <span className={'down'}>{Math.ceil(((customerCount - oldCustomerCount) / oldCustomerCount) * 100) + '%'}<Icon type="fall"/></span>
              }
            </div> : <div className="antd-pro-number-info-numberInfo">{`${tipName}: 0 变化率: 0`}</div>
          }
        </ChartCard>
      </FormField>
      <FormField className="flex-1">
        <ChartCard
          title="会员进店数"
          total={numeral(vipCount || 0).format('0,0')}
          contentHeight={134}
          // action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
        >
          <MiniBar
            height={46}
            data={vipList}
          />
          {
            oldVipCount > 0 ? <div className="antd-pro-number-info-numberInfo">
              {`${tipName}: ${oldVipCount} 变化率:`}
              {
                vipCount > oldVipCount ?
                <span className={'up'}>{Math.ceil(((vipCount - oldVipCount) / oldVipCount) * 100) + '%'}<Icon type="rise"/></span>:
                <span className={'down'}>{Math.ceil(((vipCount - oldVipCount) / oldVipCount) * 100) + '%'}<Icon type="fall"/></span>
              }
            </div> : <div className="antd-pro-number-info-numberInfo">{`${tipName}: 0 变化率: 0`}</div>
          }
        </ChartCard>
      </FormField>
    </Row>
    <FormField className="form-item form-field-item">
      <Row className="boder-bottom">
        进店人群画像
      </Row>
      <Row>
        <Col span={12}>
          <Pie
            hasLegend={true}
            colors={['#1890ff', '#13c2c2', '#2fc25b', '#facc14', '#f04864', '#8543e0']}
            title="年龄分布图"
            subTitle="进店客流"
            total={this.pieTotal.bind(this, ageList)}
            data={ageList}
            valueFormat={this.pieValueFormat}
            height={200}
          />
        </Col>
        <Col span={12}>
          <Pie
            hasLegend={true}
            colors={['#ff92cd', '#75bcff']}
            title="男女比例环形图"
            subTitle="进店客流"
            total={maleCount + femaleCount + '位'}
            data={[{
              x: '男',
              y: maleCount
            }, {
              x: '女',
              y: femaleCount
            }]}
            valueFormat={this.pieValueFormat}
            height={200}
          />
        </Col>
      </Row>
    </FormField>
    <FormField className="form-item form-field-item2">
      <Row className="boder-bottom">
        客流趋势展示
      </Row>
      <Row>
        {
          customerDefList.length > 0 ? <Col span={24}>
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
      </Row>
    </FormField>
    <FormField className="form-item form-field-item2">
      <Row className="boder-bottom">
        会员进店数据
      </Row>
      <Row style={{margin: '0 1rem'}} className="flex flex-wrap">
        {menberList.map((item: any, key: any) => {
          return <div key={key} style={{width: '380px', marginBottom: '.5rem'}}>
            <div className="flex">
              <img src={item.original_face_url} alt=""/>
              <div className='f-f-i-content'>
                <div className="title">{item.name}</div>
                <div className="address">{`${item.last_event_shop_name} | ${item.last_event_device_name}`}</div>
                <div className="time">{moment(item.capture_at).format('YYYY/MM/DD HH:mm:ss')}</div>
                <div className="to-day"> {`${from_date.format('YYYY年MM月DD日')}至今共${item.events_count}次`} </div>
              </div>
            </div>
        </div>
        })}
      </Row>
    </FormField>
    <Row>
      <Col span={12}>
        <FormField className="form-item form-field-item2">
          <Row className="boder-bottom">
            进店间隔
            <div className='float-right click' onClick={this.vitalityConfig.bind(this, 'interval')}>设置</div>
          </Row>
          <Row>
            <Bar
              height={200}
              title=""
              data={vitalityIntervalList}
            />
          </Row>
        </FormField>
      </Col>
      <Col span={12}>
        <FormField className="form-item form-field-item2">
          <Row className="boder-bottom">
            进店频率
            <div className='float-right click' onClick={this.vitalityConfig.bind(this, 'frequency')}>设置</div>
          </Row>
          <Row>
            <Bar
              height={200}
              title=""
              data={vitalityFrequencyList}
            />
          </Row>
        </FormField>
      </Col>
    </Row>
    <Modal
      title="会员活跃度分析设置"
      visible={this.state.modalVisible}
      onOk={this.handleModalOk}
      onCancel={this.handleModalCancel}
      className="vitality"
      cancelText="取消"
      okText="确定"
    >
      {this.modalRender()}
    </Modal>
    </div>)
  }
}

export default Index;
