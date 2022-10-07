import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import 'semantic-ui-css/semantic.min.css'
import { Button, Card } from 'semantic-ui-react'
import Layout from '../components/Layout'
import web3 from '../web3'
import { factoryAbi } from '../abi'
// import Member from '../components/members';
import IndexRow from '../components/IndexRow';
import React from 'react';
import Header from '../components/Header';

export async function getServerSideProps() {
  const address = '0x7B516015eA579dFa978Db3C3B75e677165a6E8C6'; // goerli
  // const address = '0x6996fe8fd3a5ddd9abe0e500c9b064c4e4e5b396'; // mainnet
  const factoryContract = new web3.eth.Contract(factoryAbi, address);
  const contracts = await factoryContract.methods.getDeployedContracts().call();
  const names = await factoryContract.methods.getNames().call();

  const conObj = contracts.map((x, i) => {
    return {"title": names[i], "address": x, "image": 'favicon.png'};
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

// export default function Home({ contracts, names, conObj }) {
//   const items = conObj.map(obj => {
//     return <Link href={{ pathname: `/${obj.name}`, query: [obj.address] }}>{Member(obj.name)}</Link>;
//   });
//   return (
//     <Layout>
//       <Card.Group>
// 	{items}
//       </Card.Group>
//     </Layout>
//   );
// }

class Index extends React.Component {
  render() {
    const items = this.props.conObj.map((obj, index) => {
      return <IndexRow key={index} name={obj.title} address={obj.address} />
    });
    return (
      <Layout>
	<Header source={this.props.conObj}/>
	<Card.Group>
	  {items}
	</Card.Group>
      </Layout>
    );
  }
}

export default Index;
