import Head from 'next/head';
import web3 from '../web3';
import { abi } from '../abi';
import Member from '../components/members';
import Layout from '../components/Layout';
// import React, { Component } from 'react';
import { Card, Embed } from 'semantic-ui-react';
import Link from 'next/link';

export async function getServerSideProps(props) {
  const name = props.query['cont'];
  const address = props.resolvedUrl.split('?')[1].replace('=', '');
  console.log(name);
  console.log(address);


  const res = await fetch('https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/8398');
  const data = await res.json();
  const image = data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
  const ints = [5, 6, 7]
  
  return {
    props: {
      image,
      ints
    },
  };
}

export default function MyContract({ image, ints }) {
  const items = ints.map((num, index) => {
    return <Link href="/">{Member(num)}</Link>;
  });
  return <Layout>
	   <Card.Group itemsPerRow={1}>
	     {items}
	   </Card.Group>
	 </Layout>;
}
