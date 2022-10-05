import Head from 'next/head';
import web3 from '../web3';
import { abi } from '../abi';
import Member from '../components/members';
import Layout from '../components/Layout';
import React, { useState, useEffect } from 'react';
import { Card, Embed } from 'semantic-ui-react';
import Link from 'next/link';
import NFT from '../components/NFT';

export async function getServerSideProps(props) {
  const name = props.query['1'];
  const address = props.query['0'];
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

const GetClientSideProps = () => {
  const [state, setState] = useState({ address: ''});
  useEffect(() => {
    async function account() {
      let accts = await web3.eth.getAccounts()
      let acct = accts[0];
      return acct
    }
    account().then(acct => {
      console.log('ACCOUNT: ', acct);
      
    });
  }, [])
  return null;
}  

class MyContract extends React.Component {
  state = { address: ''};
  render() {
    console.log(this.props);
    const { ints, name, url } = this.props;
    const items = ints.map((num, index) => {
      return <NFT key={index} url={url} name={name} address={this.state.address} />
    });
    return (
      <Layout>
	<GetClientSideProps />
	<Card.Group itemsPerRow={3}>
	  {items}
	</Card.Group>
      </Layout>
    );
  }
}
export default MyContract;
