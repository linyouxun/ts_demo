import * as React from 'react';
import ContentHeader from "../components/ContentHeader";
// import FormField from "../components/FormField";
import PickerButton from '../components/PickerButton';
import { Modal, Button, Upload, Icon, Checkbox, Col, Row, Input, Spin } from 'antd';
const ButtonGroup = Button.Group;
import { IMGSERVER, FILETYPE, ARROW, ActiveComponentType, ActiveFormItem } from '../util/const';
import { fetchData } from "../util/request";
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
      configBase: {
        title: '',
        bgColor: 'rgb(239, 239, 239)',
      },
      modalVisible: false,
      previewImage: '',
      previewVisible: false,
      loading: false
    }
  }

  public async componentDidMount() {
    if(/modify/.test(this.props.history.location.pathname)) {
      this.setState({
        loading: true
      });
      const res = await fetchData( {
        id: this.props.history.location.search.split('=')[1]
      }, 'http://localhost:3100/api2/active/list/item', {
        method: 'GET'
      });
      this.setState({
        loading: false
      });
      if (res.code === 200) {
        delete res.result.configBase._id;
        this.setState({
          configList: res.result.configList,
          configBase: res.result.configBase,
        })
      }
    }
  }

  public handleChange(key: string, e: any) {
    const {configBase} = this.state;
    if (key === 'title') {
      configBase.title = e.target.value;
    }
    if (key === 'color') {
      configBase.bgColor = `rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`;
    }
    this.setState({
      configBase
    });
  }
  public async submitConfig() {
    const { configList, configBase } = this.state;
    const res = await fetchData( {
      configList: JSON.stringify(configList),
      configBase: JSON.stringify(configBase)
    }, 'http://127.0.0.1:3100/api2/active/list/add', {
      method: 'POST'
    });
    console.log(res);
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
          moblie: {
            tip: ActiveAdd.formItem.moblie.tip,
            errorTip: ActiveAdd.formItem.moblie.errorTip,
            bgColor: ActiveAdd.formItem.moblie.bgColor,
            color: ActiveAdd.formItem.moblie.color
          },
          button: {
            tip: '提交信息',
            errorTip: '',
            bgColor: 'rgba(255,255,255,1)',
            color: 'rgba(0,0,0,1)'
          },
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
      if (!configObj.config[i]) {
        configObj.config[i] = {
          tip: ActiveAdd.formItem[i].tip,
          errorTip: ActiveAdd.formItem[i].errorTip,
          bgColor: ActiveAdd.formItem[i].bgColor,
          color: ActiveAdd.formItem[i].color
        };
      }
    });
    configList[index] = configObj;
    this.setState({
      configList
    });
  }
  // 复选框（输入款）事件监听
  public onCheckBoxInputChange(key: string, inputKey: string, type: string, event: any) {
    const { configList } = this.state;
    const index = key.split('-')[0];
    const configObj = configList[index];
    switch (type) {
      case 'tip': {
        configObj.config[inputKey].tip = (event.target.value + '').trim();
        break;
      }
      case 'errorTip': {
        configObj.config[inputKey].errorTip = (event.target.value + '').trim();
        break;
      }
      case 'bgColor': {
        configObj.config[inputKey].bgColor = `rgba(${event.rgb.r},${event.rgb.g},${event.rgb.b},${event.rgb.a})`;
        break;
      }
      case 'color': {
        configObj.config[inputKey].color = `rgba(${event.rgb.r},${event.rgb.g},${event.rgb.b},${event.rgb.a})`;
        break;
      }

      default:
        break;
    }
    configList[index] = configObj;
    this.setState({
      configList
    });
  }
  // 输入框背景颜色事件监听
  public handleInputBgChange(inputItem: any, key: string) {
    const { configList } = this.state;
    console.log(configList);
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
    const {configBase} = this.state;
    return (<div className="active-view">
      <div className="active-view-name">
        基本信息
      </div>
      <div className="active-view-content">
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>标题:</Col>
          <Col span={20}><Input size="large" value={configBase.title} onChange={this.handleChange.bind(this, 'title')}/></Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>背景颜色:</Col>
          <Col span={20}>
            <PickerButton handleChange={this.handleChange.bind(this, 'color')} size="large" color={configBase.bgColor}/>
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
          {config.fileList.length >= 5 ? null : uploadButton}
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
          const inputItem = config[itemName];
          return (<div key={index + ActiveAdd.formItem[itemName].name}>
            <div className="active-view-content-form-name">{ActiveAdd.formItem[itemName].name}</div>
            <Row style={{paddingBottom: '.5rem'}}>
              <Col className="ant-form-item-label" span={4}>提示信息:</Col>
              <Col span={20}>
                <Input value={config[itemName].tip} placeholder={`请输入默认${ActiveAdd.formItem[itemName].name}提示信息`} onChange={this.onCheckBoxInputChange.bind(this, key, itemName, 'tip')}/>
              </Col>
            </Row>
            <Row style={{paddingBottom: '.5rem'}}>
              <Col className="ant-form-item-label" span={4}>信息提示:</Col>
              <Col span={20}>
                <Input value={config[itemName].errorTip} placeholder={`请输入默认${ActiveAdd.formItem[itemName].name}未填写信息提示`} onChange={this.onCheckBoxInputChange.bind(this, key, itemName, 'errorTip')}/>
              </Col>
            </Row>
            <Row style={{paddingBottom: '.5rem'}}>
              <Col className="ant-form-item-label" span={4}>字体颜色:</Col>
              <Col span={20}>
                <PickerButton size="default" handleChange={this.onCheckBoxInputChange.bind(this, key, itemName, 'color')} color={inputItem.color}/>
              </Col>
            </Row>
            <Row style={{paddingBottom: '.5rem'}}>
              <Col className="ant-form-item-label" span={4}>背景颜色:</Col>
              <Col span={20}>
                <PickerButton size="default" handleChange={this.onCheckBoxInputChange.bind(this, key, itemName, 'bgColor')} color={inputItem.bgColor}/>
              </Col>
            </Row>
          </div>)
        })}

        <div>
          <div className="active-view-content-form-name">按钮信息</div>
          <Row style={{paddingBottom: '.5rem'}}>
            <Col className="ant-form-item-label" span={4}>文字:</Col>
            <Col span={20}>
              <Input value={config.button.tip} placeholder={`请输入按钮文字(必填)`} onChange={this.onCheckBoxInputChange.bind(this, key, 'button', 'tip')}/>
            </Col>
          </Row>
          <Row style={{paddingBottom: '.5rem'}}>
            <Col className="ant-form-item-label" span={4}>提交文字</Col>
            <Col span={20}>
              <Input value={config.button.errorTip} placeholder={`请输入按钮提交文字信息(非必填)`} onChange={this.onCheckBoxInputChange.bind(this, key, 'button', 'errorTip')}/>
            </Col>
          </Row>
          <Row style={{paddingBottom: '.5rem'}}>
            <Col className="ant-form-item-label" span={4}>按钮文字颜色:</Col>
            <Col span={20}>
              <PickerButton size="default" handleChange={this.onCheckBoxInputChange.bind(this, key, 'button', 'color')} color={config.button.color}/>
            </Col>
          </Row>
          <Row style={{paddingBottom: '.5rem'}}>
            <Col className="ant-form-item-label" span={4}>按钮背景颜色:</Col>
            <Col span={20}>
              <PickerButton size="default" handleChange={this.onCheckBoxInputChange.bind(this, key, 'button', 'bgColor')} color={config.button.bgColor}/>
            </Col>
          </Row>
        </div>

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
    const { configList, configBase, loading } = this.state;
    return (<Spin spinning={loading} tip="加载中" wrapperClassName="page active-page">
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
          <ActiveView configList={configList} configBase={configBase}/>
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
    </Spin>);
  }
}

export default ActiveAdd;
