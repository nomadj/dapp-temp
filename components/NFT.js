import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { Card, Image, Embed } from 'semantic-ui-react'

class NFT extends React.Component {
  render() {
    const { name, description, image, attributes } = this.props.meta;
    if (this.props.type === 'image/png') {
      return (
        <Card color='olive'>
	  <Image src={this.props.url} wrapped ui={false} />
	  <Card.Content>
	    <Card.Header>
	      <Link href={{pathname: `/${this.props.name}/tokenShow`, query: [this.props.address, name, description, image, this.props.type, attributes[0].trait_type, attributes[0].value, attributes[1].trait_type, attributes[1].value, attributes[2].trait_type, attributes[2].value]}} >
		<a>{this.props.name}</a>
	      </Link>
	    </Card.Header>
	  </Card.Content>
	</Card>
      );
    } else {
      return (
	<Card color='olive'>
	  <Embed url={this.props.url} active={true} />    
	  <Card.Content>
	    <Card.Header>
	      <Link href={{pathname: `/${this.props.name}/tokenShow`, query: [this.props.address, name, description, image, this.props.type, attributes[0].trait_type, attributes[0].value]}} >
		<a>{this.props.name}</a>
	      </Link>
	    </Card.Header>
	  </Card.Content>
	</Card>
      );
    }
  }
}
export default NFT;

  
