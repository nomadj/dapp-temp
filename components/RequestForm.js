import React, { Component } from 'react';
import { Form, Input, Message, Button, Popup, Card } from 'semantic-ui-react';
import web3 from '../web3';
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import DynamicButton from './DynamicButton'
import { create } from 'ipfs-http-client'
import InfoMessage from './InfoMessage'
import SuccessMessage from './SuccessMessage'
import ErrorMessage from './ErrorMessage'
import Router from 'next/router'
import { proString } from '../utils'

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
      throw { message: 'Please enter your primary identifier' };
    } 
  }

  createMeta = async () => {
    this.setState({ loading: true, errorMessage: '', infoMessage: '', success: false, successMessage: '' });
    const { image, aux_uri, animation_url } = this.props.metadata;
    try {
      const metadata = {
	"name": this.props.userName,
	"image": image,
	"description": `Membership token for client ${this.props.userName}`,
	"animation_url": animation_url,
	"aux_uri": aux_uri,
	"attributes": [
	  {
	    "trait_type": "Role",
	    "value": "Minter"
	  },	  
	  {
	    "trait_type": "Role",
	    "value": "Member"
	  }
	]
      };
    const data = JSON.stringify(metadata);
      await this.ipfsAddJSON(data);
    } catch (error) {
      this.setState({ errorMessage: error.message, loading: false });
    }
  }

  // ipfsAddJSON = async (file) => {
  //   const auth = 'Basic ' + Buffer.from(this.props.projectId + ':' + this.props.projectSecret).toString('base64');

  //   const client = create({
  //     host: 'ipfs.infura.io',
  //     port: 5001,
  //     protocol: 'https',
  //     headers: {
  // 	authorization: auth
  //     }
  //   })
  //   try {
  //     // const added = await client.add(file, { progress: prog  => console.log(`Received: ${prog}`)});
  //     const added = await client.add(file);
  //     const accounts = await web3.eth.getAccounts();
  //     const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
  //     this.setState({ isInteracting: true, infoMessage: 'Interacting with the Ethereum Blockchain' });
  //     const tx = await contract.methods.finalizeClient(`ipfs://${added.path}`).send({ from: accounts[0], value: this.props.price });
  //     this.setState({ loading: false, successMessage: `Transaction completed at ${tx.transactionHash}`, isInteracting: false, infoMessage: '', txHash: tx.transactionHash });
  //     setTimeout(() => {
  // 	Router.reload(window.location.pathname)
  //     }, 1000);
  //   } catch (error) {
  //     this.setState({ errorMessage: error.message, loading: false, infoMessage: '', isInteracting: false });
  //   }
  // }

  ipfsAddJSON = async (json) => {
    try {
      const blob = new Blob([json], { type: "application/json" });
      const file = new File([blob], "token.json");
      const data = new FormData();
      data.append("file", file);

      const request = await fetch(
	"https://api.pinata.cloud/pinning/pinFileToIPFS",
	{
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.props.pinataJWT}`,
        },
          body: data,
	}
      );
      const response = await request.json();
      // const added = await client.add(file, { progress: prog  => console.log(`Received: ${prog}`)});
      // const added = await client.add(file);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
      this.setState({ isInteracting: true, infoMessage: 'Interacting with the Polygon Network' });
      const method = await contract.methods.finalizeClient(`ipfs://${response.IpfsHash}`);
      const gas = await method.estimateGas({ from: accounts[0], value: this.props.price });
      const gasPrice = await web3.eth.getGasPrice();
      const tx = await method.send({ from: accounts[0], value: this.props.price, gas: gas, gasPrice: gasPrice });
      // const tx = await contract.methods.finalizeClient(`ipfs://${response.IpfsHash}`).send({ from: accounts[0], value: this.props.price });
      this.setState({ loading: false, successMessage: `Transaction completed at ${tx.transactionHash}`, isInteracting: false, infoMessage: '' });
      setTimeout(() => {
	Router.reload(window.location.pathname)
      }, 1000);
    } catch (error) {
      this.setState({ errorMessage: error.message, loading: false, infoMessage: '', isInteracting: false });
    }
  }    

  mintNFT = async (cid) => {
    this.setState({ isInteracting: true, infoMessage: 'Interacting with Ethereum Blockchain' });
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
      const method = await contract.methods.mint(accounts[0], `ipfs://${cid}`);
      const gas = await method.estimateGas({ from: accounts[0], value: this.props.price });
      const gasPrice = await web3.eth.getGasPrice();
      // const tx = await contract.methods.mint(accounts[0], `ipfs://${cid}`).send({from: accounts[0], value: this.props.price});
      const tx = method.send({ from: accounts[0], value: this.props.price, gas: gas, gasPrice: gasPrice });
      this.setState({ success: true });
      // const pusher = async () => {
      // 	console.log('Minted successfully at: ', tx.transactionHash)
      // 	Router.push({pathname: '/', query: [tx.transactionHash]});
      // }
      // setTimeout(pusher, 3000);
      this.setState({ loading: false, success: true, isInteracting: false, infoMessage: '' });
      return tx.transactionHash;
    } catch (error){
      this.setState({ errorMessage: error.message, loading: false, infoMessage: '' })
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
    this.setState({ loading: true, errorMessage: '', successMessage: '', infoMessage: 'Interacting on Polygon' });

    try {
      this.thrower();
      const accounts = await web3.eth.getAccounts();
      const method = await contract.methods.requestApproval(this.state.name);
      const gas = await method.estimateGas({ from: accounts[0] });
      const gasPrice = await web3.eth.getGasPrice();
      await method.send({ from: accounts[0], gas: gas, gasPrice: gasPrice });
      // await contract.methods.requestApproval(this.state.name).send({ from: accounts[0] });
      this.setState({ successMessage: 'Your request has been submitted for approval', isApproved: false, isPending: true, infoMessage: '' });
      // Router.replaceRoute(`/campaigns/${this.props.address}`) //refresh page
      setTimeout(() => {
	Router.reload(window.location.pathname);
      }, 1000);
    } catch (err) {
      this.setState({ errorMessage: err.message, infoMessage: '' });
    }
    this.setState({ loading: false, name: '' });
  };

  render() {
    if (this.props.isShowing && !this.props.isApproved && !this.props.isPending && !this.props.isOwner) {
      // New User
      return (
	<Card.Content>
	  <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} style={{ marginBottom: '10px' }} success={!!this.state.successMessage}>
	    <Form.Group>
	      <Form.Field required>
		<h2>Get approved</h2>
		<label>Name</label>
		<Input
		  value={this.state.name}
		  onChange={event => this.setState({ name: proString(event.target.value) })}
		  placeholder="JennyDiver"
		/>
	      </Form.Field>
	    </Form.Group>
	    <Message error color='pink' header="Error" content={this.state.errorMessage} />
	    <Message success color='purple' header="Success" content={this.state.successMessage} />
	    <InfoMessage isShowing={!!this.state.infoMessage} header="Please Wait..." content={this.state.infoMessage} />
	    <Button disabled={this.state.loading} loading={this.state.loading} content='Request' style={{ backgroundColor: 'rgb(0,0,100)', color: 'white', marginTop: '10px' }} />
	  </Form>
	</Card.Content>
      );
    } else if (this.props.isApproved) {
      return (
	<Card.Content>
	  <Popup
	    trigger={
	      <div>
		<h2>You are approved!</h2>
		<InfoMessage isShowing={this.state.isInteracting} header="Please Wait..." content={this.state.infoMessage} />
		<SuccessMessage isShowing={!!this.state.successMessage} header="Success" content={this.state.successMessage} />
		<ErrorMessage isShowing={!!this.state.errorMessage} header="Error" content={this.state.errorMessage} />
		<DynamicButton
		  disabled={this.state.loading}
		  loading={this.state.loading}
		  icon="birthday"
		  isShowing={this.props.isApproved}
		  onClick={this.createMeta}
		/>
	      </div>
	    }
	    position='top left'
	    content='Click the cake to finalize and mint your access token.'
	  />
	</Card.Content>
      );
    } else if (this.props.isPending) {
      return <Card.Content><Card.Header>Waiting for approval...</Card.Header></Card.Content>;
    } else { return null; }
  }
}

export default RequestForm;
