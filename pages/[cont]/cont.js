import Head from 'next/head';
import web3 from '../../web3';
import Member from '../../components/members';
import Layout from '../../components/Layout';
import React, { useState, useEffect } from 'react';
import { Card, Embed, Button, Menu, Grid, Popup, Divider, Image } from 'semantic-ui-react';
import Link from 'next/link';
import NFT from '../../components/NFT';
import Header from '../../components/Header'
import Router from  'next/router'
import Tambora from '../../artifacts/contracts/Tambora.sol/Tambora.json'
import DynamicButton from '../../components/DynamicButton'

export async function getServerSideProps(props) {
  const name = props.query['cont']; 
  const address = props.query['0'];
  const account = props.query['1'];
  const minted = props.query['2'];
  const mintAllowance = props.query['3'];
  const mintId = props.query['4'];
  const mintDisabled = Number(minted) >= Number(mintAllowance);
  const contract = new web3.eth.Contract(Tambora.abi, address);
  const tokenBalance = await contract.methods.balanceOf(account).call();
  var tokenIds = [];
  for (let i = 0; i < tokenBalance; i++) {
    const token = await contract.methods.tokenOfOwnerByIndex(account, i).call();
    tokenIds.push(token);
  }
  const isTokenHolder = tokenIds.length > 0;
  const tokenURIs = await Promise.all(
    tokenIds.map(id => {
      return contract.methods.tokenURI(id).call();
    })
  );
  const results = await Promise.all(
    tokenURIs.map(uri => {
      return fetch(uri.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/'));
    })
  );
  const dataArray = await Promise.all(
    results.map(res => {
      return res.json();
    })
  );
  console.log('Data Array: ', typeof dataArray);
  const images = dataArray.map(data => {
    return data.image.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/');
  });
  const tokenNames = dataArray.map(data => {
    return data.name;
  });
  var types = [];
  for (let i = 0; i < images.length; i++) {
    const req = await fetch(images[i], {method: 'HEAD'});
    const type = req.headers.get('content-type');
    types.push(type.slice(type.indexOf('/')).replace('/', ''));
  }
  
  return {
    props: {
      name,
      address,
      account,
      images,
      isTokenHolder,
      types,
      tokenNames,
      dataArray,
      mintDisabled,
      tokenIds,
      minted,
      mintAllowance,
      mintId,
      tokenIds
    },
  };
}

class MyContract extends React.Component {
  state = { address: ''};
  
  async componentDidMount() {
    let accounts = await web3.eth.getAccounts();
    this.setState({ address: accounts[0] });
  }
  
  render() {
    const items = this.props.images.map((image, index) => {
      return <NFT key={index} url={image} name={this.props.tokenNames[index]} address={this.props.address} type={this.props.types[index]} meta={this.props.dataArray[index]} tokenId={this.props.tokenIds[index]} />
    });
    if (this.props.mintDisabled) {
      return (
	<Layout>
	  <h2>You have reached your mint allowance.
	    <Link href='/'>
	      <a color='olive' style={{ marginBottom: '10px' }} size='small'> Request More</a>
	    </Link>
	  </h2>
	  <Divider />
	  <Card.Group itemsPerRow={4}>
	    {items}
	  </Card.Group>
	</Layout>
      );
    } else {
      return (
	<Layout>
	  <Card.Group itemsPerRow={4}>
	    <Card>
	      <Card.Content>
		<Card.Header>Minted</Card.Header>
		<a>{this.props.minted}</a>
	      </Card.Content>
	    </Card>
	    <Card>
	      <Card.Content>
		<Card.Header>Allowance</Card.Header>
		<a>{this.props.mintAllowance}</a>
	      </Card.Content>		  
	    </Card>
	    <Link href={{pathname: '/minty', query: [this.props.address, this.props.mintId]}}>
	      <DynamicButton
		color='olive'
		isShowing={this.props.isTokenHolder && !this.props.mintDisabled}
		content='Mint'
		marginBottom='12px'
		marginLeft='13px'
		marginTop='12px'
		size='tiny'
	      />
	    </Link>		
	  </Card.Group>
	  <Divider />
	  <Card.Group itemsPerRow={4} style={{ overflowWrap: 'anywhere' }}>
	    {items}
	  </Card.Group>
	</Layout>
      );
    }
  }
}
export default MyContract;
