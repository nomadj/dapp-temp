import React, { Component } from 'react'
import { Card, Image, Embed, Button } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import TransferForm from '../../components/TransferForm'

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
      addr
    }
  }
}

export default class TokenShow extends Component {
  render() {
    if (this.props.filetype === 'image/png') {
      return (
	<Layout>
	  <Header />
	  <Card.Group itemsPerRow={4}>
	    <Card>
	      <Card.Content>
		<Image src={this.props.image} floated='right' size='mini' rounded />
		<Card.Header>{this.props.name}</Card.Header>
		<Button>Transfer</Button>
	      </Card.Content>
	    </Card>
	    <Card>
	      <Card.Content>
		<Card.Header>{this.props.attrTrait2.replace(this.props.attrTrait2.charAt(0), this.props.attrTrait2.charAt(0).toUpperCase())}</Card.Header>
		<Card.Description>{this.props.attrVal2}</Card.Description>
	      </Card.Content>	      
	    </Card>
	    <Card>
	      <Card.Content>
		<Card.Header>{this.props.attrTrait1.replace(this.props.attrTrait1.charAt(0), this.props.attrTrait1.charAt(0).toUpperCase())}</Card.Header>
		<Card.Description>{this.props.attrVal1}</Card.Description>
	      </Card.Content>
	    </Card>
	    <Card>
	      <Card.Content>
		<Card.Header>Description</Card.Header>
		<Card.Description>{this.props.description}</Card.Description>
	      </Card.Content>
	    </Card>
	    <Card>
	      <Card.Content>
		<Card.Header>{this.props.attrTrait3.replace(this.props.attrTrait3.charAt(0), this.props.attrTrait3.charAt(0).toUpperCase())}</Card.Header>
		<Card.Description>{this.props.attrVal3}</Card.Description>
	      </Card.Content>
	    </Card>
	    <TransferForm tokenId={this.props.tokenId} address={this.props.addr} marginLeft={10} />
	  </Card.Group>
	</Layout>
      );
    } else {
      return (
	<Layout>
	  <Header />
	  <Card.Group>
	    <Card>
	      <Card.Content>
		<Embed url={this.props.image} active={true} floated='right' size='mini' rounded />
		<Card.Header>{this.props.name}</Card.Header>
		<Card.Description>{this.props.attrTrait1}</Card.Description>
	      </Card.Content>
	    </Card>
	    <Card
	      header='Description'
	      content={this.props.description}
	    />
	    <Card>
	      <Card.Content>
		<Card.Header>{this.props.attrTrait1}</Card.Header>
		<Card.Description>{this.props.attrVal1}</Card.Description>
	      </Card.Content>
	    </Card>
	  </Card.Group>
	</Layout>
      );
    }
  }
}

