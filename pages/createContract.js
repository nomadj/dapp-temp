import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import web3 from '../web3';
import factory from '../factory';
import Router from 'next/router';
import { factoryAbi } from '../abi';
import Header from '../components/Header';

class CreateContract extends Component {
  state = {
    name: '',
    symbol: '',
    price: '',
    errorMessage: '',
    loading: false,
    success: false,
    image: ''
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '', success: false });
    try {
      const accounts = await web3.eth.getAccounts();
      const tx = await factory.methods.deployTambora(this.state.name, this.state.symbol, web3.utils.toWei(this.state.price, 'ether')).send({from: accounts[0]});
      this.setState({ success: true });
      async function pusher() {
	const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
	const eventLog = tx.events['Deployed'].returnValues.contractAddr;
	console.log(eventLog);
	Router.push({pathname: '/', query: [eventLog]});
      }
      setTimeout(pusher, 3000);
    } catch (err) {
      this.setState({ errorMessage: err.message });
      }
      this.setState({ loading: false })
  };

  render() {
    return (
      <Layout>
	<Header />
        <h3>Create a Contract</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} success={this.state.success}>
          <Form.Field>
            <label>Name</label>
            <Input
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
	      placeholder='MyAwesomeContract'
            />
          </Form.Field>
          <Form.Field>
            <label>Symbol</label>
            <Input
              value={this.state.symbol}
              onChange={event => this.setState({ symbol: event.target.value })}
	      placeholder='MACT'
            />
          </Form.Field>
          <Form.Field>
            <label>Price</label>
            <Input
	      label='Ether'
	      labelPosition='right'
              value={this.state.price}
              onChange={event => this.setState({ price: event.target.value })}
	      placeholder="0.08"
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
	  <Message
	    success
	    header='Success!'
	    content='Contract Created'
	  />	  
          <Button type='submit' loading={this.state.loading} color='yellow'>Create</Button>
        </Form>
      </Layout>
    );
  };
};

export default CreateContract;
