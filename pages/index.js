import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import 'semantic-ui-css/semantic.min.css'
// import React from 'react'
import { Button } from 'semantic-ui-react'
import Layout from '../components/Layout'
import web3 from '../web3'
import { factoryAbi } from '../abi'

export async function getServerSideProps() {
  const address = '0x3d040f0899Caae09062160d00Fe6D818f664Ff23'; // goerli
  // const address = '0x6996fe8fd3a5ddd9abe0e500c9b064c4e4e5b396'; // mainnet
  const contract = new web3.eth.Contract(factoryAbi, address);
  const contracts = await contract.methods.getDeployedContracts().call();
  return {
    props: {
      contracts
    }
  }
}

export default function Home() {
  return (
    <Layout>
      <Link href='/page-one'>
	<Button basic color='pink'>NFTs</Button>
      </Link>
    </Layout>
  )
}
