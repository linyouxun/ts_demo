import * as React from 'react';
import './FormField.less';
interface IProps {
  title?: string;
  afterContent?: any;
  className?: string;
  children?: any;
}

export default class FormField extends React.Component<IProps, any> {
  public render() {
    const {title, afterContent, className} = this.props;
    const emptyHeader = !title && !afterContent;
    return (
      <div className={`component form-field ${className ? className : ''}`}>
        {emptyHeader ? null : (
          <div className="header">
            <p className="title">
              {title}
              <span className="after-content">{afterContent}</span>
            </p>
          </div>
        )}
        <div className="content">
          {this.props.children}
        </div>
      </div>
    )
  }
}
