import { Button } from 'semantic-ui-react';
import React, { Component } from 'react';

class DynamicButton extends Component {
  render() {
    if (this.props.isShowing) {
      return <Button disabled={this.props.disabled} loading={this.props.loading} color={this.props.color} onClick={this.props.onClick} style={{ marginTop: this.props.marginTop, marginBottom: this.props.marginBottom, marginRight: this.props.marginRight, marginLeft: this.props.marginLeft }} icon={this.props.icon}>{this.props.label}</Button>
    } else {
      return null;
    }
  }
}
export default DynamicButton;
