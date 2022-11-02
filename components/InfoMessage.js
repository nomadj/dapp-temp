import { Message } from 'semantic-ui-react'
import React, { Component } from 'react'

class InfoMessage extends Component {
  render() {
    if (this.props.isShowing) {
      return <Message info header={this.props.header} content={this.props.content} style={{ marginTop: '10px', marginBottom: '10px' }} />;
    } else {
      return null;
    }
  }
}
export default InfoMessage;
