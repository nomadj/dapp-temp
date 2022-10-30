import React, { Component } from 'react';
import { Table, Button, Message } from 'semantic-ui-react';
import web3 from '../web3'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import SuccessMessage from './SuccessMessage'
import ErrorMessage from './ErrorMessage'
import Router from 'next/router'

class RequestRow extends Component {
  state = {
    isLoading: false,
    errorMessage: '',
    successMessage: '',
    success: false,
    error: false,
    denyLoading: false
  }
  onApprove = async () => {
    this.setState({ isLoading: true, errorMessage: '', successMessage: '', error: false, success: false });
    try {
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
      const accounts = await web3.eth.getAccounts();
      await contract.methods.approveOrDenyRequest(this.props.id, true).send({
	from: accounts[0]
      });
      this.setState({ isLoading: false, success: true });
    } catch (error) {
      this.setState({ isLoading: false, errorMessage: error.message, error: true });
    }
    setTimeout(() => {
      Router.push({ pathname: `/${this.props.address}`, query: [this.props.address] });
    }, 3000);
  };

  onDeny = async () => {
    this.setState({ denyLoading: true });
    try {
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
      const accounts = await web3.eth.getAccounts();
      await contract.methods.approveOrDenyRequest(this.props.id, false).send({
	from: accounts[0]
      });
      this.setState({ success: true, denyLoading: false });
    } catch (error) {
      this.setState({ error: true, errorMessage: error.message, denyLoading: false });
    }
  }

  render() {
    const { Row, Cell } = Table;
    const { id, request } = this.props;
    return (
      <Row disabled={false} positive={false} negative={false}>
	<Cell>{id}</Cell>
	<Cell>{request[0]}</Cell>
	<Cell>
	  <SuccessMessage isShowing={this.state.success} header='Success!' content={`You have approved ${this.props.name}`} />
	</Cell>
	<Cell>
	  <ErrorMessage isShowing={this.state.error} header='Oops!' content={this.state.errorMessage} />
	</Cell>
	<Cell textAlign='right'>
	  {request.isApproved ? null : (
	    <Button loading={this.state.isLoading} color="green" basic onClick={this.onApprove}>Approve</Button>
	  )}
	</Cell>
	<Cell textAlign='right' width={1}>
	  {request.isApproved ? null : (
	    <Button loading={this.state.denyLoading} color="red" basic onClick={this.onDeny}>Deny</Button>
	  )}
	</Cell>
      </Row>
    );
  }
}

export default RequestRow;
