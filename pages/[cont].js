import React, { Component } from 'react';
import { Card, Grid, Button, Container, Segment, Icon, Image, Divider } from 'semantic-ui-react';
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
import NoMetamask from '../components/NoMetamask'

export async function getServerSideProps(props) {
  try {
    var factory = await new web3.eth.Contract(TamboraFactory.abi, process.env.FACTORY_ADDRESS)
  } catch (error) {
    const unsupported = true;
    return;
  }
  const address = await factory.methods.getContractAddress(props.query['cont']).call();
  // const address = props.query['0'];
  const name = props.query['cont'];
  const title = name.replace(name.charAt(0), name.charAt(0).toUpperCase());
  const contract = new web3.eth.Contract(Tambora.abi, address);
  const showData = await contract.methods.getShowData().call();
  const fileStore = showData.fileStore;
  const tokenId = showData.tokenId;
  const owner = showData.manager;
  const contractType = showData.contractType;
  const baseURL = 'https://fastload.infura-ipfs.io/ipfs/'
  const tokenURI = showData.tokenURI;
  try {
    const req = await fetch(tokenURI.replace('ipfs://', baseURL));
    var metadata = await req.json();
  } catch (error) {
    console.log(error.message);
    const req = await fetch(tokenURI.replace('ipfs://', baseURL));
    var metadata = await req.json();
  }
  const image = metadata.image.replace('ipfs://', baseURL);
  const projectId = process.env.PROJECT_ID;
  const projectSecret = process.env.PROJECT_SECRET;
  // ****ON NEW DEPLOY**** //
  const tokenData = showData.tokenData;
  // const tokenData = await contract.methods.getTokenData(0).call(); // Deprecated
  const date = new Date(tokenData.timeStamp * 1000);
  // ****ON NEW DEPLOY**** //
  const price = showData.price;
  // const price = await contract.methods.price().call(); // Deprecated

  return {
    props: {
      address,
      name,
      image,
      tokenId,
      metadata,
      fileStore,
      owner,
      title,
      projectId,
      projectSecret,
      price
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
    isGuest: false,
    userName: '',
    loading: false,
    errorMessage: '',
    success: false,
    isInteracting: false,
    infoMessage: '',
    txHash: '',
    mintData: {},
    renderPage: false,
    unsupported: false,
    mobile: false
  }

  async componentDidMount() {
    if (typeof window.ethereum === 'undefined') {
      console.log("No metamask installed")
      this.setState({ unsupported: true, renderPage: true })
      return;
    }
    if (window.innerWidth < 800) {
      this.setState({ mobile: true });
    }
    const accounts = await web3.eth.getAccounts();
    const factory = await new web3.eth.Contract(TamboraFactory.abi, process.env.FACTORY_ADDRESS)
    this.setState({ account: accounts[0] });
    const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
    try {

      // ****ON NEXT DEPLOY**** //
      const userData = await contract.methods.getUserData(accounts[0]).call();
      const balanceOf = userData.balance;
      const isPending = userData.pending;
      const isApproved = userData.approved;
      const name = userData.name;
      // const balanceOf = await contract.methods.balanceOf(accounts[0]).call(); // deprecated
      // const isPending = await contract.methods.isPending(accounts[0]).call(); // deprecated
      // const isApproved = await contract.methods.isApproved(accounts[0]).call(); // deprecated
      // const name = await contract.methods.approvedName(accounts[0]).call(); // deprecated
      var tokenIds = [];
      for (let i = 0; i < balanceOf; i++) {
	const token = await contract.methods.tokenOfOwnerByIndex(accounts[0], i).call();
	tokenIds.push(token);
      }
      if (this.props.owner === accounts[0] && balanceOf === '0') {
	tokenIds.push(0);
      }
      let mintData = [];
      for (let id of tokenIds) {
	const data = await contract.methods.memberTokens(id).call();
	mintData.push(data);
      }
      this.setState({ mintData: mintData });

      if (balanceOf > 0 && this.props.owner !== accounts[0]) {
	this.setState({ isHolder: true });
      } else if (this.props.owner === accounts[0]) {
	this.setState({ isOwner: true });
      } else if (isPending) {
	this.setState({ isPending: true });
      } else if (isApproved) {
	this.setState({ isApproved: true, userName: name });
      } else {
	this.setState({ isGuest: true });
      }

      if (balanceOf > 0) {
	this.setState({ isTokenHolder: true, address: this.props.address });
      }
      try {
      const requests = await contract.methods.getPendingClients().call({from: accounts[0]});
	this.setState({ requestsCount: requests.length });
      } catch {
	this.setState({ requestsCount: 0 });
      }
      this.setState({ renderPage: true });
    } catch (error) {
      this.setState({ unsupported: true, renderPage: true });
    }
  }

  // renderCards() {
  //   if (this.state.unsupported) {
  //     return;
  //   }    
  //   const { address, owner, name } = this.props;

  //   const items = [
  //     {
  //       header: owner,
  //       meta: 'Contract Creator',
  //       description: 'Requests to mint tokens and download materials must be approved by the controller of this account',
  //       style: { overflowWrap: 'break-word' },
  // 	color: 'olive'
  //     },
  //     {
  //       header: name,
  //       meta: 'Name of Contract',
  //       description: 'Contract names are not always unique, be sure contract address is correct',
  // 	color: 'olive'
  //     }
  //   ];

  //   return <Card.Group items={items} />;
  // }

  //  {this.renderCards()}

  render() {
    if (this.state.renderPage === false) {
      // Render nothing until data loads
      return null;
    } else if (typeof window.ethereum === 'undefined') {
      // User is not web3 enabled
      return (
	<Layout>
	  <NoMetamask />
	</Layout>	
      );
    } else {
      // User is web3 enabled and on a desktop computer
      return (
	<Layout>
	  <div>
	    <h1 style={{ marginBottom: 0 }}>{this.props.title}</h1>
	    <p style={{ color: '#DB6E00', overflowY: 'auto', marginTop: 0 }}>{this.props.address}</p>
	  </div>
	  <Divider />
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
	      mintData={this.state.mintData}
	      projectId={this.props.projectId}
	      projectSecret={this.props.projectSecret}
	      price={this.props.price}
	    />
	</Layout>
      );
    }
  }
}

export default CampaignShow;

// Image is 220x310
