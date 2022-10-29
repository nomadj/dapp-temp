import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import web3 from '../../web3';
import Tambora from '../../artifacts/contracts/Tambora.sol/Tambora.json'
import { Button, Table } from 'semantic-ui-react';
import RequestRow from '../../components/RequestRow';
import Link from 'next/link';

export async function getServerSideProps(props) {
  const address = props.query['0'];
  const contract = new web3.eth.Contract(Tambora.abi, address);

  // const requests = await Promise.all(
  //   Array(parseInt(requestCount)).fill().map((element, index) => {
  //     return campaign.methods.getApprovalRequests().call();
  //   })
  // );
  const requests = await contract.methods.getApprovalRequests().call({from: props.query['1']});
  const approvedRequests = await contract.methods.getApprovedRequests().call();
  console.log(approvedRequests[0]['name']);
  

  return {
    props:{
      address, requests
    }
  };
}

class Requests extends Component {
  state = {
    success: false,
    error: false
  }
  
  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
	  name={request[0]}
        />
      );
    });
  }
  render() {
    const { Row, HeaderCell, Body } = Table;
    return (
      <Layout>
	<Header />
        <h3>Requests</h3>
        <Table>
          <Table.Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Name</HeaderCell>
	      <HeaderCell textAlign='right'></HeaderCell>
              <HeaderCell textAlign='right'></HeaderCell>
	      <HeaderCell />
	      <HeaderCell />
            </Row>
          </Table.Header>
          <Body>
	    {this.renderRows()}
	  </Body>
        </Table>
        <div>Found {this.props.requests.length} requests</div>
      </Layout>
    );
  }
}

export default Requests;
