import * as React from "react";
import {Button, Row, Form} from 'antd';
const FormItem = Form.Item;
import './CaseFilter.less';

class CaseFilter extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addMerchandiseType = this.addMerchandiseType.bind(this);
  }

  public handleSubmit(e: any) {
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

  public handleReset(e: any) {
    if(!!e) {
      e.preventDefault();
    }
    this.props.form.resetFields();
    this.props.onSubmit({
      merchandise_id: '',
      merchandise_name: '',
    });
  }

  public addMerchandiseType(e: any) {
    if(e) {
      e.preventDefault();
    }
    this.props.addMerchandiseType();
  }

  public render(): JSX.Element{
    return(
      <Form layout="horizontal" onSubmit={this.handleSubmit} className="component margin0">
        <Row type="flex" >
          <FormItem className="actions" >
            <Button className="btn-filter" type="ghost" onClick={this.addMerchandiseType}>添加</Button>
          </FormItem>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(CaseFilter);
