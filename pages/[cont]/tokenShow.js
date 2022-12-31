import React, { Component } from 'react'
import { Card, Image, Embed, Button, Grid, Divider } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import TransferForm from '../../components/TransferForm'
import Tambora from '../../artifacts/contracts/Tambora.sol/Tambora.json'
import web3 from '../../web3'
import Link from 'next/link'
import DynamicButton from '../../components/DynamicButton'
import InfoMessage from '../../components/InfoMessage'

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
  const animUrl = data.animation_url || "";
  
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
      animUrl
    }
  }
}

export default class TokenShow extends Component {

  state = {
    loading: false,
    infoMessage: ''
  }
  
  async downloadFile(url, fileName) {
    this.setState({ loading: true, infoMessage: 'File will be located in your Downloads folder.' });
    const res = await fetch(url, { method: 'get', mode: 'cors', referrerPolicy: 'no-referrer' });
    const blob = await res.blob();
    const aElement = document.createElement('a');
    aElement.setAttribute('download', fileName);
    const href = URL.createObjectURL(blob);
    aElement.href = href;
    aElement.setAttribute('target', '_blank');
    aElement.click();
    URL.revokeObjectURL(href);
    setTimeout(() => this.setState({ infoMessage: '' }), 5000);
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
	      <Image src={this.props.image} alt='/64kOrange.png' rounded />
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
		<DynamicButton disabled={this.state.loading} loading={this.state.loading} color='violet' size ='tiny' floated='right' onClick={() => this.downloadFile(this.props.animUrl.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/'), this.props.name.replace(' ', ''))} isShowing={this.props.animUrl !== ''} icon='download' />
		<Header>Aux File</Header>		
	      </Content>
	      <Content>
		<DynamicButton disabled={this.state.loading} isShowing={true} color='violet' size ='tiny' floated='right' onClick={() => this.downloadFile(this.props.uri.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/'), this.props.name.replace(' ', '') + 'URI')} icon='download' />
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
	  <InfoMessage isShowing={!!this.state.infoMessage} header='Downloading...' content={this.state.infoMessage} />
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
	  <Group itemsPerRow={3} style={{ overflowWrap: 'anywhere' }}>
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
	      <Content>
		<DynamicButton color='violet' size ='tiny' floated='right' onClick={() => this.downloadFile(this.props.animUrl.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/'), this.props.name.replace(' ', ''))} isShowing={this.props.animUrl !== ''} icon='download' />
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
    }
  }
}
