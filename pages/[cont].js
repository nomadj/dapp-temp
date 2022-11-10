import React, { Component } from 'react';
import { Card, Grid, Button, Container, Segment, Icon, Image } from 'semantic-ui-react';
import Layout from '../components/Layout';
import web3 from '../web3';
import ContributeForm from '../components/ContributeForm';
import Link from 'next/link';
import Header from '../components/Header';
import DownloadButton from '../components/DownloadButton';
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'
import TamboraFactory from '../artifacts/contracts/TamboraFactory.sol/TamboraFactory.json'
import ContractShow from '../components/ContractShow'
import RequestForm from '../components/RequestForm'
import DynamicButton from '../components/DynamicButton'

export async function getServerSideProps(props) {
  const factory = await new web3.eth.Contract(TamboraFactory.abi, process.env.FACTORY_ADDRESS)
  const address = await factory.methods.getContractAddress(props.query['cont']).call();
  const name = props.query['cont'];
//  const address = props.query['0'];
  const contract = new web3.eth.Contract(Tambora.abi, address);
  const showData = await contract.methods.getShowData().call();
  const fileStore = showData.fileStore;
  const tokenId = showData.tokenId;
  const manager = showData.manager;
  const contractType = showData.contractType;
  const baseURL = 'https://fastload.infura-ipfs.io/ipfs/'
  const tokenURI = showData.tokenURI;
  const req = await fetch(tokenURI.replace('ipfs://', baseURL));
  const metadata = await req.json();
  const image = metadata.image.replace('ipfs://', baseURL);
  const tokenHolders = showData.approvedCount;
  const tokenHoldersCount = tokenHolders.length;
  const methods = contract.methods;

  return {
    props: {
      address,
      manager,
      name,
      image,
      tokenId,
      tokenHoldersCount,
      metadata,
      fileStore
    }
  };
}

class CampaignShow extends Component {

  state = {
    account: '',
    isTokenHolder: false,
    isOwner: false,
    address: '',
    requestsCount: '',
    isApproved: false,
    isPending: false,
    isHolder: false,
    userName: '',
    loading: false,
    errorMessage: '',
    success: false,
    isInteracting: false,
    infoMessage: '',
    txHash: '',
    clientData: {}
  }

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
    const clientData = await contract.methods.getClientData().call({ from: accounts[0] });
    this.setState({ clientData: clientData });
    
    const tokenBalance = await contract.methods.balanceOf(accounts[0]).call();
    if (tokenBalance > 0) {
      this.setState({ isTokenHolder: true, address: this.props.address });
    }
    try {
    const requests = await contract.methods.getPendingClients().call({from: accounts[0]});
      this.setState({ requestsCount: requests.length });
    } catch {
      this.setState({ requestsCount: 0 });
    }
    const status = clientData.status;
    const isOwner = accounts[0] === this.props.manager;
    this.setState({ isOwner: isOwner, isApproved: status === 'approved', isOwner: status === 'owner', isDenied: status === 'denied', isGuest: status === 'guest', isPending: status === 'pending', isHolder: status === 'holder', userName: clientData.name });
    console.log("Client Status: ", status);
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
	      <ContractShow
		name={this.props.name}
		address={this.props.address}
		image={this.props.image}
		tokenId={this.props.tokenId}
		tokenHolders={this.props.tokenHoldersCount}
		isTokenHolder={this.state.isTokenHolder}
		account={this.state.account}
		requestsCount={this.state.requestsCount}
		isOwner={this.state.isOwner}
		isApproved={this.state.isApproved}
		userName={this.state.userName}
		metadata={this.props.metadata}
		isPending={this.state.isPending}
		fileStore={this.props.fileStore}
		clientData={this.state.clientData}
	      />
            </Grid.Column>
	    <Grid.Column>
	      <Image src='eth.png' style={{ marginLeft: 100 }} /> 
	    </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;

// Image is 220x310
