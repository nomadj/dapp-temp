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
  const animUrl = data.animation_url || "";
  const auxUri = data.aux_uri || "";
  const auxFile = animUrl !== "" ? animUrl : auxUri
  
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
      auxFile
    }
  }
}

export default class TokenShow extends Component {

  state = {
    loading: false,
    infoMessage: '',
    mobile: false
  }
  componentDidMount() {
    if (window.innerWidth < 800) {
      this.setState({ mobile: true });
    }
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
	<Card style={{ borderBottom: '2px solid rgb(72,0,72)' }} key={i}>
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
	  <Group itemsPerRow={2} style={{ overflowWrap: 'anywhere' }}>
	    <Card style={{ borderBottom: '2px solid rgb(72,0,72)' }}>
	      <Content>
		<div style={{ maxHeight: 350, overflowY: 'auto', overflowX: 'auto' }}>
		  <Image src={this.props.image} alt='/64kOrange.png' rounded />
		</div>

		<Divider />
		<Header>Token #{this.props.tokenId}</Header>
	      </Content>
	    </Card>
	    <Card style={{ borderBottom: '2px solid rgb(72,0,72)' }}>
	      <Content>
		<Header>Name</Header>
		<Description>{this.props.name}</Description>
		<Divider />
		<Header>Origin</Header>
		<Description>Block # {this.props.blockNumber}</Description>
		<Divider />
		{this.state.mobile ? (
		  <Link href={this.props.auxFile.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/')}>
		  <DynamicButton disabled={this.state.loading} loading={this.state.loading} size ='tiny' floated='right' isShowing={this.props.auxFile!== ''} icon='download' /></Link>) : (
		    <DynamicButton disabled={this.state.loading} loading={this.state.loading} size ='tiny' floated='right' onClick={() => this.downloadFile(this.props.auxFile.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/'), this.props.name.replace(' ', ''))} isShowing={this.props.auxFile!== ''} icon='download' />)
		}
		<Header>Aux File</Header>		
		<Divider />

		<DynamicButton disabled={this.state.loading} isShowing={true} size ='tiny' floated='right' onClick={() => this.downloadFile(this.props.uri.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/'), this.props.name.replace(' ', '') + 'URI')} icon='download' />
		<Header>Metadata</Header>		
	      </Content>	      
	    </Card>
	    <Card style={{ borderBottom: '2px solid rgb(72,0,72)' }}>
	      <Content>
		<Header>Description</Header>
		<Divider />
		<div style={{ maxHeight: '150px', overflowX: 'auto' }}>
		  <Description>{this.props.description}</Description>
		</div>
	      </Content>
	    </Card>
	    <Card style={{ borderBottom: '2px solid rgb(72,0,72)' }}>
	      <Content>
		<Header>Transfer</Header>
		<Divider />
		<div style={{ maxHeight: '150px', overflowY: 'auto' }}>
		  <TransferForm tokenId={this.props.tokenId} address={this.props.addr} />
		</div>
	      </Content>
	    </Card>
	  </Group>
	  <InfoMessage isShowing={!!this.state.infoMessage} header='Downloading...' content={this.state.infoMessage} />
	  <Group itemsPerRow={2}>
	    {this.renderAttributes()}
	  </Group>
	  <Divider />
	</Layout>
      );
    } else if (this.props.filetype === 'mp4') {
      return (
	<Layout>
	  <Group itemsPerRow={2} style={{ overflowWrap: 'anywhere' }}>
	    <Card style={{ borderBottom: '2px solid rgb(72,0,72)' }}>
	      <Embed url={this.props.image} active={true} />
	      <Content>
		<Header>Token #{this.props.tokenId}</Header>
	      </Content>
	    </Card>
	    <Card style={{ borderBottom: '2px solid rgb(72,0,72)', maxHeight: 150, overflowX: 'auto' }}>
	      <Content>
		<Header>Name</Header>
		<Description>{this.props.name}</Description>
	      </Content>
	      <Content>
		<Header>Origin</Header>
		<Description>Block # {this.props.blockNumber}</Description>
	      </Content>
	      <Content>
		<DynamicButton size ='tiny' floated='right' onClick={() => this.downloadFile(this.props.animUrl.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/'), this.props.name.replace(' ', ''))} isShowing={this.props.animUrl !== ''} icon='download' />
		<Header>Aux File</Header>		
	      </Content>
	      <Content>
		<DynamicButton isShowing={true} color='violet' size ='tiny' floated='right' onClick={() => this.downloadFile(this.props.uri.replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/'), this.props.name.replace(' ', '') + 'URI')} icon='download' />
		<Header>Metadata</Header>		
	      </Content>	      
	    </Card>
	    <Card style={{ borderBottom: '2px solid rgb(72,0,72)' }}>
	      <Content>
		<Header>Description</Header>
		<div style={{ maxHeight: '150px', overflowY: 'auto' }}>
		  <Description>{this.props.description}</Description>
		</div>
	      </Content>
	    </Card>
	    <Card style={{ borderBottom: '2px solid rgb(72,0,72)' }}>
	      <Content>
		<div style={{ maxHeight: '150px', overflowY: 'auto' }}>
		  <TransferForm tokenId={this.props.tokenId} address={this.props.addr} />
		</div>
	      </Content>
	    </Card>
	  </Group>
	  <Group itemsPerRow={2}>
	    {this.renderAttributes()}
	  </Group>
	  <Divider />
	</Layout>
      );
    }
  }
}
