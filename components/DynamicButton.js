import { Button } from 'semantic-ui-react';
import React, { Component } from 'react';

class DynamicButton extends Component {
  render() {
    if (this.props.isShowing) {
      return <Button disabled={this.props.disabled} loading={this.props.loading}  onClick={this.props.onClick} style={{ marginTop: this.props.marginTop, marginBottom: this.props.marginBottom, marginRight: this.props.marginRight, marginLeft: this.props.marginLeft, backgroundColor: 'rgb(0,0,100)', color: 'white'}} icon={this.props.icon} floated={this.props.floated} size={this.props.size} content={this.props.content} id={this.props.id}>{this.props.label}</Button>
    } else {
      return null;
    }
  }
}
export default DynamicButton;
