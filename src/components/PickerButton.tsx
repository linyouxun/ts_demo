import * as React from 'react';
import {Button} from 'antd';
import { SketchPicker, HSLColor, RGBColor } from 'react-color';
import './PickerButton.less';
export declare type ButtonSize = 'small' | 'default' | 'large';
interface IProps {
  handleChange: (color: string | HSLColor | RGBColor) => void;
  size?: ButtonSize;
  color: string;
  width?: string;
}
interface IStyleProps {
  backgroundColor: string;
  width?: string;
}

export class PickerButton extends React.Component<IProps , any> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      flat: false
    }
    this.handleChange = this.handleChange.bind(this);
  }
  public handleClose(flat: boolean, e: any) {
    e.stopPropagation();
    this.setState({
      flat
    })
  }
  public handleChange(color: any) {
    this.props.handleChange(color);
  }
  public render() {
    const { flat } = this.state;
    const style: IStyleProps = {
      backgroundColor: this.props.color
    }
    if (this.props.width) {
      style.width = this.props.width;
    }
    return <Button style={style} size={this.props.size} className="picker-div" onClick={ this.handleClose.bind(this, true) }>
      {flat ? <div className="display-color-picker" onClick={ this.handleClose.bind(this, false) }/> : null}
      {flat ? <SketchPicker color={this.props.color} onChange={ this.handleChange }/> : null}
    </Button>
  }
}
export default PickerButton;
