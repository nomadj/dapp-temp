import React, { Component } from 'react'
import { Card, Grid } from 'semantic-ui-react'
import web3 from '../web3'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import FileRow from '../components/FileRow'

export default class DownloadFiles extends Component {
  // async componentDidMount() {
  //   const accounts = await web3.eth.getAccounts();
  //   const contract = await new web3.eth.Contract(Tambora.abi, this.props.address);
  //   const fileStore = await contract.methods.getFileStore().call({ from: accounts[0] });
  //   this.setState({ fileStore: fileStore });
  // }
  
  render() {
    console.log(this.props.fileStore);
    if (this.props.isTokenHolder) {
      const items = this.props.fileStore.map((obj, i) => {
	return <FileRow name={obj[0]} uri={obj[1]} index={i} />
      });
     
      return (
	<div>
	<h2>File Downloads</h2>
	<Card.Group>
	    {items}
	</Card.Group>
	</div>
      );
    } else {
      return null;
    }
  }
}
