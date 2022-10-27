import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import web3 from '../web3';
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'

class RequestForm extends Component {
  state = {
    name: '',
    errorMessage: '',
    successMessage: '',
    loading: false,
    success: false
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
    this.setState({ loading: true, errorMessage: '', successMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.requestApproval(this.state.name).send({ from: accounts[0] });
      this.setState({ successMessage: 'Your request has been submitted for approval' });
      // Router.replaceRoute(`/campaigns/${this.props.address}`) //refresh page
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false, name: '' });
  };

  render() {
    if (this.props.isShowing) {
      return (
	<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} style={{ marginBottom: '10px' }} success={!!this.state.successMessage}>
	  <Form.Field>
	    <label>Get approved to mint from this contract</label>
	    <Input
	      value={this.state.name}
	      onChange={event => this.setState({ name: event.target.value })}
	      label="name"
	      labelPosition="right"
	      placeholder="Jiminy Cricket"
	    />
	  </Form.Field>
	  <Message error header="Oops!" content={this.state.errorMessage} />
	  <Message success header="Success!" content={this.state.successMessage} />
	  <Button color='yellow' loading={this.state.loading}>Get Approved</Button>
	</Form>
      );
    } else { return null; }
  }
}

export default RequestForm;
