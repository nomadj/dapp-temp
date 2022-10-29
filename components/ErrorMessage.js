import { Message } from 'semantic-ui-react'
import React, { Component } from 'react'

class ErrorMessage extends Component {
  render() {
    if (this.props.isShowing) {
      return <Message error header={this.props.header} content={this.props.content} />;
    } else {
      return null;
    }
  }
}
export default ErrorMessage;
