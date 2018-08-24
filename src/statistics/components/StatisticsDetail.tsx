import * as React from 'react';
import './StatisticsDetail.less';
import { Row, Col } from 'antd';

export interface IStatisticsDetailProps {
  cityInfo: {
    adcode: string,
    city: string,
    province: string,
  };
  ip: string;
  source: string;
  deviseInfo: {
    browser: string,
    platform: string,
    screen: string,
  };
}


class StatisticsDetail extends React.Component<IStatisticsDetailProps, any> {
  public render() {
    const {cityInfo, deviseInfo, source} = this.props;
    let cityStr = '未知';
    if (!!cityInfo.province) {
      cityStr = cityInfo.province + ' ' + cityInfo.city;
    }
    return <div className="statistics-filter">
      <div className="ant-form-item-label"><label className="label">来源</label>{source}</div>
      <Row>
        <Col span={6}>
          <div className="ant-form-item-label"><label className="label">地区</label>{cityStr}</div>
        </Col>
        <Col span={6}>
          <div className="ant-form-item-label"><label className="label">浏览器</label>{deviseInfo.browser}</div>
        </Col>
        <Col span={6}>
          <div className="ant-form-item-label"><label className="label">系统</label>{deviseInfo.platform}</div>
        </Col>
        <Col span={6}>
          <div className="ant-form-item-label"><label className="label">屏幕</label>{deviseInfo.screen}</div>
        </Col>
      </Row>
    </div>;
  }
}

export default StatisticsDetail;
