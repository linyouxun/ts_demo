import * as React from "react";
import * as moment from 'moment';
import {Button, Row, Form, Input, Col, DatePicker, Select } from 'antd';
const Option = Select.Option;
const { RangePicker } = DatePicker;
import { FormComponentProps } from 'antd/lib/form/Form';
import './StatisticsFilter.less';
const FormItem = Form.Item;

interface IProps {
  onSubmit: (params: any) => void;
  onReset:  () => void;
  cityList: any[];
}

class StatisticsFilter extends React.Component<IProps & FormComponentProps, any> {
  constructor(props: IProps & FormComponentProps) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
    this.filterOption = this.filterOption.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      inputValue: '全国'
    }
  }

  public onChange() {
    this.setState({
      inputValue: '全国'
    });
  }

  public filterOption(inputValue: any) {
    this.setState({
      inputValue
    });
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
    const {form, cityList} = this.props;
    const { inputValue } = this.state;
    const {getFieldDecorator} = form;
    const formProps = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      },
    }
    const children = [];
    let i = 0;
    const tempList = cityList.filter(item => RegExp(inputValue).test(item.name));
    for (const iterator of tempList) {
      if (i++ > 20) {
        break;
      }
      children.push(<Option key={iterator.adcode} value={iterator.name}>{iterator.name}</Option>);
    }
    return (
      <Form layout="horizontal" onSubmit={this.onSubmit} className="component statistics-form">
        <div className="flex">
          <Row className="flex-1">
            <Col span={8}>
              <FormItem label="ID" {...formProps} help="">
                {getFieldDecorator('id')(
                  <Input type="text" placeholder="页面ID模糊查询"/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="页面" {...formProps} help="">
                {getFieldDecorator('html')(
                  <Input type="text" placeholder="页面模糊查询"/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="城市" {...formProps} help="">
                {getFieldDecorator('city')(
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="页面访问城市"
                    onSearch={this.filterOption}
                    onChange={this.onChange}
                    onBlur={this.onChange}
                  >
                    {children}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="投放城市" {...formProps} help="">
                {getFieldDecorator('channel_city')(
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="页面投放城市"
                    onSearch={this.filterOption}
                    onChange={this.onChange}
                    onBlur={this.onChange}
                  >
                    {children}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
            <FormItem label="时间" {...formProps} help="">
                {getFieldDecorator('time')(
                  <RangePicker
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
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
export default Form.create()(StatisticsFilter);
