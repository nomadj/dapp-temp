import React, { Component } from 'react'
import { Card, Button } from 'semantic-ui-react'
import web3 from '../web3'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import Link from 'next/link'
import InfoMessage from '../components/InfoMessage'

export default class FileRow extends Component {
  state = {
    infoMessage: '',
    loading: false
  }

  async downloadFile(url, fileName) {
    console.log(url, '____', fileName);
    const res = await fetch(url, { method: 'get', mode: 'cors', referrerPolicy: 'no-referrer' })
    const blob = await res.blob()
    const aElement = document.createElement('a');
    aElement.setAttribute('download', fileName);
    const href = URL.createObjectURL(blob);
    aElement.href = href;
    aElement.setAttribute('target', '_blank');
    aElement.click();
    URL.revokeObjectURL(href);
    this.setState({ loading: false });
  } 
 
  onClick = async () => {
    this.setState({ infoMessage: 'Your download has begun, and will be available in your Downloads folder.', loading: true });
    setTimeout(() => this.setState({ infoMessage: '' }), 5000);
    await this.downloadFile(this.props.uri, this.props.name);
  }
  
  render() {
    return (
      <Card style={{ borderBottom: '2px solid rgba(72,0,72)' }}>
	<Card.Content>
	  <Button loading={this.state.loading} floated='right' style= {{ backgroundColor: 'rgba(0,0,100)', color: 'white' }} size='mini' icon='download' onClick={this.onClick} />
	  <Card.Header>{this.props.name}</Card.Header>
	  <InfoMessage isShowing={!!this.state.infoMessage} header='Downloading...' content={this.state.infoMessage} />	  
	</Card.Content>
	<InfoMessage />
      </Card>
    );
  }
  
}
