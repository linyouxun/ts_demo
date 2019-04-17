import * as React from 'react';
import { ActiveComponentType, ActiveFormItem } from '../../util/const';
import { message, Select } from 'antd';
const Option = Select.Option;
import './ActiveView.less';

export interface IConfigObj {
  key: string | number;
  name: string;
  config: any;
  count: string | number;
  show?: boolean | undefined;
}

export interface IConfigBase {
  title: string;
  bgColor: string;
  modelColor: string;
  formRadius: number,
  formWidth: [number],
  modelTip: string,
  modelSubTip: string
}

interface IProps {
  configList: IConfigObj[];
  configBase: IConfigBase;
}

// export interface IConfigList {
//   key: string | number;
//   name: string;
//   config: any;
//   count: string | number;
// }
class ActiveView extends React.Component<IProps, any> {
  public static componentType = ActiveComponentType;
  public static formItem = ActiveFormItem;
  public myswiper: any = null;
  public state = {
    show: false,
    width: 375,
    height: 667,
  }
  constructor(props: any) {
    super(props);
    this.selectChange = this.selectChange.bind(this);
  }
  public clickBtn(item: any, show: boolean) {
    switch(item.key) {
      case ActiveView.componentType.form.key: {
        this.setState({
          show
        });
        break;
      }
      case ActiveView.componentType.btn.key: {
        message.info(`跳转链接(${item.config.button.errorTip || '无'})`);
        break;
      }
      default: {
        this.setState({
          show
        });
        break;
      }
    }
  }

  public selectChange(value: any) {
    const [width, height] = value.split('*');
    this.setState({
      width,
      height
    })
  }

  public componentDidUpdate(){
    const { configList } = this.props;
    configList.map((item: IConfigObj) => {
      switch(item.key) {
        case ActiveView.componentType.swiper.key: {
          // const option = {lazy: {loadPrevNext: true,},autoplay: {stopOnLastSlide: true}};
          const option = {observer:true};
          this.myswiper = new Swiper(`.swiper-container${item.key}-${item.name}-${item.count}`, option);
        }
        default: {
          break;
        }
      }
    })
  }

  public renderComponent() {
    const { configList, configBase } = this.props;
    const { width } = this.state;
    return (<div>
      {configList.map((item: IConfigObj) => {
        switch(item.key) {
          case ActiveView.componentType.pic.key: {
            return AvtiveViewImg({
              fileList: item.config.fileList
            }, `${item.key}-${item.name}-${item.count}`, width);
          }
          case ActiveView.componentType.swiper.key: {
            return AvtiveViewSwpier({
              fileList: item.config.fileList
            }, `${item.key}-${item.name}-${item.count}`, width);
          }
          case ActiveView.componentType.form.key: {
            return AvtiveViewForm(item.config, configBase, this.clickBtn.bind(this, item, true), `${item.key}-${item.name}-${item.count}`, width);
          }
          case ActiveView.componentType.btn.key: {
            return AvtiveViewBtn(item.config, configBase, this.clickBtn.bind(this, item, true), `${item.key}-${item.name}-${item.count}`, width);
          }
          default: {
            break;
          }
        }
        return null;
      })}
    </div>)
  }
  public render():JSX.Element {
    const {width, height} = this.state;
    return (<div className="active-component">
      <div className="active-component-header">
        配置预览:
        <Select onChange={this.selectChange} defaultValue="375*667" style={{width: '300px'}}>
          <Option value="320*568">IPhone5(320 * 568)</Option>
          <Option value="375*667">IPhone6/7/8(375 * 667)</Option>
          <Option value="414*736">IPhone6/7/8 plus(414 * 736)</Option>
          <Option value="375*812">IPhoneX(375 * 812)</Option>
        </Select>
      </div>
      <section className='active-component-view' style={{backgroundColor: this.props.configBase.bgColor, height: height + 'px', width: width + 'px'}}>
        {this.renderComponent()}
        {
          this.state.show ? <AvtiveViewModel bgColor={this.props.configBase.modelColor} modelTip={this.props.configBase.modelTip} modelSubTip={this.props.configBase.modelSubTip} onClick={this.clickBtn.bind(this, {}, false)}/> : null
        }
      </section>
    </div>);
  }
}

function AvtiveViewModel(props: any) {
  return <div className="active-component-model" onClick={props.onClick}>
    <div className="active-component-model-content">
      <div className="active-component-model-content-title" style={{backgroundColor: props.bgColor}}>提示</div>
      <div className="active-component-model-content-tip">{props.modelTip || '您填写的信息已提交成功'}</div>
      <div className="active-component-model-content-tip2">{props.modelSubTip || '感谢您的参与'}</div>
      <div className="active-component-model-content-btn" style={{color: props.bgColor}}>确定</div>
    </div>
  </div>
}

function AvtiveViewImg(props: any, key: string, width: any) {
  const { fileList } = props;
  if(!!fileList && fileList.length > 0) {
    return (<div key={key}>
      {fileList.map((item: any, index: string) => {
        const height = item.height * width / item.width;
        return (<img className="" key={index} src={item.url} style={{
          width: `${width}px`,
          height: `${height}px`,
        }}/>)
      })}
    </div>);
  }
  return null;
}

function AvtiveViewSwpier(props: any, key: string, width: any) {
  const { fileList } = props;
  if(!!fileList && fileList.length > 0) {
    return (<div key={key} className={`swiper-container${key}`}>
      <div className="swiper-wrapper">
        {fileList.map((item: any, index: string) => {
          const height = item.height * width / item.width;
          return (<div className="swiper-slide" key={index}>
            <img className="" src={item.url} style={{
              width: `${width}px`,
              height: `${height}px`,
            }}/>
          </div>)
        })}
      </div>
    </div>);
  }
  return null;
}


function AvtiveViewBtn(props: any, configBase: any, submit: any, key: string, width: any) {
  const { fileList } = props;
  let { formRadius, formWidth, formTop, formHeight } = props;
  if (!formWidth || formWidth.length < 1) {
    formWidth = [10, 90];
  }
  if (!formRadius) {
    formRadius = 0;
  }
  if (!formTop) {
    formTop = 0;
  }
  if (!formHeight) {
    formHeight = 5;
  }
  const formStyle = {
    marginLeft: (formWidth[0] * (width / 100)) + 'px',
    width: ((formWidth[1] - formWidth[0]) * (width / 100)) + 'px',
    height: (formHeight * (width / 100)) + 'px',
    lineHeight: (formHeight * (width / 100)) + 'px',
    fontSize: (width / 100) * 3.5 + 'px',
    borderRadius: formRadius + 'px',
  };
  if (fileList.length > 0) {
    const image = fileList[0];
    const imageStyle = {
      width: width + 'px',
      height: (image.height * width / image.width) + 'px',
    };
    return <div key={key} className="active-component-view-form-release">
      <img src={image.url} alt="" style={imageStyle}/>
      <div key={key} className="active-component-view-form absolute" style={{top: ((width / 100) * formTop) + 'px', paddingBottom: '0'}}>
        <span onClick={submit} style={Object.assign({}, formStyle, {color: props.button.color, backgroundColor: props.button.bgColor})} className="link-btn">{props.button.tip}</span>
      </div>
    </div>
  }
  return (<div key={key} className="active-component-view-form" style={{ paddingBottom: '0' }}>
    <span onClick={submit} style={Object.assign({}, formStyle, {color: props.button.color, backgroundColor: props.button.bgColor})} className="link-btn">{props.button.tip}</span>
  </div>)
}

function AvtiveViewForm(props: any, configBase: any, submit: any, key: string, width: any) {
  const { checkList, fileList } = props;
  let { formRadius, formWidth, formTop } = props;
  if (!formWidth || formWidth.length < 1) {
    formWidth = [10, 90];
  }
  if (!formRadius) {
    formRadius = 0;
  }
  if (!formTop) {
    formTop = 0;
  }
  const formStyle = {
    marginLeft: (formWidth[0] * (width / 100)) + 'px',
    width: ((formWidth[1] - formWidth[0]) * (width / 100)) + 'px',
    borderRadius: formRadius + 'px',
    height: (width / 100) * 11 + 'px',
    lineHeight: (width / 100) * 11 + 'px',
    fontSize: (width / 100) * 3.5 + 'px',
  };
  if (fileList.length > 0) {
    const image = fileList[0];
    const imageStyle = {
      width: width + 'px',
      height: (image.height * width / image.width) + 'px',
    };
    return <div key={key} className="active-component-view-form-release">
      <img src={image.url} alt="" style={imageStyle}/>
      <div key={key} className="active-component-view-form absolute" style={{top: ((width / 100) * formTop) + 'px', padding: '0' }}>
        {checkList.map((item: any, index: string) => {
          const inputStyle = {
            color: props[item].color,
            backgroundColor: props[item].bgColor
          }
          return (<input style={Object.assign({}, formStyle, inputStyle, {marginBottom: (width / 100) * 4 + 'px'})} key={index} className="input" type="text" placeholder={props[item].tip}/>);
        })}
        <span onClick={submit} style={Object.assign({}, formStyle, {marginTop: (width / 100) * 2 + 'px', color: props.button.color, backgroundColor: props.button.bgColor})} className="submit">{props.button.tip}</span>
      </div>
    </div>
  }
  return (<div key={key} className="active-component-view-form" style={{ padding: ((width / 100) * 4) + 'px 0' }}>
    {checkList.map((item: any, index: string) => {
      const inputStyle = {
        color: props[item].color,
        backgroundColor: props[item].bgColor
      }
      return (<input style={Object.assign({}, formStyle, inputStyle, {marginBottom: (width / 100) * 4 + 'px'})} key={index} className="input" type="text" placeholder={props[item].tip}/>);
    })}
    <span onClick={submit} style={Object.assign({}, formStyle, {marginTop: (width / 100) * 2 + 'px', color: props.button.color, backgroundColor: props.button.bgColor})} className="submit">{props.button.tip}</span>
  </div>)
}

export default ActiveView;
