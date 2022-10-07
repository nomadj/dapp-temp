import Head from 'next/head';
import web3 from '../web3';
import { abi } from '../abi';
import Member from '../components/members';
import Layout from '../components/Layout';
import React, { useState, useEffect } from 'react';
import { Card, Embed } from 'semantic-ui-react';
import Link from 'next/link';
import NFT from '../components/NFT';
import Header from '../components/Header'

export async function getServerSideProps(props) {
  const name = props.query['cont'];
  console.log("LOOK HERE: ", props.query['0']);
  // const address = props.query['0'];
  // const contract = new web3.eth.Contract(abi, address);
  // const conName = await contract.methods.name().call();
  // const res = await fetch('https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/8398');
  // const data = await res.json();
  // const image = data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
  const ints = [5, 6, 7]
  const url = 'https://fastload.infura-ipfs.io/ipfs/QmVbCAog9NFUMnuanNh76HkCQv6EoEaZ87E48Lbx23JYgr';

  
  return {
    props: {
      ints,
      url,
      name
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
    const items = this.props.ints.map((num, index) => {
      return <NFT key={index} url={this.props.url} name={this.props.name} address={this.state.address} />
    });
    return (
      <Layout>
	<Header />
	<Card.Group itemsPerRow={3}>
	  {items}
	</Card.Group>
      </Layout>
    );
  }
}
export default MyContract;
