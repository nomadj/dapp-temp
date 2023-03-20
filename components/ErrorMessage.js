import { Message } from 'semantic-ui-react'
import React, { Component } from 'react'

export default class ErrorMessage extends Component {
  render() {
    if (this.props.isShowing) {
      return <Message error color='pink' header={this.props.header} content={this.props.content} />;
    } else {
      return null;
    }
  }
}
