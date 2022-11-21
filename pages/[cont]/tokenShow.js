import React, { Component } from 'react'
import { Card, Image, Embed, Button, Grid, Divider } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import TransferForm from '../../components/TransferForm'
import Tambora from '../../artifacts/contracts/Tambora.sol/Tambora.json'
import web3 from '../../web3'
import Link from 'next/link'

export async function getServerSideProps(props) {
  const contractName = props.query['cont'];
  const addr = props.query['0'];
  const name = props.query['1'];
  const description = props.query['2'];
  const image = props.query['3'].replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/');
  const filetype = props.query['4'];
  const attrTrait1 = props.query['5'];
  const attrVal1 = props.query['6'];
  const attrTrait2 = props.query['7'];
  const attrVal2 = props.query['8'];
  const attrTrait3 = props.query['9'];
  const attrVal3 = props.query['10'];
  const tokenId = props.query['11'];
  const contract = new web3.eth.Contract(Tambora.abi, addr);
  const tokenData = await contract.methods.getTokenData(tokenId).call();
  const blockNumber = tokenData.blockNumber;
  const uri = tokenData.uri;
  const metadata = await fetch(uri.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/'));
  const data = await metadata.json();
  const attributes = data.attributes;
  
  return {
    props: {
      name,
      description,
      image,
      attrTrait1,
      attrVal1,
      attrTrait2,
      attrVal2,
      attrTrait3,
      attrVal3,
      filetype,
      tokenId,
      addr,
      blockNumber,
      attributes,
      uri
    }
  }
}

export default class TokenShow extends Component {
  renderAttributes = () => {
    const { Header, Content, Description } = Card;
    const attributes = this.props.attributes.map((attr, i) => {
      return (
	<Card color='violet' key={i}>
	  <Content>
	  <Header>{attr.trait_type}</Header>
	    <Description>{attr.value}</Description>
	  </Content>
	</Card>
      );
    });
    return attributes;
  }
  render() {
    const { Group, Content, Header, Description } = Card;
    if (this.props.filetype === 'png') {  // TODO: Reduce this mess
      return (
	<Layout>
	  <Group itemsPerRow={4} style={{ overflowWrap: 'anywhere' }}>
	    <Card color='olive'>
	      <Image src={this.props.image} rounded />
	      <Content>
		<Description>Token # {this.props.tokenId}</Description>
	      </Content>
	    </Card>
	    <Card color='olive'>
	      <Content>
		<Header>Name</Header>
		<Description>{this.props.name}</Description>
	      </Content>
	      <Content>
		<Header>Origin</Header>
		<Description>Block # {this.props.blockNumber}</Description>
	      </Content>	      
	    </Card>
	    <Card color='olive'>
	      <Content>
		<Header>Description</Header>
		<Description>{this.props.description}</Description>
	      </Content>
	      <Content>
		<Header>URI</Header>
		<Link href={`https://fastload.infura-ipfs.io/ipfs/${this.props.uri.replace('ipfs://', '')}`}>
		  <a>{this.props.uri}</a>
		</Link>
	      </Content>
	    </Card>
	    <Card color='olive'>
	      <Content>
		<TransferForm tokenId={this.props.tokenId} address={this.props.addr} />
	      </Content>
	    </Card>
	  </Group>
	  <Group itemsPerRow={4}>
	    {this.renderAttributes()}
	  </Group>
	</Layout>
      );
    } else if (this.props.filetype === 'mp4') {
      return (
	<Layout>
	  <Group itemsPerRow={4} style={{ overflowWrap: 'anywhere' }}>
	    <Card color='olive'>
	      <Embed url={this.props.image} active={true} rounded />
	      <Content>
		<Description>Token # {this.props.tokenId}</Description>
	      </Content>	      
	    </Card>
	    <Card color='olive'>
	      <Content>
		<Header>Name</Header>
		<Description style={{ marginTop: '5px'}}>{this.props.name}</Description>
	      </Content>
	      <Content>
		<Header>{this.props.attrTrait2.replace(this.props.attrTrait2.charAt(0), this.props.attrTrait2.charAt(0).toUpperCase())}</Header>
		<Description>{this.props.attrVal2}</Description>
	      </Content>
	      <Content>
		<Header>{this.props.attrTrait1.replace(this.props.attrTrait1.charAt(0), this.props.attrTrait1.charAt(0).toUpperCase())}</Header>
		<Description>{this.props.attrVal1}</Description>
	      </Content>      	      
	    </Card>
	    <Card color='olive'>
	      <Content>
		<Header>Origin</Header>
		<Description>Block # {this.props.blockNumber}</Description>
	      </Content>	      
	      <Content>
		<Header>Description</Header>
		<Description>{this.props.description}</Description>
	      </Content>
	      <Content>
		<Header>{this.props.attrTrait3.replace(this.props.attrTrait3.charAt(0), this.props.attrTrait3.charAt(0).toUpperCase())}</Header>
		<Description>{this.props.attrVal3}</Description>
	      </Content>
	    </Card>
	    <Card color='olive'>
	      <Content>
		<TransferForm tokenId={this.props.tokenId} address={this.props.addr} />
	      </Content>	      	      
	    </Card>
	    <Card color='olive'>
	      <Content>
		
	      </Content>
	    </Card>
	  </Group>
	</Layout>
      );
    }
  }
}

