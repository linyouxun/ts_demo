import * as React from "react";
import * as moment from 'moment';
import {Button, Row, Form, Col, DatePicker, Select, Spin, message } from 'antd';
const Option = Select.Option;
const { RangePicker } = DatePicker;
import { fetchData } from "../../util/request";
import { APISERVER } from '../../util/const';
import { FormComponentProps } from 'antd/lib/form/Form';
import './CommonStatisticsFilter.less';
const FormItem = Form.Item;

interface IProps {
  onSubmit: (params: any) => void;
  onReset:  () => void;
}

class CommonStatisticsFilter extends React.Component<IProps & FormComponentProps, any> {

  public clearTimeout: any = null;

  public state = {
    selectLoading: false,
    activeList: []
  }

  constructor(props: IProps & FormComponentProps) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
    this.loadList = this.loadList.bind(this)
    this.pickerTime = this.pickerTime.bind(this);
  }

  public componentDidMount() {
    this.loadList();
  }

  public pickerTime(value: any, prevValue: any) {
    if (!!value && value.length > 0) {
      if (value[0].format('YYYY-MM-DD') === value[1].format('YYYY-MM-DD')) {
        return value;
      } else {
        message.warn('只能选择同一天');
        return prevValue;
      }
    }
  }

  public async loadList(value: string = '') {
    // 节流
    if (!!this.clearTimeout) {
      clearTimeout(this.clearTimeout);
      this.clearTimeout = null;
    }
    this.clearTimeout = setTimeout(async () => {
      this.setState({
        activeList: [],
        selectLoading: true
      });
      const res = await fetchData( {
        pageSize: 100,
        currentPage: 1,
        extraData: JSON.stringify({title: value})
      }, `${APISERVER}/api2/active/list`, {
        method: 'GET'
      });
      if (res.stutasCode === 200) {
        this.setState({
          activeList: res.result.list,
        });
      }
      this.setState({
        selectLoading: false
      });
    }, 1000);
  }

  public onSubmit(e: any) {
    e.preventDefault();
    const {form, onSubmit} = this.props;
    form.validateFieldsAndScroll((errors: any, values: any) => {
      if (!!errors) {
        console.error('表单出错: ', errors);
        return;
      }
      onSubmit(values);
    });
  }

  public onReset() {
    this.props.form.resetFields();
    this.props.onReset();
  }
  public render(): JSX.Element {
    const {form} = this.props;
    const { selectLoading, activeList } = this.state;
    const {getFieldDecorator} = form;
    const formProps = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      },
    }
    return (
      <Form layout="horizontal" onSubmit={this.onSubmit} className="component user-statistics-form">
        <div className="flex">
          <Row className="flex-1">
            <Col span={8}>
              <FormItem label="标题" {...formProps} help="">
                {getFieldDecorator('title')(
                  <Select
                    mode="tags"
                    labelInValue={true}
                    placeholder="全部统计"
                    notFoundContent={selectLoading ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={this.loadList}
                    style={{ width: '100%' }}
                  >
                    {activeList.map((item: any, index: any) => {
                      return <Option key={item._id}>{item.title}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
            <FormItem label="时间" {...formProps} help="">
                {getFieldDecorator('time', {
                  initialValue: [
                    moment({hour:0,minute:0,second:0,millisecond: 0}), // 搜索开始时间
                    moment({hour:23,minute:59,second:59,millisecond: 0}), // 搜索结束时间
                  ],
                  normalize: this.pickerTime,
                })(
                  <RangePicker
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem className="form-btns" >
            <Button className="btn-filter" type="primary" htmlType="submit">搜索</Button>
            <Button className="btn-filter" type="ghost" onClick={this.onReset}>重置</Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}
// Form.create()(MerchandiseDiscountListFilter)
export default Form.create()(CommonStatisticsFilter);
