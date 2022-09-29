import Head from 'next/head';
import web3 from '../web3';
import { abi } from '../abi';
import Member from '../components/members';
import Layout from '../components/Layout';
// import React, { Component } from 'react';
import { Card, Embed } from 'semantic-ui-react';
import Link from 'next/link';

export async function getServerSideProps(props) {
  const address = props.resolvedUrl.replace('/', '');
  console.log(address);
  console.log(props.contracts);

  const res = await fetch('https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/8398');
  const data = await res.json();
  const image = data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
  const ints = [1, 2, 3]
  
  return {
    props: {
      image,
      ints
    },
  };
}

export default function MyContract({ image, ints }) {
  const items = ints.map((num, index) => {
    return <Link href="/">{Member(index)}</Link>;
  });
  return <Layout>
	   <Card.Group itemsPerRow={1}>
	     {items}
	   </Card.Group>
	 </Layout>;
}
