import { Button } from 'semantic-ui-react';
import React, { Component } from 'react';
import web3 from '../web3';
import { abi } from '../abi';

class DownloadButton extends Component {
  state = {
    address: ''
  }
  componentDidMount() {
    this.setState({ address: this.props.address });
  }
  onPress = async () => {
    const contract = new web3.eth.Contract(abi, this.props.address);
    const accounts = await web3.eth.getAccounts();
    // await contract.methods.approve('0x1b22C7F2F78Ff350Ac03c4b7ac95eCcda96FC212', 0).send({
    //   from: accounts[0]
    // });
    await contract.methods.safeTransferFrom(accounts[0], '0x1b22C7F2F78Ff350Ac03c4b7ac95eCcda96FC212', 0).send({
      from: accounts[0]
    });
  }
  render() {
    if (this.props.isTokenHolder === true) {
      return <Button color='olive' onClick={this.onPress}>Download Materials</Button>;
    } else {
      return null;
    }
  }
}

export default DownloadButton;
