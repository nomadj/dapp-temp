import { Button } from 'semantic-ui-react';
import React, { Component } from 'react';

class DynamicButton extends Component {
  render() {
    if (this.props.isShowing) {
      return <Button color={this.props.color} onClick={this.props.onClick} style={{ marginTop: '10px' }}>{this.props.label}</Button>
    } else {
      return null;
    }
  }
}
export default DynamicButton;
