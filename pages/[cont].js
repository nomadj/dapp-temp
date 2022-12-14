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

export async function getServerSideProps(props) {
  
  const factory = await new web3.eth.Contract(TamboraFactory.abi, process.env.FACTORY_ADDRESS)
  const address = await factory.methods.getContractAddress(props.query['cont']).call();
  const name = props.query['cont'];
  const title = name.replace(name.charAt(0), name.charAt(0).toUpperCase());
  const contract = new web3.eth.Contract(Tambora.abi, address);
  const owner = await contract.methods.owner().call();
  const showData = await contract.methods.getShowData().call();
  const fileStore = showData.fileStore;
  const tokenId = showData.tokenId;
  const manager = showData.manager;
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
  const tokenData = await contract.methods.getTokenData(0).call();
  const date = new Date(tokenData.timeStamp * 1000);
  const price = await contract.methods.price().call();

  return {
    props: {
      address,
      manager,
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
    unsupported: false
  }

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const factory = await new web3.eth.Contract(TamboraFactory.abi, process.env.FACTORY_ADDRESS)
    this.setState({ account: accounts[0] });
    const contract = new web3.eth.Contract(Tambora.abi, this.props.address);
    try {
      // Testing //
      //////
      // await contract.methods.approveMintIncrease(0).send({ from: accounts[0] });
      // await contract.methods.increaseContractMintAllowance().send({ from: accounts[0], value: web3.utils.toWei('0.05') });
      // await contract.methods.requestMintIncrease(1, "Bob").send({ from: accounts[0] });
      // await contract.methods.finalizeMintIncrease(1).send({ from: accounts[0] });
      // const mintRequests = await contract.methods.getMintRequests().call({ from: accounts[0] });
      // try {
      // 	for (let i = 0; i < mintRequests.length; i++) {
      // 	  console.log("Mint Request Name: ", mintRequests[i].name);
      // 	}
      // } catch {
      // 	console.log("No Requests");
      // }
      // const contractAllowance = await contract.methods.mintAllowance().call();
      // console.log("Contract Allowance: ", contractAllowance);      
      //////
      const balanceOf = await contract.methods.balanceOf(accounts[0]).call();
      const isPending = await contract.methods.isPending(accounts[0]).call();
      const isApproved = await contract.methods.isApproved(accounts[0]).call();
      const name = await contract.methods.approvedName(accounts[0]).call();
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
      this.setState({ renderPage: true });
    } catch (error) {
      this.setState({ unsupported: true, renderPage: true });
    }
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
    if (this.state.renderPage === false) {
      return null;
    } else if (typeof window === 'undefined' || typeof window.web3 === 'undefined' || this.state.unsupported) {
      return (
	<Layout>
	  <h1>Welcome to the future. Start
	    <Link href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'>
	      <a> here.</a>
	    </Link>
	  </h1>
	</Layout>
      );
    } else {
      return (
	<Layout>
	  <h1>{this.props.title}</h1>
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
