import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../web3'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'

class RequestRow extends Component {
  state = {
    isLoading: false,
    errorMessage: ''
  }
  onApprove = async () => {
    this.setState({ isLoading: true });
    try {
      const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
      const accounts = await web3.eth.getAccounts();
      await contract.methods.approveOrDenyRequest(this.props.id, true).send({
	from: accounts[0]
      });
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false, errorMessage: error.message });
    }
  };

  onFinalize = async () => {
    // const campaign = Campaign(this.props.address);

    // const accounts = await web3.eth.getAccounts();
    // await campaign.methods.finalizeRequest(this.props.id).send({
    //   from: accounts[0]
    // });
    console.log("Finalize Clicked");
  }

  render() {
    const { Row, Cell } = Table;
    const { id, request } = this.props;
    return (
      <Row disabled={false} positive={true} negative={false}>
        <Cell>{id}</Cell>
        <Cell>{request[0]}</Cell>
        <Cell textAlign='right'>
          {request.isApproved ? null : (
            <Button loading={this.state.isLoading}color="green" basic onClick={this.onApprove}>Approve</Button>
          )}
        </Cell>
        <Cell textAlign='right' width={1}>
          {request.isApproved ? null : (
            <Button color="red" basic onClick={this.onFinalize}>Deny</Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
