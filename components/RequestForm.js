import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import web3 from '../web3';
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import DynamicButton from './DynamicButton'
import { create } from 'ipfs-http-client'
import InfoMessage from './InfoMessage'
import Router from 'next/router'

class RequestForm extends Component {
  state = {
    name: '',
    errorMessage: '',
    successMessage: '',
    infoMessage: '',
    loading: false,
    success: false,
    isInteracting: false,
  };

  thrower = () => {
    
    if (this.state.name === '') {
      throw {message: 'Please enter your primary identifier'};
    }
  }

  createMeta = async () => {
    this.setState({ loading: true, errorMessage: '', infoMessage: '', success: false, successMessage: '' });
    try {
      const metadata = {
	"name": this.props.userName,
	"image": this.props.metadata.image,
	"attributes": [
	  {
	    "trait_type": "title",
	    "value": "student"
	  },
	  {
	    "trait_type": "role",
	    "value": "client"
	  }
	]
      };
    const data = JSON.stringify(metadata);
      await this.ipfsAddJSON(data);
    } catch (error) {
      this.setState({ errorMessage: error.message, loading: false });
    }
  }

  ipfsAddJSON = async (file) => {
    const auth = 'Basic ' + Buffer.from(process.env.PROJECT_ID + ':' + process.env.PROJECT_SECRET).toString('base64');

    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
	authorization: auth
      }
    })
    try {
      const added = await client.add(file, { progress: prog  => console.log(`Received: ${prog}`)});
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
      this.setState({ isInteracting: true, infoMessage: 'Interacting with the Ethereum Blockchain' });
      const tx = await contract.methods.finalizeClient(`ipfs://${added.path}`).send({ from: accounts[0] });
      console.log("Finalized! --> ", tx.transactionHash);
      this.setState({ loading: false, successMessage: `Transaction completed at ${tx.transactionHash}`, isInteracting: false, infoMessage: '', txHash: tx.transactionHash });
    } catch (event) {
      console.log(event);
      this.setState({ errorMessage: 'Unable to process file. Only png, mp4, and JSON available at this time.', loading: false, infoMessage: '', isInteracting: false });
    }
  }

  mintNFT = async (cid) => {
    this.setState({ isInteracting: true, infoMessage: 'Interacting with Ethereum Blockchain' });
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
    const tx = await contract.methods.mint(accounts[0], `ipfs://${cid}`).send({from: accounts[0]});
      this.setState({ success: true });
      // const pusher = async () => {
      // 	console.log('Minted successfully at: ', tx.transactionHash)
      // 	Router.push({pathname: '/', query: [tx.transactionHash]});
      // }
      // setTimeout(pusher, 3000);
      console.log('Minted successfully at: ', tx.transactionHash);
      this.setState({ loading: false, success: true, isInteracting: false, infoMessage: '', txHash: tx.transactionHash });
      return tx.transactionHash;
    } catch (error){
      this.setState({ errorMessage: error.message, loading: false, infoMessage: '' })
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
    this.setState({ loading: true, errorMessage: '', successMessage: '' });

    try {
      this.thrower();
      const accounts = await web3.eth.getAccounts();
      await contract.methods.requestApproval(this.state.name).send({ from: accounts[0] });
      this.setState({ successMessage: 'Your request has been submitted for approval' });
      // Router.replaceRoute(`/campaigns/${this.props.address}`) //refresh page
      setTimeout(() => {
	Router.reload(window.location.pathname);
      }, 2000);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false, name: '' });
  };

  render() {
    if (this.props.isShowing && !this.props.isApproved) {
      return (
	<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} style={{ marginBottom: '10px' }} success={!!this.state.successMessage}>
	  <Form.Group>
	    <Form.Field required>
	      <h2>Get approved</h2>
	      <Input
		value={this.state.name}
		onChange={event => this.setState({ name: event.target.value })}
		label="name"
		labelPosition="right"
		placeholder="Criminy Jicket"
	      />
	    </Form.Field>
	  </Form.Group>
	  <Message error header="Oops!" content={this.state.errorMessage} />
	  <Message success header="Success!" content={this.state.successMessage} />
	  <Button color='olive' loading={this.state.loading}>Get Approved</Button>
	</Form>
      );
    } else if (this.props.isApproved) {
      return (
	<div>
	  <DynamicButton loading={this.state.loading} color='olive' label="HOORAY" isShowing={this.props.isApproved} onClick={this.createMeta} />
	  <InfoMessage isShowing={this.state.isInteracting} header="Please Wait..." content={this.state.infoMessage} />
	</div>
      );
    } else if (this.props.isPending) {
      return null;
    } else { return null; }
  }
}

export default RequestForm;
