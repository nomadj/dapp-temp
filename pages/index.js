import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import 'semantic-ui-css/semantic.min.css'
// import React from 'react'
import { Button, Card } from 'semantic-ui-react'
import Layout from '../components/Layout'
import web3 from '../web3'
import { factoryAbi } from '../abi'
import Member from '../components/members';

export async function getServerSideProps() {
  const address = '0x1fBd9B1b68C22f41950298Fe0F7F297A14ca72ca'; // goerli
  // const address = '0x6996fe8fd3a5ddd9abe0e500c9b064c4e4e5b396'; // mainnet
  const factoryContract = new web3.eth.Contract(factoryAbi, address);
  const contracts = await factoryContract.methods.getDeployedContracts().call();
  const names = await factoryContract.methods.getNames().call();

  return {
    props: {
      contracts,
      names
    }
  }
}

export async function getServerSidePaths({ names }) {
  const paths = names.map(name => {
    return {
      params: {
	id: name
      }
    };
  });
  
  return {
    paths,
    fallback: false
  };
}

export default function Home({ contracts, names }) {
  const items = names.map(item => {
    return <Link href={`/${item}`}>{Member(item)}</Link>;
  });
  return (
    <Layout>
      <Card.Group>
	{items}
      </Card.Group>
    </Layout>
  );
}
