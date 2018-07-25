import * as React from 'react';
import {Button, Modal, Form, Icon, Upload} from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import { IMGSERVER } from '../util/const';
const FormItem = Form.Item;
import './BannerForm.less';

export interface IPramas {
  id?: number;
  loading?: boolean;
  imageUrl?: object[];
}
export interface IProps {
  params: IPramas;
  form?: object[];
  goback:() => any;
  onSubmit:(o: IParamsSubmit) => any;
}

export interface IParamsSubmit {
  id: number;
  imageUrl?: object[];
  imgs: UploadChangeParam;
  loading: boolean;
}

export class BannerForm extends React.Component<IProps & FormComponentProps, any> {
  constructor(props: IProps & FormComponentProps) {
    super(props);
    this.state = {
      fileList: props.params.imageUrl,
      previewVisible: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkImg = this.checkImg.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.goback = this.goback.bind(this);
  }
  public handleSubmit(e: any) {
    e.preventDefault();
    const {form, onSubmit, params} = this.props;
    form.validateFieldsAndScroll((errors: any, values: any) => {
      if (!!errors) {
        console.error('表单出错: ', errors);
        return;
      }
      onSubmit(Object.assign(params, values));
    });
  }
  public checkImg(rule: any, value: any, callback: any) {
    const { fileList } = this.state;
    if (fileList.length > 0) {
      const imgData = fileList[0];
      if (!!imgData.url) {
        callback();
      } else {
        callback('banner图片上传失败，请重新上传');
      }
    } else {
      callback('banner图片不能为空，请重新上传');
    }
  }
  public handlePreview() {
    this.setState({
      previewVisible: true
    });
  }
  public handleChange(info: UploadChangeParam) {
    const { fileList, file } = info;
    this.setState({
      fileList,
    })
    if (file.status === 'done') {
      if (file.response.code === 200) {
        fileList[fileList.length-1] = Object.assign(fileList[fileList.length-1],{
          url: file.response.data.imageUrl
        })
        this.setState({
          fileList
        })
      }
    }
  }
  public handleCancel() {
    this.setState({
      previewVisible: false
    });
  }
  public goback() {
    this.props.goback();
  }
  public render() {
      const { form, params } = this.props;
      const { getFieldDecorator } = form;
      const formProps = {
        labelCol: {
          span: 4
        },
        wrapperCol: {
          span: 10
        },
      }
      const {fileList, previewVisible, previewImage} = this.state;
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">上传</div>
        </div>
      );
      return <Form onSubmit={this.handleSubmit}>
        <FormItem label="banner图：" {...formProps} help="请上传宽:高比例为2:1的图片；推荐尺寸为750x375(最多5张)">
          {getFieldDecorator('imgs', {
            initialValue: {fileList},
            rules: [{ required: true, validator: this.checkImg }],
          })(
            <Upload
              action={`${IMGSERVER}/upload`}
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {fileList.length > 5 ? null : uploadButton}
            </Upload>
          )}
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </FormItem>
        <FormItem wrapperCol={{ span: 10, offset: 4 }}>
          <Button type="primary" htmlType="submit" loading={params.loading}>确定</Button>
          <Button type="ghost" onClick={this.goback}>取消</Button>
        </FormItem>
      </Form>
    }
}
export default Form.create()(BannerForm);;
