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
  state = {
    address: '',
    rows: 2
  };
  
  async componentDidMount() {
    let accounts = await web3.eth.getAccounts();
    this.setState({ address: accounts[0] });
    if (window.innerWidth < 800) {
      this.setState({ rows: 1 });
    }
  }
  
  render() {
    const items = this.props.images.map((image, index) => {
      return <NFT key={index} url={image} name={this.props.tokenNames[index]} address={this.props.address} type={this.props.types[index]} meta={this.props.dataArray[index]} tokenId={this.props.tokenIds[index]} />
    });
    if (this.props.mintDisabled) {
      return (
	<Layout>
	  <div>
	  <h2>You have reached your mint allowance.
	    <Link href='/'>
	      <a style={{ marginBottom: '10px' }} size='small'> Request More</a>
	    </Link>
	  </h2>
	    <h3>If this is incorrect, transfer your membership token to an unused Ethereum address.</h3>
	  </div>
	  <Divider />
	  <Card.Group itemsPerRow={this.state.rows}>
	    {items}
	  </Card.Group>
	</Layout>
      );
    } else {
      return (
	<Layout>
	  <Card.Group itemsPerRow={1}>
	    <Link href={{pathname: '/minty', query: [this.props.address, this.props.mintId]}}>
	      <Card style={{ border: '1px solid rgb(170,255, 195)' }}>
	      <Card.Content>
		<p style={{ width: '100%', textAlign: 'center', display: 'block', fontSize: 65, color: 'rgb(170,255,195)' }}>mint</p>
	      </Card.Content>
	    </Card>
	    </Link>		  
	  </Card.Group>

	  <Card.Group itemsPerRow={this.state.rows} style={{ overflowWrap: 'anywhere' }}>
	    {items}
	  </Card.Group>
	</Layout>
      );
    }
  }
}
export default MyContract;
