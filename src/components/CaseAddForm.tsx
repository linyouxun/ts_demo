// <reference path="../global.d.ts" />
import * as React from 'react';
import {Button, Modal, Form, Icon, Upload, Select, Input, message} from 'antd';
import { RawDraftContentState } from 'draft-js';
import { FormComponentProps } from 'antd/lib/form/Form';
import { UploadChangeParam } from 'antd/lib/upload/interface';

import * as BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css'

import { IMGSERVER } from '../util/const';
import { DECORATIONSTYLE } from '../util/const';
const Option = Select.Option;
const FormItem = Form.Item;
import './CaseAddForm.less';

export interface IPramas {
  id?: number;
  category?: string;
  image?: any;
  title?: string;
  value?: any;
  loading: boolean;
}
export interface IProps {
  params: IPramas;
  form?: object[];
  goback:() => any;
  onSubmit:(o: IParamsSubmit) => any;
}

export interface IParamsSubmit {
  id?: number | string;
  itemId?: number | string;
  category?: string;
  imageUrls?: any;
  image?: any;
  imageUrl?: object[];
  imgs?: UploadChangeParam;
  title?: string;
  value?: any;
  loading?: boolean;
  operate?: '1' | '2';
}

export interface ISuccess {
  url: string;
  meta: any;
}

export interface IFileParams {
  file: File;
  progress: (progress: number) => void;
  libraryId: string,
  success: (res: ISuccess) => void;
  error: (err: any) => void;
}

export class CaseAddForm extends React.Component<IProps & FormComponentProps, any> {
  constructor(props: IProps & FormComponentProps) {
    super(props);
    // let fileList = [];
    // try {
    //   fileList = JSON.parse(props.params.imageUrls);
    // } catch (error) {
    //   console.error('图片转化失败');
    // }
    this.state = {
      category: props.params.category || '',
      fileList: props.params.image || [],
      id: props.params.id || '',
      previewVisible: false,
      title: props.params.title || '',
      value: props.params.value || '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.goback = this.goback.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  public handleSubmit(e: any) {
    e.preventDefault();
    const {form, onSubmit, params} = this.props;
    const {fileList, value} = this.state;
    form.validateFieldsAndScroll((errors: any, values: any) => {
      if (!!errors) {
        console.error('表单出错: ', errors);
        return;
      }
      onSubmit(Object.assign(params, values, {fileList, value}));
    });
  }
  public goback() {
    this.props.goback();
  }
  public handlePreview(file: any){
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  public handleChange(info: UploadChangeParam){
    this.setState({
      fileList: info.fileList
    })
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        info.fileList[info.fileList.length-1] = Object.assign(info.fileList[info.fileList.length-1],{
          url: info.file.response.data.imageUrl
        })
        this.setState({
          fileList: info.fileList
        })
      }
    }
  }
  public handleCancel() {
    this.setState({
      previewVisible: false
    });
  }
  public checkNum(rule: any, value: any, callback: any) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('member_pwd')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  }
  public checkImg(rule: any, value: any, callback: any) {
    const {fileList} = this.state;
    if (fileList.length > 0) {
      const imgData = fileList[0];
      if (!!imgData.url) {
        callback();
      } else {
        callback('banner图片上传失败，请重新上传');
      }
    } else {
      callback('banner图片不能为空');
    }
  }
  public handleEditorChange(content: RawDraftContentState) {
    this.setState({
      value: content
    });
  }
  public render() {
    const {form, params} = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
    };
    const formProps = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 10
      },
    }
    const {fileList, previewVisible, previewImage} = this.state;
    const selectChildren = [];
    for(const o in DECORATIONSTYLE) {
      if(DECORATIONSTYLE.hasOwnProperty(o)) {
        selectChildren.push(<Option
          key={DECORATIONSTYLE[o].id + ''}
          value={DECORATIONSTYLE[o].id + ''}>
            {DECORATIONSTYLE[o].name}
          </Option>);
      }
    }
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const contentFormatHTML: 'html' = 'html';
    const editorProps = {
      contentFormat: contentFormatHTML,
      controls:[
        'undo', 'redo', 'split', 'font-size', 'font-family', 'line-height', 'letter-spacing',
        'indent','text-color', 'bold', 'italic', 'underline', 'strike-through',
        'superscript', 'subscript', 'remove-styles', 'text-align', 'split', 'headings', 'list_ul',
        'list_ol', 'blockquote', 'code', 'split', 'link', 'split', 'hr', 'split', 'media', 'clear'
      ],
      height: 0,
      imageControls:{
        alignCenter: false,
        alignLeft: false,
        alignRight: false,
        floatLeft: false,
        floatRight: false,
        link: false,
        size: false
      },
      initialContent: params.value,
      media: {
        allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
        audio: false, // 开启音频插入功能
        externalMedias: {
          audio: false,
          embed: false,
          image: true,
          video: false,
        },
        image: true, // 开启图片插入功能
        onChange: null, // 指定媒体库文件列表发生变化时的回调，参数为媒体库文件列表(数组)
        onInsert: (files: any) => {
          return files.slice(0, 3);
          return false;
          return [];

        }, // 指定从媒体库插入文件到编辑器时的回调，参数为被插入的媒体文件列表(数组)
        onRemove: null, // 指定媒体库文件被删除时的回调，参数为被删除的媒体文件列表(数组)
        removeConfirmFn: null, // 指定删除前的确认函数，说明见下文
        uploadFn: (param: IFileParams) => {

          const serverURL = `${IMGSERVER}/upload`;
          const xhr = new XMLHttpRequest;
          const fd = new FormData();
          const successFn = (res: any): any => {
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            const {status, response} =  res.target;
            if (status === 200) {
              try {
                const o = JSON.parse(response);
                param.success({
                  meta: {
                    // alt: 'xxx',
                    // autoPlay: true, // 指定音视频是否自动播放
                    // controls: true, // 指定音视频是否显示控制栏
                    // id: 'xxx',
                    // loop: true, // 指定音视频是否循环播放
                    // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
                    // title: 'xxx',
                  },
                  url: `${IMGSERVER}${o.data.imageUrl}`,
                });
              } catch (error) {
                // 上传发生错误时调用param.error
                param.error({
                  msg: '富文本图片转化失败'
                });
              }
            } else {
              param.error({
                msg: '富文本图片转化失败'
              });
            }
          }

          const progressFn = (event: any) => {
            // 上传进度发生变化时调用param.progress
            param.progress(event.loaded / event.total * 100)
          }

          const errorFn = (response: any) => {
            // 上传发生错误时调用param.error
            param.error({
              msg: '富文本图片转化失败'
            })
          }

          xhr.upload.addEventListener("progress", progressFn, false)
          xhr.addEventListener("load", successFn, false)
          xhr.addEventListener("error", errorFn, false)
          xhr.addEventListener("abort", errorFn, false)

          fd.append('file', param.file)
          xhr.open('POST', serverURL, true)
          xhr.send(fd)

        }, // 指定上传函数，说明见下文
        validateFn:  (file: any) => {
          const flat: boolean = file.size < 1024 * 1024 * 5;
          if (!flat) {
            message.warning('添加图片文件不能大于5M(5 * 1024 * 1024)');
          }
          return flat;
        }, // 指定本地校验函数，说明见下文
        video: false, // 开启视频插入功能
      },
      onChange: this.handleEditorChange,
      // onRawChange: this.handleEditorRawChange,
      placeholder: '请填写案例详情...',
    }
    const aaaa: any = BraftEditor;
    const BraftEditor2 = aaaa.default;
    return <Form onSubmit={this.handleSubmit} className="case-add-form">
      <FormItem
        {...formItemLayout}
        label="标题："
      >
        {getFieldDecorator('title', {
          initialValue: params.title,
          rules: [{ required: true, message: '标题名称不能为空!!!' }],
        })(
          <Input placeholder="请输入标题名称" />
        )}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label="分类："
      >
        {getFieldDecorator('category', {
          initialValue: params.category + '',
          rules: [{ required: true, message: '分类不能为空!!!' }],
        })(
          <Select
            style={{ width: '100%' }}>
            {selectChildren}
          </Select>
        )}
      </FormItem>
      {/* （支持gif, jpg, jpeg, png格式图片） */}
      <FormItem label="首图：" {...formProps} help="请上传宽高尺寸(2:1)图片；推荐尺寸为750*375">
        {getFieldDecorator('imgs', {
          initialValue: {fileList},
          rules: [{ required: true, validator: this.checkImg.bind(this) }],
        })(
          <Upload
            action={`/xcx/upload`}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length > 0 ? null : uploadButton}
          </Upload>
        )}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </FormItem>
      <FormItem label="内容" {...formProps} wrapperCol={ { span: 16 } } required={ false }>
        <BraftEditor2 {...editorProps}/>
      </FormItem>
      <FormItem wrapperCol={{ span: 10, offset: 4 }}>
        <Button type="primary" htmlType="submit" loading={params.loading}>确定</Button>
        <Button type="ghost" onClick={this.goback}>取消</Button>
      </FormItem>
    </Form>
  }
}
export default Form.create()(CaseAddForm);;


