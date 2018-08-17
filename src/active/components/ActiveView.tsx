import * as React from 'react';
import { ActiveComponentType, ActiveFormItem } from '../../util/const';
import './ActiveView.less';

export interface IConfigObj {
  key: string | number;
  name: string;
  config: any;
  count: string | number;
}
export interface IConfigBase {
  title: string;
  bgColor: string;
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
  public renderComponent() {
    const { configList } = this.props;
    return (<div>
      {configList.map((item: IConfigObj) => {
        switch(item.key) {
          case ActiveView.componentType.pic.key: {
            return AvtiveViewImg(item.config, `${item.key}-${item.name}.${item.count}`);
          }
          case ActiveView.componentType.form.key: {
            return AvtiveViewForm(item.config, `${item.key}-${item.name}.${item.count}`);
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
      </section>
    </div>);
  }
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
function AvtiveViewForm(props: any, key: string) {
  const { checkList } = props;
  return (<div key={key} className="active-component-view-form">
    {checkList.map((item: any, index: string) => {
      return (<input style={{color: props[item].color, backgroundColor: props[item].bgColor}} key={index} className="input" type="text" placeholder={props[item].tip}/>);
    })}
    <span style={{color: props.button.color, backgroundColor: props.button.bgColor}} className="submit">{props.button.tip}</span>
  </div>)
}

export default ActiveView;
