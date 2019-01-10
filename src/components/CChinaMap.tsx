import * as React from "react";
import { Chart, View, Geom, Tooltip } from 'bizcharts';
// import { Label } from 'bizcharts';
import { chinaData, cityMap } from '../util/china';

interface ICityItem {
  province: string;
  adcode: string;
  sum: number;
}

interface IProps {
  cityData: ICityItem[];
  height?: number;
  forceFit?: boolean;
  onPlotClick?(ev: G2.EventParams): void;
}

class CChinaMap extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
    this.renderTip = this.renderTip.bind(this);
    this.onPlotClick = this.onPlotClick.bind(this);
  }


  // public componentDidMount() {
  // }
  /**
   * render
   */
  public renderTip(title: any, items: any): string {
    console.log(title, items);
    return `<div style>${title}</div>`;
  }
  public onPlotClick(ev: any) {
    if(!!this.props.onPlotClick) {
      this.props.onPlotClick(ev)
    }
  }

  public render(): JSX.Element{
    const cityObjSum = {};
    this.props.cityData.forEach((item: ICityItem) => {
      cityObjSum[item.province] = item.sum
    })
    const tooltipCfg = {
      // custom: true,
      containerTpl: `<div class="g2-tooltip">
        <div class="g2-tooltip-title" style="margin-bottom: 4px;"></div>
        <div class="g2-tooltip-list"></div>
      </div>`,
      itemTpl: '<div class="g2-tooltip-list-item">{name}: {value}</div>'
    };
    let maxCount = 0;
    // 转化数据源
    const geoDv = new window.DataSet.View().source(chinaData, {
      type: 'GeoJSON',
    }).transform({
      type: 'map',
      callback: function callback(row: any, index: any) {
        const a: any = cityMap[row.name] || {"code":"0","name":"其他"};
        row.code = a.code;
        row.count = cityObjSum[row.name] || 0;
        if (maxCount < row.count) {
          maxCount = row.count;
        }
        return row;
      },
    });
    // 设置数据源字段
    const scale = {
      latitude: {
        sync: true,
        nice: false,
      },
      longitude: {
        sync: true,
        nice: false,
      },
      name: {
        alias: '省'
      },
      count: {
        alias: '访问次数'
      }
    };
    return(<div className="china-map">
      <Chart height={this.props.height || 400} width={!!this.props.height ? this.props.height * 1.25 : 500} scale={scale} forceFit={this.props.forceFit || false} padding={0} onPlotClick={this.onPlotClick}>
        <View data={geoDv}>
          <Geom type="polygon" position="longitude*latitude" opacity={1}
            color={['count', (count: any) => {
              const per = Math.ceil((1 - count / (maxCount || 1)) * 7)
              return `rgb(${25.5 * per}, ${25.5 * per}, ${25.5 * per})`;
            }]}
            tooltip={['name*count', (name: any, count: any) => {
              return {
                name: '访问次数',
                value: count+''
              }
            }]}>
            {/* <Label content="name" offset={0} /> */}
          </Geom>
        </View>
        <Tooltip title='name' {...tooltipCfg} />
        {/* <Tooltip title='name'/> */}
        {/* <Tooltip useHtml={true} htmlContent={this.renderTip}/> */}
        {/* <Tooltip htmlContent containerTpl={this.renderTip}/> */}
      </Chart>
    </div>);
  }
}

export default CChinaMap;
