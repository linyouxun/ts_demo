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
    const {cityInfo, deviseInfo, source, ip} = this.props;
    let cityStr = '未知';
    if (!!cityInfo.province) {
      cityStr = cityInfo.province + ' ' + cityInfo.city;
    }
    return <div className="statistics-filter">
      <Row>
        <Col span={6} title={ip}>
          <div className="ant-form-item-label"><label className="label">ip</label>{ip}</div>
        </Col>
        <Col span={18} title={source}>
          <div className="ant-form-item-label statistics-filter-source"><label className="label">来源</label>{source}</div>
        </Col>
      </Row>
      <Row>
        <Col span={6} title={cityStr}>
          <div className="ant-form-item-label"><label className="label">地区</label>{cityStr}</div>
        </Col>
        <Col span={6} title={deviseInfo.browser}>
          <div className="ant-form-item-label"><label className="label">浏览器</label>{deviseInfo.browser}</div>
        </Col>
        <Col span={6} title={deviseInfo.platform}>
          <div className="ant-form-item-label"><label className="label">系统</label>{deviseInfo.platform}</div>
        </Col>
        <Col span={6} title={deviseInfo.screen}>
          <div className="ant-form-item-label"><label className="label">屏幕</label>{deviseInfo.screen}</div>
        </Col>
      </Row>
    </div>;
  }
}

export default StatisticsDetail;
