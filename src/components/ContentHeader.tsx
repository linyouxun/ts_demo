import * as React from "react";
import "./ContentHeader.less";

interface IProps {
  title: string,
  side?: any
}

export default class ContentHeader extends React.Component<IProps, any> {
  public constructor(props: IProps) {
    super(props);
  }
  public render() {
    const {title, side} = this.props;
    return (
      <header className="component cont-header">
        <h1 className="cont-title">{title}</h1>
        {side ? (
          <div className="cont-side">{side}</div>
        ) : null}
        <div className="clearfix" />
        <hr className="dividing-line"/>
      </header>
    )
  }
}
