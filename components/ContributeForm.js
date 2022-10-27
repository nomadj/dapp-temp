import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import web3 from '../web3';
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'

class ContributeForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      const owner = await contract.methods.owner().call();
      await web3.eth.sendTransaction({
        from: accounts[0],
	to: owner,
        value: web3.utils.toWei(this.state.value, 'ether')
      });
      // Router.replaceRoute(`/campaigns/${this.props.address}`) //refresh page
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false, value: '' });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} style={{ marginBottom: '10px' }}>
        <Form.Field>
          <label>Donate to this contract</label>
          <Input
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
	    placeholder="0.08"
	    label= "ether"
	    labelPosition="right"
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button color='yellow' loading={this.state.loading}>Donate</Button>
      </Form>
    );
  }
}

export default ContributeForm;
