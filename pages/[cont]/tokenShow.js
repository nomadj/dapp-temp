import React, { Component } from 'react'
import { Card, Image, Embed } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import Header from '../../components/Header'

export async function getServerSideProps(props) {
  const contractName = props.query['cont'];
  const addr = props.query['0'];
  const name = props.query['1'];
  const description = props.query['2'];
  const image = props.query['3'].replace('ipfs://', 'https://fastload.infura-ipfs.io/ipfs/');
  const filetype = props.query['4'];
  const attrTrait1 = props.query['5'];
  const attrVal1 = props.query['6'];
 
  return {
    props: {
      name,
      description,
      image,
      attrTrait1,
      attrVal1,
      filetype
    }
  }
}

export default class TokenShow extends Component {
  render() {
    if (this.props.filetype === 'image/png') {
      return (
	<Layout>
	  <Header />
	  <Card.Group>
	    <Card>
	      <Card.Content>
		<Image src={this.props.image} floated='right' size='mini' rounded />
		<Card.Header>{this.props.name}</Card.Header>
	      </Card.Content>
	    </Card>
	    <Card
	      header='Description'
	      content={this.props.description}
	    />
	    <Card>
	      <Card.Content>
		<Card.Header>Trait Type</Card.Header>
		<Card.Description>{this.props.attrTrait1}</Card.Description>
	      </Card.Content>
	    </Card>	
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
		<Card.Header>Trait Type</Card.Header>
		<Card.Description>{this.props.attrTrait1}</Card.Description>
	      </Card.Content>
	    </Card>	
	  </Card.Group>
	</Layout>
      );
    }
  }
}

