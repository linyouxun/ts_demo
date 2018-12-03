import * as React from "react";
import * as moment from 'moment';
import {Button, Row, Form, Input, Col, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import { FormComponentProps } from 'antd/lib/form/Form';
import './UserStatisticsFilter.less';
const FormItem = Form.Item;

interface IProps {
  onSubmit: (params: any) => void;
  onReset:  () => void;
}

class UserStatisticsFilter extends React.Component<IProps & FormComponentProps, any> {
  constructor(props: IProps & FormComponentProps) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
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
              <FormItem label="ID" {...formProps} help="">
                {getFieldDecorator('id')(
                  <Input type="text" placeholder="页面ID模糊查询"/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="电话" {...formProps} help="">
                {getFieldDecorator('phone')(
                  <Input type="text" placeholder="页面模糊查询"/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
            <FormItem label="时间" {...formProps} help="">
                {getFieldDecorator('time')(
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
export default Form.create()(UserStatisticsFilter);
