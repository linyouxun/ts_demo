import * as React from 'react';
import ContentHeader from "../components/ContentHeader";
// import FormField from "../components/FormField";
import PickerButton from '../components/PickerButton';
import { Modal, Button, Upload, Icon, Checkbox, Col, Row, Input } from 'antd';
const ButtonGroup = Button.Group;
import { IMGSERVER, FILETYPE, ARROW, ActiveComponentType, ActiveFormItem } from '../util/const';
import ActiveView, { IConfigObj } from './components/ActiveView';
import './ActiveAdd.less';

interface IComponentType {
  key: string | number;
  name: string;
}

class ActiveAdd extends React.Component<any, any> {
  public static componentType = ActiveComponentType;
  public static formItem = ActiveFormItem;
  constructor(props: any) {
    super(props);
    this.addComponent = this.addComponent.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleImgCancel = this.handleImgCancel.bind(this);
    this.handleImgPreview = this.handleImgPreview.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.submitConfig = this.submitConfig.bind(this);
    this.state = {
      // configList: [],
      configList: [],
      configBase: {},
      modalVisible: false,
      previewImage: '',
      previewVisible: false,
    }
  }
  public submitConfig() {
    const { configList } = this.state;
    console.log(configList);
  }
  // 添加组件弹框
  public addComponent() {
    this.setModalVisible(true);
  }

  // 添加组件弹框取消
  public handleCancel() {
    this.setModalVisible(false);
  }
  // 选择组件弹框
  public setModalVisible(modalVisible: boolean = false) {
    this.setState({
      modalVisible
    })
  }
  // 选择添加组件
  public selectComponent(type: IComponentType) {
    const { configList } = this.state;
    const configTempList = configList.filter((item:any) => item.name === type.name);
    let count = 1;
    if (configTempList.length > 0) {
      count = configTempList.reduce((item: any, item2: any) => {
        if(+item.count > +item2.count) {
          return item;
        } else {
          return item2;
        }
      }).count + 1;
    }
    const configObj = {
      key: type.key,
      name: type.name,
      count,
      config: {}
    }
    switch(type.key) {
      case ActiveAdd.componentType.pic.key: {
        configObj.config = {
          fileList: []
        }
        break;
      }
      case ActiveAdd.componentType.form.key: {
        configObj.config = {
          checkList: ['moblie'],
          moblie: ActiveAdd.formItem.moblie.value,
        }
        break;
      }
      default: {
        break;
      }
    }
    configList.push({
      ...configObj
    });
    this.setState({
      configList
    }, () => {
      this.setModalVisible(false);
    })
  }
  // 取消预览图片
  public handleImgCancel() {
    this.setState({
      previewVisible: false
    });
  }

  // 预览图片
  public handleImgPreview(file: any){
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  // 上传，删除等操作图片更新事件处理
  public handleImgChange(key: string, item: any) {
    const {status} = item.file;
    const { configList } = this.state;
    const index = key.split('-')[0];
    const configObj = configList[index];
    switch(status) {
      case FILETYPE.done: {
        const imgUrl = item.file.response.data.imageUrl;
        const height = item.file.response.data.height;
        const width = item.file.response.data.width;
        configObj.config.fileList = configObj.config.fileList.map((file: any) => {
          if (file.uid !== item.file.uid) {
            return file;
          }
          return {
            ...file,
            thumbUrl: IMGSERVER + imgUrl,
            url: IMGSERVER + imgUrl,
            height,
            width,
          }
        });
        configList[index] = configObj;
        break;
      }
      case FILETYPE.uploading:
      case FILETYPE.removed:
      case FILETYPE.error:
      default: {
        configObj.config.fileList = item.fileList;
        configList[index] = configObj;
      }
    }
    this.setState({ configList });
  }
  // 复选框事件监听
  public onCheckBoxChange(key: string, item: any) {
    const { configList } = this.state;
    const index = key.split('-')[0];
    const configObj = configList[index];
    configObj.config.checkList = [...item];
    item.map((i: string) => {
      configObj.config[i] = ActiveAdd.formItem[i].value;
    });
    configList[index] = configObj;
    this.setState({
      configList
    });
  }
  // 复选框（输入款）事件监听
  public onCheckBoxInputChange(key: string, inputKey: string, event: any) {
    const { configList } = this.state;
    const index = key.split('-')[0];
    const configObj = configList[index];
    configObj.config[inputKey] = (event.target.value + '').trim();
    configList[index] = configObj;
    this.setState({
      configList
    });
  }
  public moveConfigList(key: string, arrwoType: number) {
    const { configList } = this.state;
    const configTmpList = [...configList];
    const index = key.split('-')[0];
    const len = configTmpList.length;
    switch (arrwoType) {
      case ARROW.UP: {
        // 最上面不能往上面移动
        if (+index === 0) {
          return;
        }
        const configObj = configTmpList.splice(+index, 1);
        configTmpList.splice(+index - 1, 0, ...configObj);
        break;
      }
      case ARROW.DELETE: {
        configTmpList.splice(+index, 1);
        break;
      }
      case ARROW.DOWM: {
        // 最下面不能往下面移动
        if (+index + 1 >= len) {
          return;
        }
        const configObj = configTmpList.splice(+index, 1);
        configTmpList.splice(+index + 1, 0, ...configObj);
        break;
      }
      default:
        break;
    }
    this.setState({
      configList: configTmpList
    })
  }
  public renderHeaderComponent(name: string | JSX.Element, key: string) {
    return (
    <div className="active-view-name">
      {name}
      <div className="close">
        <ButtonGroup size="small">
          <Button title="上移" ghost={true} size="small" type="primary" onClick={this.moveConfigList.bind(this, key, ARROW.UP)}>
            <Icon type="arrow-up" />
          </Button>
          <Button title="下移" ghost={true} size="small" type="primary" onClick={this.moveConfigList.bind(this, key, ARROW.DOWM)}>
            <Icon type="arrow-down" />
          </Button>
        </ButtonGroup>
        <Button title="删除" ghost={true} size="small" type="primary" onClick={this.moveConfigList.bind(this, key, ARROW.DELETE)}>
          <Icon type="close" />
        </Button>
      </div>
    </div>);
  }
  // 基本信息
  public renderBaseComponent() {
    return (<div className="active-view">
      <div className="active-view-name">
        基本信息
      </div>
      <div className="active-view-content">
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>标题:</Col>
          <Col span={20}><Input size="large" /></Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>背景颜色:</Col>
          <Col span={20}>
            <PickerButton/>
          </Col>
        </Row>
      </div>
    </div>);
  }
  // 图片组件
  public renderImgComponent(configObj: IConfigObj, key: string) {
    const { name, config } = configObj;
    const { previewVisible, previewImage } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (<div key={key} className="active-view">
      {this.renderHeaderComponent(name, key)}
      <div className="active-view-content">
        <Upload
          action="//127.0.0.1:3100/upload"
          listType="picture-card"
          fileList={config.fileList}
          onPreview={this.handleImgPreview}
          onChange={this.handleImgChange.bind(this, key)}
        >
          {config.fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleImgCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    </div>);
  }
  // 表单组件
  public renderFormComponent(configObj: IConfigObj, key: string) {
    const { name, config } = configObj;
    const checkListDom = [];
    for (const itemName in ActiveAdd.formItem) {
      if (ActiveAdd.formItem.hasOwnProperty(itemName)) {
        const element = ActiveAdd.formItem[itemName];
        checkListDom.push(<Col key={itemName} span={4}><Checkbox value={itemName}>{element.name}</Checkbox></Col>);
      }
    }
    return (<div key={key} className="active-view">
      {this.renderHeaderComponent(name, key)}
      <div className="active-view-content">
        <Checkbox.Group style={{ width: '100%' }} defaultValue={config.checkList} onChange={this.onCheckBoxChange.bind(this, key)}>
          <Row>
            {checkListDom}
          </Row>
        </Checkbox.Group>
        {config.checkList.map((itemName: string, index: number) => {
          return <Input key={index} placeholder={`请输入默认${ActiveAdd.formItem[itemName].name}提示信息`} defaultValue={config[itemName] || ActiveAdd.formItem[itemName].value || ''} onChange={this.onCheckBoxInputChange.bind(this, key, itemName)}/>
        })}
      </div>
    </div>);
  }

  // 组件选择
  public renderComponentList() {
    const { configList } = this.state;
    const domList = configList.map((item: IConfigObj, index: number) => {
      switch(item.key) {
        case ActiveAdd.componentType.pic.key: {
          return this.renderImgComponent(item, `${index}-${item.key}-${item.name}.${item.count}`);
        }
        case ActiveAdd.componentType.form.key: {
          return this.renderFormComponent(item, `${index}-${item.key}-${item.name}.${item.count}`);
        }
        default: {
          break;
        }
      }
      return
    })
    return domList;
  }
  public renderComponents() {
    const domList = [];
    for (const key in ActiveAdd.componentType) {
      if (ActiveAdd.componentType.hasOwnProperty(key)) {
        const element = ActiveAdd.componentType[key];
        domList.push(<Button onClick={this.selectComponent.bind(this, element)} key={element.key} type="primary">{element.name}</Button>)
      }
    }
    return (<div>
      {domList}
    </div>)
  }
  public render(): JSX.Element {
    const { configList } = this.state;
    return (<div className="page active-page">
      <ContentHeader title="活动推广页面配置-添加" />
      <div className="active-config">
        <div className="active-config-content">
          <div className="active-config-content-header">配置信息:</div>
          {this.renderBaseComponent()}
          {this.renderComponentList()}
          <div className="active-config-content-btns">
            <Button onClick={this.addComponent}>添加组件</Button>
            <Button onClick={this.submitConfig}>保存配置</Button>
          </div>
        </div>
        <div className="active-config-view">
          <ActiveView configList={configList}/>
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
