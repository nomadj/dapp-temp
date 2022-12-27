import React, { Component } from 'react';
import { Form, Input, Message, Button, Popup } from 'semantic-ui-react';
import web3 from '../web3';
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import Router from 'next/router'
import InfoMessage from '../components/InfoMessage'

export default class TransferForm extends Component {
  state = {
    to: '',
    errorMessage: '',
    successMessage: '',
    infoMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '', infoMessage: 'Interacting with the EVM', successMessage: '' });
    const contract = await new web3.eth.Contract(Tambora.abi, this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      const tx = await contract.methods.safeTransferFrom(accounts[0], this.state.to, this.props.tokenId).send({ from: accounts[0] });
      this.setState({ successMessage: `You have transferred token ${this.props.tokenId} to ${this.state.to} at transaction ${tx.transactionHash}`, infoMessage: '' });
      // setTimeout(() => Router.reload(window.location.pathname), 1000);
    } catch (err) {
      this.setState({ errorMessage: err.message, successMessage: '', infoMessage: '' });
    }
    this.setState({ loading: false, value: '' });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} success={!!this.state.successMessage} style={{ marginBottom: '10px', marginTop: '10px'}}>
        <Message error color='purple' header="Error" content={this.state.errorMessage} />
	<Message success color='teal' header="Success" content={this.state.successMessage} style={{ overflowWrap: 'break-word' }} />
	<InfoMessage isShowing={!!this.state.infoMessage} header="Please Wait..." content={this.state.infoMessage} />	
	<Popup
	  trigger={
	    <Form.Field>
              <h2>Transfer</h2>
              <Input
		value={this.state.to}
		onChange={event => this.setState({ to: event.target.value })}
		placeholder="0x00000000000000000008"
		label={<Button disabled={this.state.loading} color='orange' loading={this.state.loading} icon='ethereum' />}
              />
            </Form.Field>}
	  content="Enter the recipient's public address. If you wish to preserve the remaining mintings on a member token, transfer to an Ethereum address which does not hold any tokens on this contract."
	  position='bottom left'
        />	  	
      </Form>
    );
  }
}
