import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import web3 from '../web3';
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import Router from 'next/router'
import InfoMessage from '../components/InfoMessage'
import { floatsOnly } from '../utils'

class ContributeForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    successMessage: '',
    infoMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '', infoMessage: 'Interacting with the EVM', successMessage: '' });
    const contract = new web3.eth.Contract(Tambora.abi, this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      const owner = await contract.methods.owner().call();
      const preTx = {
        from: accounts[0],
	to: owner,
        value: web3.utils.toWei(this.state.value, 'ether')
      };
      const gas = await web3.eth.estimateGas(preTx);
      const gasPrice = await web3.eth.getGasPrice();
      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
	to: owner,
        value: web3.utils.toWei(this.state.value, 'ether'),
	gas: gas,
	gasPrice: gasPrice
      });      
      this.setState({ successMessage: `Your donation of ${this.state.value} MATIC has been made at transaction hash ${tx.transactionHash}`, infoMessage: '' });
      // setTimeout(() => Router.reload(window.location.pathname), 1000);
    } catch (err) {
      this.setState({ errorMessage: err.message, successMessage: '', infoMessage: '' });
    }
    this.setState({ loading: false, value: '' });
  };

  render() {
    return (
      <div style={{ maxHeight: 150, overflowY: 'auto' }}>
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} success={!!this.state.successMessage} style={{ marginBottom: '10px', marginTop: '10px', marginRight: '40px' }}>
        <Form.Field>
          <h2>Donate</h2>
          <Input
            value={this.state.value}
            onChange={event => this.setState({ value: floatsOnly(event.target.value) })}
	    placeholder="0.08 MATIC"
	    action={{
	      style: { backgroundColor: 'rgb(0,0,100)', color: '#fff' }, 
	      icon: 'ethereum'
	    }}
	    actionPosition='left'
          />
        </Form.Field>
        <Message error color='pink' header="Error" content={this.state.errorMessage} />
	<Message success color='purple' header="Thank You!" content={this.state.successMessage} style={{ overflowWrap: 'break-word' }} />
	<InfoMessage isShowing={!!this.state.infoMessage} header="Please Wait..." content={this.state.infoMessage} />
      </Form>
	</div>
    );
  }
}

export default ContributeForm;
