import * as React from 'react';
import ContentHeader from "../components/ContentHeader";
// import FormField from "../components/FormField";
import PickerButton from '../components/PickerButton';
import { Modal, Button, Upload, Icon, Checkbox, Col, Row, Input, Spin, Slider, message, InputNumber } from 'antd';
const ButtonGroup = Button.Group;
import { APISERVER, IMGSERVER, FILETYPE, ARROW, ActiveComponentType, ActiveFormItem, marksWidth, marksRadius, marksTop, marksHeight } from '../util/const';
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
    this.beforeUpload = this.beforeUpload.bind(this);

    this.state = {
      // configList: [],
      configList: [],
      configBase: {
        title: '',
        bgColor: 'rgb(239, 239, 239)',
        modelColor: 'rgb(158, 158, 158)',
        modelTip: '您填写的信息已提交成功',
        modelSubTip: '感谢您的参与',
        apiId: ''
      },
      modalVisible: false,
      previewImage: '',
      previewVisible: false,
      loading: false,
      id: '',
    }
  }

  public async componentDidMount() {
    if(/modify/.test(this.props.history.location.pathname)) {
      this.setState({
        loading: true
      });
      const res = await fetchData( {
        id: this.props.history.location.search.split('=')[1]
      }, `${APISERVER}/api2/active/list/item`, {
        method: 'GET'
      });
      this.setState({
        loading: false
      });
      if (res.stutasCode === 200) {
        this.setState({
          id: res.result._id,
          configList: res.result.configList,
          configBase: res.result.configBase,
        })
      } else {
        Modal.error({
          title: `${this.props.history.location.search.split('=')[1]}已失效`,
          okText: '返回列表',
          onOk: () => {
            this.props.history.push('/active/list');
          }
        });
      }
    }
  }

  // 表单值改变
  public handleChange(key: string, e: any) {
    const {configBase} = this.state;
    if (key === 'title') {
      configBase.title = e.target.value;
    }
    if (key === 'modelTip') {
      configBase.modelTip = e.target.value;
    }
    if (key === 'remark') {
      configBase.remark = e.target.value;
    }
    if (key === 'modelSubTip') {
      configBase.modelSubTip = e.target.value;
    }
    if (key === 'color') {
      configBase.bgColor = `rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`;
    }
    if (key === 'modelColor') {
      configBase.modelColor = `rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`;
    }
    if (key === 'apiId') {
      configBase.apiId = e;
    }
    this.setState({
      configBase
    });
  }
  // 提交页面
  public async submitConfig() {
    const { configList, configBase, id } = this.state;
    const data: any = {
      configList: JSON.stringify(configList),
      configBase: JSON.stringify(configBase)
    }
    let url = `${APISERVER}/api2/active/list/add`;
    if (!!id) {
      url = `${APISERVER}/api2/active/list/update`;
      data.id = id;
    }
    this.setState({
      loading: true
    });
    const res = await fetchData( data, url, {
      method: 'POST'
    });
    this.setState({
      loading: false
    });
    if(res.stutasCode === 200) {
      message.success('保存成功');
      return this.props.history.goBack();
    }
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
      case ActiveAdd.componentType.swiper.key: {
        configObj.config = {
          fileList: []
        }
        break;
      }
      case ActiveAdd.componentType.form.key: {
        configObj.config = {
          formRadius: 0,
          formTop: 0,
          formWidth: [ 10, 90],
          fileList: [],
          checkList: ['mobile', 'name'],
          mobile: {
            tip: ActiveAdd.formItem.mobile.tip,
            errorTip: ActiveAdd.formItem.mobile.errorTip,
            bgColor: ActiveAdd.formItem.mobile.bgColor,
            color: ActiveAdd.formItem.mobile.color
          },
          name: {
            tip: ActiveAdd.formItem.name.tip,
            errorTip: ActiveAdd.formItem.name.errorTip,
            bgColor: ActiveAdd.formItem.name.bgColor,
            color: ActiveAdd.formItem.name.color
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
      case ActiveAdd.componentType.btn.key: {
        configObj.config = {
          formRadius: 0,
          formTop: 0,
          formWidth: [ 10, 90],
          formHeight: 10,
          fileList: [],
          button: {
            tip: '我是个链接',
            errorTip: '',
            type: 1, // 1.顶置， 2跳转
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

  // 图片大小设置
  public beforeUpload(file: any) {
    if (!/image/.test(file.type)) {
      message.error('文件格式不支持，请大佬重新上传(png,jpg,git等)图片文件');
      return false;
    }
    const kb = file.size / 1024 ;
    if (kb >= 500) {
      message.error('图片超过500kB，请大佬压缩后上传');
      return false;
    }
    return true;
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
      case FILETYPE.error: {
        configObj.config.fileList = item.fileList;
        configList[index] = configObj;
        break;
      }
      default: {
        // configObj.config.fileList = item.fileList;
        // configList[index] = configObj;
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
  // 表单基本信息
  public handleFormChange(key: string, inputKey: string, e: any) {
    const { configList } = this.state;
    const index = key.split('-')[0];
    const configObj = configList[index];
    if (inputKey === 'formWidth') {
      configObj.config.formWidth = e;
    }
    if (inputKey === 'formHeight') {
      configObj.config.formHeight = e;
    }
    if (inputKey === 'formRadius') {
      configObj.config.formRadius = e;
    }
    if (inputKey === 'formTop') {
      configObj.config.formTop = e;
    }
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
    // 基本信息
    if (key === 'baseConfig') {
      const { configBase } = this.state;
      if (arrwoType === ARROW.SHOW) {
        configBase.show = true;
      } else {
        configBase.show = false;
      }
      this.setState({
        configBase
      })
      return ;
    }
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
      case ARROW.HIDE: {
        // 最小化
        const configObj = configTmpList[index];
        configObj.show = false;
        configTmpList[index] = configObj;
        break;
      }
      case ARROW.SHOW: {
        // 最大化
        const configObj = configTmpList[index];
        configObj.show = true;
        configTmpList[index] = configObj;
        break;
      }
      default:
        break;
    }
    this.setState({
      configList: configTmpList
    })
  }
  public renderHeaderComponent(name: string | JSX.Element, key: string, show: boolean | undefined) {
    return (
    <div className="active-view-name">
      {name}
      <div className="close">
        {
          !show ? <Button title="展开" ghost={true} size="small" type="primary" onClick={this.moveConfigList.bind(this, key, ARROW.SHOW)}>
            <Icon type="plus" />
          </Button> : <Button title="缩小" ghost={true} size="small" type="primary" onClick={this.moveConfigList.bind(this, key, ARROW.HIDE)}>
            <Icon type="minus" />
          </Button>
        }
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
    let style: {
      height?: string;
      overflow?: string;
      padding?: string;
    } = {
      height: '0',
      overflow: 'hidden',
      padding: '0'
    };
    if (!!configBase.show) {
      style = {}
    }
    return (<div className="active-view">
      <div className="active-view-name">
        基本信息
        <div className="close">
          {
            !configBase.show ? <Button title="展开" ghost={true} size="small" type="primary" onClick={this.moveConfigList.bind(this, 'baseConfig', ARROW.SHOW)}>
              <Icon type="plus" />
            </Button> : <Button title="缩小" ghost={true} size="small" type="primary" onClick={this.moveConfigList.bind(this, 'baseConfig', ARROW.HIDE)}>
              <Icon type="minus" />
            </Button>
          }
        </div>
      </div>
      <div className="active-view-content" style={style}>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>备注:</Col>
          <Col span={20}><Input size="large" placeholder="备注信息，不在投放页面显示" value={configBase.remark} onChange={this.handleChange.bind(this, 'remark')}/></Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>标题:</Col>
          <Col span={20}><Input size="large" placeholder="投放页面标题" value={configBase.title} onChange={this.handleChange.bind(this, 'title')}/></Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>背景颜色:</Col>
          <Col span={20}>
            <PickerButton pos={'bottom'} handleChange={this.handleChange.bind(this, 'color')} size="large" color={configBase.bgColor}/>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>弹框颜色:</Col>
          <Col span={20}>
            <PickerButton pos={'bottom'} handleChange={this.handleChange.bind(this, 'modelColor')} size="large" color={configBase.modelColor}/>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>弹框提示1:</Col>
          <Col span={20}>
            <Col span={20}><Input size="large" value={configBase.modelTip} onChange={this.handleChange.bind(this, 'modelTip')}/></Col>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>弹框提示2:</Col>
          <Col span={20}>
            <Col span={20}><Input size="large" value={configBase.modelSubTip} onChange={this.handleChange.bind(this, 'modelSubTip')}/></Col>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>上报ID:</Col>
          <Col span={20}>
            <Col span={20}><InputNumber style={{width: '100%'}} size="large" value={configBase.apiId} onChange={this.handleChange.bind(this, 'apiId')}/></Col>
          </Col>
        </Row>
      </div>
    </div>);
  }
  // 图片组件
  public renderImgComponent(configObj: IConfigObj, key: string) {
    const { name, config, show = false } = configObj;
    const { previewVisible, previewImage } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    let style: {
      height?: string;
      overflow?: string;
      padding?: string;
    } = {
      height: '0',
      overflow: 'hidden',
      padding: '0'
    };
    if (show) {
      style = {}
    }
    return (<div key={key} className="active-view">
      {this.renderHeaderComponent(name, key, show)}
      <div className="active-view-content" style={style}>
        <Upload
          action={`${APISERVER}/upload`}
          listType="picture-card"
          fileList={config.fileList}
          onPreview={this.handleImgPreview}
          beforeUpload={this.beforeUpload}
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
    const { previewVisible, previewImage } = this.state;
    const { name, config, show } = configObj;
    const checkListDom = [];
    for (const itemName in ActiveAdd.formItem) {
      if (ActiveAdd.formItem.hasOwnProperty(itemName)) {
        const element = ActiveAdd.formItem[itemName];
        checkListDom.push(<Col key={itemName} span={6}><Checkbox value={itemName}>{element.name}</Checkbox></Col>);
      }
    }
    let style: {
      height?: string;
      overflow?: string;
      padding?: string;
    } = {
      height: '0',
      overflow: 'hidden',
      padding: '0'
    };
    if (show) {
      style = {}
    }
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (<div key={key} className="active-view">
      {this.renderHeaderComponent(name, key, show)}
      <div className="active-view-content" style={style}>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>表单宽度:</Col>
          <Col span={20}>
            <Slider range={true} marks={ marksWidth } step={1} value={config.formWidth || [10, 90]} onChange={this.handleFormChange.bind(this, key, 'formWidth')}/>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>表单圆角:</Col>
          <Col span={20}>
            <Slider max={25} min={0} marks={ marksRadius } step={1} value={config.formRadius || 0} onChange={this.handleFormChange.bind(this, key, 'formRadius')}/>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>背景图片:</Col>
          <Col span={20}>
            <Upload
              action={`${APISERVER}/upload`}
              listType="picture-card"
              fileList={config.fileList || []}
              onPreview={this.handleImgPreview}
              beforeUpload={this.beforeUpload}
              onChange={this.handleImgChange.bind(this, key)}
            >
              {config.fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleImgCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>上下微调:</Col>
          <Col span={20}>
            <Slider disabled={config.fileList.length < 1} max={100} min={0} marks={ marksTop } step={.01} value={config.formTop || 0} onChange={this.handleFormChange.bind(this, key, 'formTop')}/>
          </Col>
        </Row>
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
            <Col className="ant-form-item-label" span={4}>文字颜色:</Col>
            <Col span={20}>
              <PickerButton size="default" handleChange={this.onCheckBoxInputChange.bind(this, key, 'button', 'color')} color={config.button.color}/>
            </Col>
          </Row>
          <Row style={{paddingBottom: '.5rem'}}>
            <Col className="ant-form-item-label" span={4}>背景颜色:</Col>
            <Col span={20}>
              <PickerButton size="default" handleChange={this.onCheckBoxInputChange.bind(this, key, 'button', 'bgColor')} color={config.button.bgColor}/>
            </Col>
          </Row>
        </div>

      </div>
    </div>);
  }

  // 按钮组件
  public renderBtnComponent(configObj: IConfigObj, key: string) {
    const { name, config, show } = configObj;
    const { previewVisible, previewImage } = this.state;
    let style: {
      height?: string;
      overflow?: string;
      padding?: string;
    } = {
      height: '0',
      overflow: 'hidden',
      padding: '0'
    };
    if (show) {
      style = {}
    }
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (<div key={key} className="active-view">
      {this.renderHeaderComponent(name, key, show)}
      <div className="active-view-content" style={style}>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>按钮宽度:</Col>
          <Col span={20}>
            <Slider range={true} marks={ marksWidth } step={1} value={config.formWidth || [10, 90]} onChange={this.handleFormChange.bind(this, key, 'formWidth')}/>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>按钮高度:</Col>
          <Col span={20}>
            <Slider max={25} min={0} marks={ marksHeight } step={.01} value={config.formHeight || 0} onChange={this.handleFormChange.bind(this, key, 'formHeight')}/>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>按钮圆角:</Col>
          <Col span={20}>
            <Slider max={25} min={0} marks={ marksRadius } step={1} value={config.formRadius || 0} onChange={this.handleFormChange.bind(this, key, 'formRadius')}/>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>文字:</Col>
          <Col span={20}>
            <Input value={config.button.tip} placeholder={`请输入按钮文字(必填)`} onChange={this.onCheckBoxInputChange.bind(this, key, 'button', 'tip')}/>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>跳转链接:</Col>
          <Col span={20}>
            <Input value={config.button.errorTip} placeholder={`请输入跳转链接`} onChange={this.onCheckBoxInputChange.bind(this, key, 'button', 'errorTip')}/>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>文字颜色:</Col>
          <Col span={20}>
            <PickerButton size="default" handleChange={this.onCheckBoxInputChange.bind(this, key, 'button', 'color')} color={config.button.color}/>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>背景颜色:</Col>
          <Col span={20}>
            <PickerButton size="default" handleChange={this.onCheckBoxInputChange.bind(this, key, 'button', 'bgColor')} color={config.button.bgColor}/>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>背景图片:</Col>
          <Col span={20}>
            <Upload
              action={`${APISERVER}/upload`}
              listType="picture-card"
              fileList={config.fileList || []}
              onPreview={this.handleImgPreview}
              beforeUpload={this.beforeUpload}
              onChange={this.handleImgChange.bind(this, key)}
            >
              {config.fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleImgCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Col>
        </Row>
        <Row style={{paddingBottom: '.5rem'}}>
          <Col className="ant-form-item-label" span={4}>上下微调:</Col>
          <Col span={20}>
            <Slider disabled={config.fileList.length < 1} max={100} min={0} marks={ marksTop } step={.01} value={config.formTop || 0} onChange={this.handleFormChange.bind(this, key, 'formTop')}/>
          </Col>
        </Row>
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
        case ActiveAdd.componentType.swiper.key: {
          return this.renderImgComponent(item, `${index}-${item.key}-${item.name}.${item.count}`);
        }
        case ActiveAdd.componentType.form.key: {
          return this.renderFormComponent(item, `${index}-${item.key}-${item.name}.${item.count}`);
        }
        case ActiveAdd.componentType.btn.key: {
          return this.renderBtnComponent(item, `${index}-${item.key}-${item.name}.${item.count}`);
        }
        default: {
          break;
        }
      }
      return null;
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
