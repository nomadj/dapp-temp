import { Message } from 'semantic-ui-react'
import React, { Component } from 'react'

export default class SuccessMessage extends Component {
  render() {
    if (this.props.isShowing) {
      return <Message success color='orange' header={this.props.header} content={this.props.content} style={{ overflowWrap: 'break-word' }} />;
    } else {
      return null;
    }
  }
}
