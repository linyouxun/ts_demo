import * as React from 'react';
import { ActiveComponentType, ActiveFormItem } from '../../util/const';
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
    show: false
  }
  public clickBtn(show: boolean) {
    this.setState({
      show
    });
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
    return (<div>
      {configList.map((item: IConfigObj) => {
        switch(item.key) {
          case ActiveView.componentType.pic.key: {
            return AvtiveViewImg({
              fileList: item.config.fileList
            }, `${item.key}-${item.name}-${item.count}`);
          }
          case ActiveView.componentType.swiper.key: {
            return AvtiveViewSwpier({
              fileList: item.config.fileList
            }, `${item.key}-${item.name}-${item.count}`);
          }
          case ActiveView.componentType.form.key: {
            return AvtiveViewForm(item.config, configBase, this.clickBtn.bind(this, true), `${item.key}-${item.name}-${item.count}`);
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
    return (<div className="active-component">
      <div className="active-component-header">
        配置预览:
      </div>
      <section className='active-component-view' style={{backgroundColor: this.props.configBase.bgColor}}>
        {this.renderComponent()}
        {
          this.state.show ? <AvtiveViewModel bgColor={this.props.configBase.modelColor} modelTip={this.props.configBase.modelTip} modelSubTip={this.props.configBase.modelSubTip} onClick={this.clickBtn.bind(this, false)}/> : null
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

function AvtiveViewImg(props: any, key: string) {
  const { fileList } = props;
  if(!!fileList && fileList.length > 0) {
    return (<div key={key}>
      {fileList.map((item: any, index: string) => {
        const height = item.height * 500 / item.width;
        return (<img className="" key={index} src={item.url} style={{
          width: `500px`,
          height: `${height}px`,
        }}/>)
      })}
    </div>);
  }
  return null;
}

function AvtiveViewSwpier(props: any, key: string) {
  const { fileList } = props;
  if(!!fileList && fileList.length > 0) {
    return (<div key={key} className={`swiper-container${key}`}>
      <div className="swiper-wrapper">
        {fileList.map((item: any, index: string) => {
          const height = item.height * 500 / item.width;
          return (<div className="swiper-slide" key={index}>
            <img className="" src={item.url} style={{
              width: `500px`,
              height: `${height}px`,
            }}/>
          </div>)
        })}
      </div>
    </div>);
  }
  return null;
}

function AvtiveViewForm(props: any, configBase: any, submit: any, key: string) {
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
    marginLeft: (formWidth[0] * 5) + 'px',
    width: ((formWidth[1] - formWidth[0]) * 5) + 'px',
    borderRadius: formRadius + 'px',
  };
  if (fileList.length > 0) {
    const image = fileList[0];
    const imageStyle = {
      width: '500px',
      height: (image.height * 500 / image.width) + 'px',
    };
    return <div key={key} className="active-component-view-form-release">
      <img src={image.url} alt="" style={imageStyle}/>
      <div key={key} className="active-component-view-form absolute" style={{top: (5 * formTop) + 'px'}}>
        {checkList.map((item: any, index: string) => {
          const inputStyle = {
            color: props[item].color,
            backgroundColor: props[item].bgColor
          }
          return (<input style={Object.assign({}, formStyle, inputStyle)} key={index} className="input" type="text" placeholder={props[item].tip}/>);
        })}
        <span onClick={submit} style={Object.assign({}, formStyle, {color: props.button.color, backgroundColor: props.button.bgColor})} className="submit">{props.button.tip}</span>
      </div>
    </div>
  }
  return (<div key={key} className="active-component-view-form">
    {checkList.map((item: any, index: string) => {
      const inputStyle = {
        color: props[item].color,
        backgroundColor: props[item].bgColor
      }
      return (<input style={Object.assign({}, formStyle, inputStyle)} key={index} className="input" type="text" placeholder={props[item].tip}/>);
    })}
    <span onClick={submit} style={Object.assign({}, formStyle, {color: props.button.color, backgroundColor: props.button.bgColor})} className="submit">{props.button.tip}</span>
  </div>)
}

export default ActiveView;
