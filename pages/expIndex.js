import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import 'semantic-ui-css/semantic.min.css'
import { Button, Card, Table } from 'semantic-ui-react'
import Layout from '../components/Layout'
import web3 from '../web3'
import { factoryAbi } from '../abi'
import IndexRow from '../components/IndexRow';
import React from 'react';

export async function getServerSideProps() {
  const address = '0x7B516015eA579dFa978Db3C3B75e677165a6E8C6'; // goerli
  // const address = '0x6996fe8fd3a5ddd9abe0e500c9b064c4e4e5b396'; // mainnet
  const factoryContract = new web3.eth.Contract(factoryAbi, address);
  const contracts = await factoryContract.methods.getDeployedContracts().call();
  const names = await factoryContract.methods.getNames().call();

  const conObj = contracts.map((x, i) => {
    return {"name": names[i], "address": x};
  });
  console.log(conObj);

  return {
    props: {
      contracts,
      names,
      conObj
    }
  }
}

export async function getServerSidePaths() {
  const paths = this.props.names.map(name => {
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

class Index extends React.Component {
  renderContracts() {
    const items = this.props.conObj.map(obj => {
      return {
	header: obj.name,
	description: (
      	  <Link href={{ pathname: `/${this.props.name}`, query: [this.props.address] }}>
	    <a>View Contract</a>
	  </Link>
	),
	fluid: true
      };
    });
    return <Card.Group items={items} />
  }
  
  render() {
    return (
      <Layout>
	<div>
	  {this.renderContracts()}
	</div>
      </Layout>
    );
  }
}

export default Index;
