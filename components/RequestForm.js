import React, { Component } from 'react';
import { Form, Input, Message, Button, Popup } from 'semantic-ui-react';
import web3 from '../web3';
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import DynamicButton from './DynamicButton'
import { create } from 'ipfs-http-client'
import InfoMessage from './InfoMessage'
import SuccessMessage from './SuccessMessage'
import ErrorMessage from './ErrorMessage'
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
	"description": `Membership token for client ${this.props.userName}`,
	"attributes": [
	  {
	    "trait_type": "role",
	    "value": "client"
	  },
	  {
	    "trait_type": "token type",
	    "value": "contract membership"
	  },
	  {
	    "trait_type": "aux uri",
	    "value": ""
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
      this.setState({ loading: false, successMessage: `Transaction completed at ${tx.transactionHash}`, isInteracting: false, infoMessage: '', txHash: tx.transactionHash });
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
    this.setState({ loading: true, errorMessage: '', successMessage: '', infoMessage: 'Interacting with the EVM' });

    try {
      this.thrower();
      const accounts = await web3.eth.getAccounts();
      await contract.methods.requestApproval(this.state.name).send({ from: accounts[0] });
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
    if (this.props.isShowing && !this.props.isApproved && !this.props.isPending) {
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
	  <InfoMessage isShowing={!!this.state.infoMessage} header="Please Wait..." content={this.state.infoMessage} />
	  <Button disabled={this.state.loading} color='olive' loading={this.state.loading}>Get Approved</Button>
	</Form>
      );
    } else if (this.props.isApproved) {
      return (
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
		color='violet'
		icon="birthday"
		isShowing={this.props.isApproved}
		onClick={this.createMeta}
	      />
	    </div>
	  }
	  position='top left'
	  content='Congratulations! Click to finalize and mint your access token.'
	/>
      );
    } else if (this.props.isPending) {
      return <h2>Waiting for approval...</h2>;
    } else { return null; }
  }
}

export default RequestForm;