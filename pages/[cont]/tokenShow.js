import React, { Component } from 'react'
import { Card, Image, Embed, Button, Grid, Divider } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import TransferForm from '../../components/TransferForm'
import Tambora from '../../artifacts/contracts/Tambora.sol/Tambora.json'
import web3 from '../../web3'
import Link from 'next/link'
import DynamicButton from '../../components/DynamicButton'

export async function getServerSideProps(props) {
  // const contractName = props.query['cont'];
  const addr = props.query['0'];
  const filetype = props.query['1'];
  const tokenId = props.query['2'];
  const contract = new web3.eth.Contract(Tambora.abi, addr);
  const tokenData = await contract.methods.getTokenData(tokenId).call();
  const blockNumber = tokenData.blockNumber;
  const uri = tokenData.uri;
  const metadata = await fetch(uri.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/'));
  const data = await metadata.json();
  const attributes = data.attributes;
  const image = data.image.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/');
  const name = data.name;
  const description = data.description;
  console.log("EXTURL: ", data)
  const extUrl = data.external_url;
  
  return {
    props: {
      name,
      description,
      image,
      filetype,
      tokenId,
      addr,
      blockNumber,
      attributes,
      uri,
      extUrl
    }
  }
}

export default class TokenShow extends Component {
  async downloadFile(url, fileName) {

    const res = await fetch(url, { method: 'get', mode: 'cors', referrerPolicy: 'no-referrer' })
    const blob = await res.blob()
    const aElement = document.createElement('a');
    aElement.setAttribute('download', fileName);
    const href = URL.createObjectURL(blob);
    aElement.href = href;
    aElement.setAttribute('target', '_blank');
    aElement.click();
    URL.revokeObjectURL(href);
    this.setState({ loading: false });
  }   
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
    if (this.props.filetype === 'png' || this.props.filetype === 'jpeg') {  // TODO: Reduce this mess
      return (
	<Layout>
	  <Group itemsPerRow={3} style={{ overflowWrap: 'anywhere' }}>
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
	      <Content>
		<DynamicButton color='violet' size ='tiny' floated='right' onClick={() => this.downloadFile(this.props.extUrl.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/'), this.props.name.replace(' ', ''))} isShowing={this.props.extUrl !== ''} icon='download' />
		<Header>Aux File</Header>		
	      </Content>
	      <Content>
		<DynamicButton isShowing={true} color='violet' size ='tiny' floated='right' onClick={() => this.downloadFile(this.props.uri.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/'), this.props.name.replace(' ', '') + 'URI')} icon='download' />
		<Header>Metadata</Header>		
	      </Content>	      
	    </Card>
	    <Card color='olive'>
	      <Content>
		<Header>Description</Header>
		<Description>{this.props.description}</Description>
	      </Content>
	    </Card>
	  </Group>
	  <Group itemsPerRow={4}>
	    {this.renderAttributes()}
	  </Group>
	  <TransferForm tokenId={this.props.tokenId} address={this.props.addr} />
	  <Divider />
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
	      </Content>
	    </Card>
	  </Group>
	  <TransferForm tokenId={this.props.tokenId} address={this.props.addr} />
	  <Group itemsPerRow={4}>
	    {this.renderAttributes()}
	  </Group>
	</Layout>
      );
    }
  }
}
