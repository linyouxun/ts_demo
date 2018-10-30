import * as React from 'react';
import {Spin, Form, Input, Button, message, Icon, Checkbox} from 'antd';
const FormItem = Form.Item;
import { fetchData } from "../util/request";
import './Login.less';

class Login extends React.Component<any, any> {
  public state = {
    loading: false
  }
  constructor(props: any) {
    super(props);
    this.onClickSubmit = this.onClickSubmit.bind(this);
  }
  public onClickSubmit(e: any) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors: any, values: any) =>{
      if(!!errors) {
        console.error(errors);
        return;
      }
      this.submitLogin(values);
    });
  }
  public async submitLogin(data: any) {
    this.setState({
      loading: true
    });

    const res = await fetchData( data, 'user/login', {
      method: 'GET'
    });
    this.setState({
      loading: false
    });
    if (res.code !== 200) {
      message.error(res.message)
    } else {
      window.location.href = '/login';
    }
  }
  public render() {
    const {getFieldDecorator} = this.props.form;
    const nameProps = getFieldDecorator('account', {
      rules: [
        {required: true, message: '请填写正确的用户名称'}
      ],
    });
    const passwordProps = getFieldDecorator('pwd', {
      rules: [
        {required: true, whitespace: true, message: '请填写密码'}
      ],
    });
    return (<div className="login">
      <div className="flex login-form">
        <div className="flex-1 rel">
          <div className="cdg"/>
          <div className="title"/>
        </div>
        <div className="login-box clearfix flex flex-direction">
          <div className="flex-1"/>
          <Spin spinning={this.state.loading} delay={200}>
            <Form layout="horizontal" onSubmit={this.onClickSubmit}>
              <FormItem className="name">
                <span className="rel">
                  <div className="logo"/>
                </span>
              </FormItem>
              <FormItem className="ant-form-item-name">
                {nameProps(<Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名"/>)}
              </FormItem>
              <FormItem className="ant-form-item-pwd">
                {passwordProps(<Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" autoComplete="off"/>)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox>记住密码</Checkbox>
                )}
                {/* <a className="login-form-forgot" href="">Forgot password</a> */}
              </FormItem>
              <FormItem>
                <Button type="primary" size="large" htmlType="submit" className="form-login-btn">登录</Button>
              </FormItem>
            </Form>
          </Spin>
          <div className="flex-1"/>
        </div>
      </div>
  </div>)
  }
}
export default Form.create({})(Login);
