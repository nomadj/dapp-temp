import { Progress } from 'semantic-ui-react';
import React, { Component } from 'react';

class ProgBar extends Component {
  render() {
    if (this.props.isShowing) {
      return <Progress percent={this.props.percent} color={this.props.color} />
    } else {
      return null
    }
  }
}
export default ProgBar;
