import { Button } from 'semantic-ui-react';
import React, { Component } from 'react';

class DynamicButton extends Component {
  render() {
    if (this.props.isShowing) {
      return <Button loading={this.props.loading} color={this.props.color} onClick={this.props.onClick} style={{ marginTop: this.props.marginTop, marginBottom: this.props.marginBottom, marginRight: this.props.marginRight, marginLeft: this.props.marginLeft }}>{this.props.label}</Button>
    } else {
      return null;
    }
  }
}
export default DynamicButton;
