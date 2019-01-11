import * as React from 'react';
import './FormField.less';
interface IProps {
  header?: any;
  className?: string;
  contentClassName?: any;
  children?: any;
}

export default class FormField extends React.Component<IProps, any> {
  public render() {
    const {header, className, contentClassName} = this.props;
    return (
      <div className={`form-field ${className ? className : ''}`}>
        {
          typeof header === 'object' ? <div className="form-field-boder-bottom">
            {header.title || '标题'}
            <div className='float-right click padding-right'>
              {header.more}
            </div>
          </div>: null
        }
        <div className={`${contentClassName ? contentClassName : ''}`}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
