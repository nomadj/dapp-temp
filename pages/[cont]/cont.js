import Head from 'next/head';
import web3 from '../../web3';
import Member from '../../components/members';
import Layout from '../../components/Layout';
import React, { useState, useEffect } from 'react';
import { Card, Embed, Button } from 'semantic-ui-react';
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
  const mintDisabled = minted >= mintAllowance;
  const contract = new web3.eth.Contract(Tambora.abi, address);
  // const tokenIds = await contract.methods.getOwnedTokens(account).call();
  const tokenBalance = await contract.methods.balanceOf(account).call();
  console.log('Token Balance: ', tokenBalance);
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
  console.log("Data Array: ", dataArray);
  const images = dataArray.map(data => {
    return data.image.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/');
  });
  const tokenNames = dataArray.map(data => {
    return data.name;
  });
  const ints = [5, 6, 7];
  const url = 'https://fastload.infura-ipfs.io/ipfs/QmVbCAog9NFUMnuanNh76HkCQv6EoEaZ87E48Lbx23JYgr';
  var types = [];
  for (let i = 0; i < images.length; i++) {
    const req = await fetch(images[i], {method: 'HEAD'});
    types.push(req.headers.get('content-type'));
  }
  
  return {
    props: {
      ints,
      url,
      name,
      address,
      account,
      images,
      isTokenHolder,
      types,
      tokenNames,
      dataArray,
      mintDisabled,
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
	  <Header />
	  <h1>You have reached your mint allowance. Request more.</h1>
	<Card.Group>
	  {items}
	</Card.Group>
      </Layout>
      );
    } else {
      return (
	<Layout>
	  <Header />
	  <Link href={{pathname: '/minty', query: [this.props.address, this.props.account]}}>
	    <DynamicButton
	      color='olive'
	      isShowing={this.props.isTokenHolder && !this.props.mintDisabled}
	      label='Mint a new token'
	      marginBottom='10px'
	    />
	  </Link>
	  <Card.Group>
	    {items}
	  </Card.Group>
	</Layout>
      );
    }
  }
}
export default MyContract;
