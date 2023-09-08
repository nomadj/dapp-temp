import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { Card, Image, Embed, Grid } from 'semantic-ui-react'

class NFT extends React.Component {
  render() {
    const { name, description, image, attributes } = this.props.meta;
    if (this.props.type === 'png' || this.props.type === 'jpeg') {
      return (
	<Link href={{pathname: `/${this.props.name}/tokenShow`, query: [this.props.address, this.props.type, this.props.tokenId]}} >
	  <Card style={{ borderBottom: '2px solid rgba(72,0,72)' }}>
	    <Card.Content>
	      <div style={{ maxHeight: 350, overflowX: 'auto', overflowY: 'auto' }}>
		<Image src={this.props.url} alt='/64kOrange.png' />
	      </div>
	    </Card.Content>
	    <Card.Content>
	      <Card.Header>#{this.props.tokenId} {this.props.name}</Card.Header>
	      <div style={{ maxHeight: 40, overflowX: 'auto' }}>
		<Card.Description>{description}</Card.Description>
	      </div>
	    </Card.Content>												     </Card>
	</Link>
      );
    } else if (this.props.type === 'mp4') {
      return (
	<Link href={{pathname: `/${this.props.name}/tokenShow`, query: [this.props.address, this.props.type, this.props.tokenId]}} >
	  <Card style={{ borderBottom: '2px solid rgba(72,0,72)' }}>
	    <Card.Content>
	      <div style={{ maxHeight: 350, overflowX: 'auto', overflowY: 'auto' }}>
		<Embed url={this.props.url} active={true} />
	      </div>
	    </Card.Content>
	    <Card.Content>
	      <Card.Header>#{this.props.tokenId} {this.props.name}</Card.Header>
	      <div style={{ maxHeight: 40, overflowX: 'auto' }}>
		<Card.Description>{description}</Card.Description>
	      </div>
	    </Card.Content>
	  </Card>
	</Link>
      );
    } else {
      return (
	<Link href={{pathname: `/${this.props.name}/tokenShow`, query: [this.props.address, this.props.type, this.props.tokenId]}} >
	  <Card style={{ borderBottom: '2px solid rgba(72,0,72)' }}>
	    <Card.Content>
	      <Card.Header>{this.props.name}</Card.Header>
	      <Card.Meta>{this.props.tokenId}</Card.Meta>
	      <Card.Description>{description}</Card.Description>
	    </Card.Content>
	  </Card>
	</Link>
      );
    }
  }
}
export default NFT;
