import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import web3 from '../web3';
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import DynamicButton from './DynamicButton'

class RequestForm extends Component {
  state = {
    name: '',
    errorMessage: '',
    successMessage: '',
    loading: false,
    success: false
  };

  thrower = () => {
    
    if (this.state.name === '') {
      throw {message: 'Please enter your primary identifier'};
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
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false, name: '' });
  };

  render() {
    console.log("Is Approved: ", this.props.isApproved);
    console.log("Is Token Holder: ", this.props.isTokenHolder);
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
	<DynamicButton color='olive' label="HOORAY" isShowing={this.props.isApproved}/>
      );
    } else { return null; }
  }
}

export default RequestForm;
