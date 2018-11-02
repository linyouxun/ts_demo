import * as React from 'react';
import { message, Select, Button, Table} from 'antd';
import FormField from "../../components/FormField";
const Option = Select.Option;
import * as moment from 'moment';
import { fetchData, fetchDataList } from "../../util/request";
import { PAGE, ymToken, ymPosition, ymStatus } from '../../util/const';
import './Device.less';

class Device extends React.Component<any, any> {
  public state = {
    shops: [], // 商店
    shopId: '', // 商店ID
    location: '',
    on_line: '',
    column: [
      {title: '设备id', dataIndex: 'id'},
      {title: '设备编码', dataIndex: 'mac_address'},
      {title: '设备名称', dataIndex: 'name'},
      {title: '设备位置', dataIndex: 'location', render:(text: any, record: any, index: any)=> {
        return <span>{!!ymPosition[text+''] ? ymPosition[text+''].name : ''}</span>
      }},
      {title: '门店', dataIndex: 'shop_name'},
      {title: '楼层', dataIndex: 'floor_id'},
      {title: '添加时间', dataIndex: 'created_at', render:(text: any, record: any, index: any)=> {
        return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      }},
      {title: '状态', dataIndex: 'online', render:(text: any, record: any, index: any)=> {
        return <span>{!!ymStatus[text+''] ? ymStatus[text+''].name : ''}</span>
      }},
      {title: '版本号', dataIndex: 'device_lot', render:(text: any, record: any, index: any)=> {
        return <span>{record.device_lot}{record.version_code}</span>
      }}
    ],
    loading: false,
    list: []
  }
  public page = {
    pageSize: PAGE.defaultPageSize,
    currentPage: PAGE.defaultCurrentPage,
    total: PAGE.total
  }
  constructor(props: any) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
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
  public handleSelectChange(key:any, value: any) {
    console.log(key, value);
    this.setState({
      [key]: value
    });
  }

  public searchBtn() {
    const {shopId, location, on_line} = this.state;
    this.loadList(PAGE.defaultPageSize, PAGE.defaultCurrentPage, shopId, location, on_line);
  }
  public handleSizeChange(e: any) {
    const type = e.target.value;
    this.setState({
      dateType: type
    })
  }
  public componentDidMount() {
    const {shopId, location, on_line} = this.state;
    const { pageSize, currentPage } = this.page;
    // 获取门店
    this.shopsFun();
    // 进店客流查询
    this.loadList(pageSize, currentPage, shopId, location, on_line);
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

  // 设备列表
  public async loadList(pageSize: number | string, currentPage: number | string, shopId: any, location: any, onLine: any) {
    this.setState({
      loading: true
    });
    const res: any = await fetchDataList({
      shop_id: shopId,
      per_page: pageSize,
      page: currentPage,
      floor_id: '',
      location,
      on_line: onLine,
    }, '/v1/api/company/devices', {
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
        message.error('设备列表拉取出错');
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

  public onPageChange(current: any, pageSize: any) {
    const {shopId, location, on_line} = this.state;
    this.loadList(+pageSize, +current, shopId, location, on_line);
  }

  public render() {
    const {
      shops,
      column,
      loading,
      list
    } = this.state;
    const { pageSize, currentPage, total } = this.page;
    const selectChildren: any[] = [];
    selectChildren.push(<Option
      key={''}
      value={''}>
        {'全部门店'}
      </Option>)
    shops.map((item: any) => {
      selectChildren.push(<Option
        key={item.id + ''}
        value={item.id + ''}>
          {item.name}
        </Option>);
    });
    const selectYmPositionChildren: any[] = [];
    selectYmPositionChildren.push(<Option
      key={''}
      value={''}>
        {'全部位置'}
      </Option>)
    for (const key in ymPosition) {
      if (ymPosition.hasOwnProperty(key)) {
        const element = ymPosition[key];
        selectYmPositionChildren.push(<Option
          key={element.id}
          value={element.key}>
            {element.name}
          </Option>)
      }
    }

    const selectYmStatusChildren: any[] = [];
    selectYmStatusChildren.push(<Option
      key={''}
      value={''}>
        {'全部状态'}
      </Option>)
    for (const key in ymStatus) {
      if (ymStatus.hasOwnProperty(key)) {
        const element = ymStatus[key];
        selectYmStatusChildren.push(<Option
          key={element.id}
          value={element.status+''}>
            {element.name+''}
          </Option>)
      }
    }

    // ymStatus
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
    return (<div className="device">
      <FormField className="form-item">
        <Select
          defaultValue="全部门店"
          className="padding"
          onChange={this.handleSelectChange.bind(this, 'shopId')}
          style={{ width: '240px' }}>
          {selectChildren}
        </Select>
        <Select
          defaultValue="全部位置"
          className="padding"
          onChange={this.handleSelectChange.bind(this, 'location')}
          style={{ width: '240px' }}>
          {selectYmPositionChildren}
        </Select>
        <Select
          defaultValue="全部状态"
          className="padding"
          onChange={this.handleSelectChange.bind(this, 'on_line')}
          style={{ width: '240px' }}>
          {selectYmStatusChildren}
        </Select>
        <Button className="padding" onClick={this.searchBtn} type="primary">查询</Button>
      </FormField>
      <FormField>
        <Table {...tableProps} />
      </FormField>
    </div>)
  }
}

export default Device;
