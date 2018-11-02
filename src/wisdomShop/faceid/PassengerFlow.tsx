import * as React from 'react';
import { message, Select, Button, DatePicker, Table, Modal} from 'antd';
import FormField from "../../components/FormField";
const Option = Select.Option;
const { RangePicker } = DatePicker;
import * as moment from 'moment';
import { fetchData, fetchDataList } from "../../util/request";
import { PAGE, gender, ymToken } from '../../util/const';
import './PassengerFlow.less';

class PassengerFlow extends React.Component<any, any> {
  public state = {
    shops: [], // 商店
    shopId: 0, // 商店ID
    from_date: moment({hour:0,minute:0,second:0,millisecond: 0}), // 搜索开始时间
    to_date: moment({hour:23,minute:59,second:59,millisecond: 0}), // 搜索结束时间
    column: [
      {title: '人脸', dataIndex: 'original_face_url', render:(text: any, record: any, index: any)=> {
        return <img src={text} className="t-img" onClick={this.handleImgPreview.bind(this, text, true)}/>
      }},
      {title: '时间', dataIndex: 'capture_at', render:(text: any, record: any, index: any)=> {
        return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      }},
      {title: '姓名', dataIndex: 'customer_name'},
      {title: '年龄', dataIndex: 'age'},
      {title: '性别', dataIndex: 'gender', render:(text: any, record: any, index: any)=> {
        return <span>{gender[text+'']}</span>
      }},
      {title: '设备', dataIndex: 'device_name'},
    ],
    loading: false,
    list: [],
    previewImage: '',
    previewVisible: false,
  }
  public page = {
    pageSize: PAGE.defaultPageSize,
    currentPage: PAGE.defaultCurrentPage,
    total: PAGE.total
  }
  constructor(props: any) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handlePickDateChange = this.handlePickDateChange.bind(this);
    this.searchBtn = this.searchBtn.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }
  // 预览图片
  public handleImgPreview(imgURL: any, previewVisible: boolean = false){
    if (previewVisible) {
      this.setState({
        previewImage: imgURL,
        previewVisible,
      });
    } else {
      this.setState({
        previewVisible,
      });
    }
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
    const {shopId, from_date, to_date} = this.state;
    // 进店客流查询
    this.loadList(PAGE.defaultPageSize, PAGE.defaultCurrentPage, shopId, from_date, to_date);
  }
  public handleSizeChange(e: any) {
    const type = e.target.value;
    this.setState({
      dateType: type
    })
  }
  public componentDidMount() {
    const {shopId, from_date, to_date} = this.state;
    const { pageSize, currentPage } = this.page;
    // 获取门店
    this.shopsFun();
    // 进店客流查询
    this.loadList(pageSize, currentPage, shopId, from_date, to_date);
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

  // 进店客流查询
  public async loadList(pageSize: number | string, currentPage: number | string, shopId: any, fromDate: any, toDate: any) {
    this.setState({
      loading: true
    });
    const res: any = await fetchDataList({
      shop_id: shopId,
      return: 'all_list',
      from_date: Math.ceil(+fromDate / 1000),
      to_date: Math.ceil(+toDate / 1000),
      per_page: pageSize,
      page: currentPage,
      event_type: 'in',
      status: 'analyzed'
    }, '/v1/api/company/events', {
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
        message.error('会员到点分析拉取出错');
      }
    } else {
      this.page = {
        pageSize: +res.pageSize || 0,
        currentPage: +res.currentPage || 0,
        total: +res.total || 0
      }
      this.setState({
        list: res.list || [],
      });
    }
  }

  public disabledDate(current: any) {
    return current > moment().endOf('day');
  }
  public onPageChange(current: any, pageSize: any) {
    const {shopId, from_date, to_date} = this.state;
    this.loadList(+pageSize, +current, shopId, from_date, to_date);
  }

  public render() {
    const {
      shops,
      from_date,
      to_date,
      column,
      loading,
      list,
      previewVisible,
      previewImage
    } = this.state;
    const { pageSize, currentPage, total } = this.page;
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
    return (<div className="passenger-flow">
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
        <Button className="padding" onClick={this.searchBtn} type="primary">搜索</Button>
      </FormField>
      <FormField>
        <Table {...tableProps} />
      </FormField>
      <Modal visible={previewVisible} footer={null} onCancel={this.handleImgPreview.bind(this, '', false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>)
  }
}

export default PassengerFlow;
