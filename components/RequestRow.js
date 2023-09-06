import React, { Component } from 'react';
import { Table, Button, Message } from 'semantic-ui-react';
import web3 from '../web3'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import SuccessMessage from './SuccessMessage'
import ErrorMessage from './ErrorMessage'
import InfoMessage from './InfoMessage'
import Router from 'next/router'

class RequestRow extends Component {
  state = {
    isLoading: false,
    errorMessage: '',
    successMessage: '',
    infoMessage: '',
    success: false,
    error: false,
    denyLoading: false
  }
  onApprove = async () => {
    this.setState({ isLoading: true, errorMessage: '', successMessage: '', error: false, success: false, infoMessage: 'Interacting with Ethereum' });
    try {
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
      const accounts = await web3.eth.getAccounts();
      await contract.methods.approveOrDenyClient(this.props.id, true).send({
	from: accounts[0]
      });
      this.setState({ isLoading: false, success: true, successMessage: `You have approved ${this.props.name}`, infoMessage: '' });
      setTimeout(() => {
	Router.reload(window.location.pathname);
      }, 1000);
    } catch (error) {
      this.setState({ isLoading: false, errorMessage: error.message, error: true, infoMessage: '' });
    }
  };

  onDeny = async () => {
    this.setState({ denyLoading: true, infoMessage: 'Interacting with the EVM' });
    try {
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
      const accounts = await web3.eth.getAccounts();
      await contract.methods.approveOrDenyClient(this.props.id, false).send({
	from: accounts[0]
      });
      this.setState({ success: true, denyLoading: false, successMessage: `You have denied ${this.props.name}`, infoMessage: '' });
      setTimeout(() => {
	Router.reload(window.location.pathname);
    }, 1000);
    } catch (error) {
      this.setState({ error: true, errorMessage: error.message, denyLoading: false, infoMessage: '' });
    }
  }

  render() {
    const { Row, Cell } = Table;
    const { id, request } = this.props;
    return (
      <Row disabled={false} positive={false} negative={false}>
	<Cell>{request[0]}</Cell>
	<Cell>{request[1]}</Cell>
	<Cell>
	  <SuccessMessage isShowing={this.state.success} header='Success' content={this.state.successMessage} />
	  <ErrorMessage isShowing={this.state.error} header='Error' content={this.state.errorMessage} />
	  <InfoMessage isShowing={!!this.state.infoMessage} header='Please Wait...' content={this.state.infoMessage} />
	</Cell>
	<Cell textAlign='right'>
	  {request.isApproved ? null : (
	    <Button disabled={this.state.isLoading || this.state.denyLoading} loading={this.state.isLoading} style={{ backgroundColor: 'rgb(0,100,0)', color: 'white' }} onClick={this.onApprove}>Approve</Button>
	  )}
	</Cell>
	<Cell textAlign='right' width={1}>
	  {request.isnApproved ? null : (
	    <Button disabled={this.state.isLoading || this.state.denyLoading} loading={this.state.denyLoading} style={{ backgroundColor: 'rgb(0,0,100', color: 'white' }} onClick={this.onDeny}>Deny</Button>
	  )}
	</Cell>
      </Row>
    );
  }
}

export default RequestRow;
