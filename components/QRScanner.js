import React, { Component } from 'react'
import QrReader from 'react-qr-scanner'
import { Icon } from 'semantic-ui-react'

class QRScanner extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 100,
      result: 'No result',
      showing: false
    }

    this.handleScan = this.handleScan.bind(this)
  }
  handleScan(data){
    this.setState({
      result: data,
    })
  }
  handleError(err){
    console.error(err)
  }
  render(){
    const previewStyle = {
      height: 240,
      width: 320,
    }
    return(
      <div>
      <Icon name='camera' onClick={() => {
	      this.setState({ showing: !this.state.showing })
	    }} />
      {this.state.showing ? (
        <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
	  facingMode='rear'
        />) : (
	  null)}
        <p>{this.state.result}</p> 
      </div>
    )
  }
}

export default QRScanner;
