import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import 'semantic-ui-css/semantic.min.css'
import { Button, Card } from 'semantic-ui-react'
import Layout from '../components/Layout'
import web3 from '../web3'
import IndexRow from '../components/IndexRow';
import React from 'react';
import Header from '../components/Header';
import TamboraFactory from '../artifacts/contracts/TamboraFactory.sol/TamboraFactory.json'
import Tambora from '../artifacts/contracts/Tambora.sol/Tambora.json'

export async function getServerSideProps() {
  const address = process.env.FACTORY_ADDRESS; // goerli
  // const address = '0x6996fe8fd3a5ddd9abe0e500c9b064c4e4e5b396'; // mainnet
  const factoryContract = new web3.eth.Contract(TamboraFactory.abi, address);
  const contracts = await factoryContract.methods.getDeployedContracts().call();
  const names = await factoryContract.methods.getNames().call();
  const defaultImage = 'https://fastload.infura-ipfs.io/ipfs/QmPQCBCY7VmAi2DJy9YWzn6BtFxyjaRogaKBeYP3JVz9Rx';
  var images = [defaultImage];
  try {
  const uris = await Promise.all(
    Array(parseInt(names.length)).fill().map((x, i) => {
      const contract = new web3.eth.Contract(Tambora.abi, contracts[i]);
	return contract.methods.tokenURI(0).call();
    })
  );
  const formattedUris = await Promise.all(
    uris.map(uri => {
      try {
	return uri.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/');
      } catch {
	return ["Nothing yet"];
      }
    })
  );
  const responses = await Promise.all(
    formattedUris.map((uri, i) => {
      try {
	return fetch(uri)
      } catch {
	return ["Nothing yet"];
      }
    })
  );
  const data = await Promise.all(
    responses.map((res, i) => {
      try {
	return res.json();
      } catch {
	return ["nothing yet"];
      }
    })
  );
  images = await Promise.all(
    data.map(meta => {
      try {
	return meta.image.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/');
      } catch {
	return defaultImage;
      }
    })
  );
  } catch { console.log("No Token Prime Minted") }


  // for (let i = 0; i < names.length; i++) {
  //   const contract = new web3.eth.Contract(abi, contracts[i]);
  //   contract.methods.tokenURI(0).call().then(uri => {
  //     const formattedURI = uri.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/');
  //     fetch(formattedURI).then(res => {
  // 	res.json().then(data => {
  // 	  const image = data.image.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/');
  // 	  console.log(image);
  // 	  images.push(image);
  // 	}).catch(error => {
  // 	  console.log("Error parsing");
  // 	  images.push(defaultImage);
  // 	})
  //     }).catch(error => {
  // 	console.log("Error fetching");
  // 	images.push(defaultImage);
  //     })
  //   }).catch(error => {
  //     console.log("Error calling contract");
  //     images.push(defaultImage);
  //   })
  // };

  const conObj = contracts.map((x, i) => {
    if (typeof images !== 'undefined') {
      return {"title": names[i].slice(0, 17), "address": x, "image": images[i], "description": `${x.slice(0, 17)}...`};
    } else {
      return {"title": names[i].slice(0, 17), "address": x, "image": defaultImage, "description": `${x.slice(0, 17)}...`};
    } 
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

class Index extends React.Component {
  state = {
    account: ''
  }
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
  }
  render() {
    const items = this.props.conObj.map((obj, index) => {
      return <IndexRow key={index} name={obj.title} address={obj.address} account={this.state.account} image={obj.image} />
    });
    return (
      <Layout>
	<Header source={this.props.conObj} account={this.state.account}/>
	<Card.Group>
	  {items}
	</Card.Group>
      </Layout>
    );
  }
}

export default Index;
