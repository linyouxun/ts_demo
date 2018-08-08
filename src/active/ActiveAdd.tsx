import * as React from 'react';
import ContentHeader from "../components/ContentHeader";
// import FormField from "../components/FormField";
import { Modal, Button, Upload, Icon } from 'antd';

import './ActiveAdd.less';

interface IComponentType {
  key: string;
  name: string;
}

class ActiveAdd extends React.Component<any, any> {
  public static componentType: IComponentType[] = [{
    key: '1',
    name: '图片'
  }, {
    key: '2',
    name: '报名框'
  }];
  constructor(props: any) {
    super(props);
    this.addComponent = this.addComponent.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleImgCancel = this.handleImgCancel.bind(this);
    this.handleImgPreview = this.handleImgPreview.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.state = {
      configList: [],
      fileList: [{
        name: 'xxx.png',
        status: 'done',
        uid: '-1',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
      modalVisible: false,
      previewImage: '',
      previewVisible: false,
    }
  }
  public addComponent() {
    this.setModalVisible(true);
  }
  public handleCancel() {
    this.setModalVisible(false);
  }
  public setModalVisible(modalVisible: boolean = false) {
    this.setState({
      modalVisible
    })
  }
  public selectComponent(type: IComponentType) {
    const { configList } = this.state;
    switch(type.key) {
      case '1': {
        configList.push(this.renderButtonComponent(type, configList.length));
        break;
      }
      default: {
        break;
      }
    }
    this.setState({
      configList
    }, () => {
      this.setModalVisible(false);
    })
  }
  public handleImgCancel() {
    this.setState({
      previewVisible: false
    });
  }

  public handleImgPreview(file: any){
    console.log('log');
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  public handleImgChange(item: any) {
    this.setState({ fileList: item.fileList })
  }

  public renderButtonComponent(type: IComponentType, key: number) {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (<div key={key} className="active-view">
      <div className="active-view-name">
        {type.name}
      </div>
      <div className="active-view-content">
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handleImgPreview}
          onChange={this.handleImgChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleImgCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    </div>);
  }
  public renderComponents() {
    return (<div>
      {ActiveAdd.componentType.map((item: IComponentType, index: number) => {
        return (<Button onClick={this.selectComponent.bind(this, item)} key={item.key} type="primary">{item.name}</Button>);
      })}
    </div>)
  }
  public render(): JSX.Element {
    const { configList } = this.state;
    return (<div className="page">
      <ContentHeader title="活动推广页面配置-添加" />
      <div className="active-config">
        <div className="active-config-content">
          配置信息:
          { configList.map((item: JSX.Element | string) => item) }
          <div>
            <Button onClick={this.addComponent}>添加组件</Button>
          </div>
        </div>
        <div className="active-config-view">
          配置界面
        </div>
      </div>
      <Modal
          title="选择组件"
          visible={this.state.modalVisible}
          footer={false}
          onCancel={this.handleCancel}
        >
        {this.renderComponents()}
        </Modal>
    </div>);
  }
}

export default ActiveAdd;
