import { Message } from 'semantic-ui-react'
import React, { Component } from 'react'

class SuccessMessage extends Component {
  render() {
    if (this.props.isShowing) {
      return <Message success header={this.props.header} content={this.props.content} />;
    } else {
      return null;
    }
  }
}
export default SuccessMessage;
