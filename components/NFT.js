import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { Card, Image, Embed, Grid } from 'semantic-ui-react'

class NFT extends React.Component {
  render() {
    const { name, description, image, attributes } = this.props.meta;
    if (this.props.type === 'png' || this.props.type === 'image/jpeg') {
      return (
	<Link href={{pathname: `/${this.props.name}/tokenShow`, query: [this.props.address, this.props.type, this.props.tokenId]}} >
	  <Card color='olive'>
	    <Image src={this.props.url} wrapped ui={false} />
	    <Card.Content>
	      <Card.Header>{this.props.name}</Card.Header>
	      <a># {this.props.tokenId}</a>
	      <Card.Description>{description}</Card.Description>
	    </Card.Content>
	  </Card>
	</Link>
      );
    } else if (this.props.type === 'mp4') {
      return (
	<Link href={{pathname: `/${this.props.name}/tokenShow`, query: [this.props.address, this.props.type, this.props.tokenId]}} >
	  <Card color='olive'>
	    <Card.Content>
	      <Embed url={this.props.url} active={true} />
	    </Card.Content>
	    <Card.Content>
	      <Card.Header>{this.props.name}</Card.Header>
	      <a># {this.props.tokenId}</a>
	      <Card.Description>{description}</Card.Description>
	    </Card.Content>
	  </Card>
	</Link>
      );
    } else {
      return (
	<Card color='olive'>
	  <Card.Content>
	    <Card.Header>{this.props.name}</Card.Header>
	    <Link href={{pathname: `/${this.props.name}/tokenShow`, query: [this.props.address, name, description, image, this.props.type, attributes[0].trait_type, attributes[0].value, attributes[1].trait_type, attributes[1].value, attributes[2].trait_type, attributes[2].value, this.props.tokenId]}} >
		<a>{this.props.tokenId}</a>
	      </Link>
	    <Card.Description>{description}</Card.Description>
	  </Card.Content>
	</Card>	
      );
    }
  }
}
export default NFT;

  
