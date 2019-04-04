import * as React from "react";
import {Button, Row, Form} from 'antd';
const FormItem = Form.Item;

interface IProps {
  onSubmit: () => void;
  onAdd:  () => void;
}

class WisdomFilter extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }
  public onSubmit() {
    this.props.onSubmit();
  }
  public onAdd() {
    this.props.onAdd();
  }
  public render(): JSX.Element {
    return (
      <Form layout="horizontal" onSubmit={this.onSubmit} className="component margin0">
        <Row type="flex" >
          <FormItem className="actions" >
            <Button className="btn-filter" type="ghost" onClick={this.onAdd}>添加</Button>
          </FormItem>
        </Row>
      </Form>
    );
  }
}

export default WisdomFilter;
