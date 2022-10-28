import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../web3';
import ContributeForm from '../../components/ContributeForm';
import Link from 'next/link';
import Header from '../../components/Header';
import DownloadButton from '../../components/DownloadButton';
import Tambora from '../../artifacts/contracts/Tambora.sol/Tambora.json'
import ContractShow from '../../components/ContractShow'
import RequestForm from '../../components/RequestForm'

export async function getServerSideProps(props) {
  const name = props.query['cont'];
  const address = props.query['0'];
  const contract = new web3.eth.Contract(Tambora.abi, address);
  const tokenId = await contract.methods.tokenId().call();
  const manager = await contract.methods.owner().call();
  const contractType = await contract.methods.contractType().call();
  const baseURL = 'https://fastload.infura-ipfs.io/ipfs/'
  const tokenURI = await contract.methods.tokenURI(0).call();
  const req = await fetch(tokenURI.replace('ipfs://', baseURL));
  const metadata = await req.json();
  const image = metadata.image.replace('ipfs://', baseURL);
  const tokenHolders = await contract.methods.getApprovedRequests().call();
  const tokenHoldersCount = tokenHolders.length;

  return {
    props: {
      address,
      manager,
      name,
      image,
      tokenId,
      tokenHoldersCount
    }
  };
}

class CampaignShow extends Component {

  state = {
    account: '',
    isTokenHolder: false,
    isOwner: false,
    address: '',
    requestsCount: ''
  }

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
    const tokenBalance = await contract.methods.balanceOf(accounts[0]).call();
    if (tokenBalance > 0) {
      this.setState({ isTokenHolder: true, address: this.props.address });
    }
    try {
    const requests = await contract.methods.getApprovalRequests().call({from: accounts[0]});
      this.setState({ requestsCount: requests.length });
    } catch {
      this.setState({ requestsCount: 0 });
    }
    
    const isOwner = accounts[0] === this.props.manager;
    this.setState({isOwner: isOwner});
  }

  renderCards() {
    const { address, manager, name } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Contract Creator',
        description: 'Requests to mint tokens and download materials must be approved by the controller of this account',
        style: { overflowWrap: 'break-word' },
	color: 'olive'
      },
      {
        header: name,
        meta: 'Name of Contract',
        description: 'Contract names are not always unique, be sure contract address is correct',
	color: 'olive'
      }
    ];

    return <Card.Group items={items} />;
  }

//  {this.renderCards()}

  render() {
    return (
      <Layout>
	<Header />
        <h1>Contract Details</h1>
        <Grid style={{marginTop: '10px'}} columns='equal'>
          <Grid.Row>
            <Grid.Column>
	      <ContractShow name={this.props.name} address={this.props.address} image={this.props.image} tokenId={this.props.tokenId} tokenHolders={this.props.tokenHoldersCount + 1} isTokenHolder={this.state.isTokenHolder} account={this.state.account} requestsCount={this.state.requestsCount} isOwner={this.state.isOwner}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
