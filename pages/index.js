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
  const address = '0x7B516015eA579dFa978Db3C3B75e677165a6E8C6'; // goerli
  // const address = '0x6996fe8fd3a5ddd9abe0e500c9b064c4e4e5b396'; // mainnet
  const factoryContract = new web3.eth.Contract(factoryAbi, address);
  const contracts = await factoryContract.methods.getDeployedContracts().call();
  const names = await factoryContract.methods.getNames().call();

  const conObj = contracts.map((x, i) => {
    return {"name": names[i], "address": x};
  });

  return {
    props: {
      contracts,
      names,
      conObj
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

export default function Home({ contracts, names, conObj }) {
  const items = conObj.map(obj => {
    return <Link href={{ pathname: `/${obj.name}`, query: [obj.address] }}>{Member(obj.name)}</Link>;
  });
  return (
    <Layout>
      <Card.Group>
	{items}
      </Card.Group>
    </Layout>
  );
}
