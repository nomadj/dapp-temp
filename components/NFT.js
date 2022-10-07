import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { Card, Image, Embed } from 'semantic-ui-react'

// <Image src={image} wrapped ui={false} />

class NFT extends React.Component {
  render() {
    return (
      <Card fluid color='olive'>
	<Embed url={this.props.url} active={true} />    
	<Card.Content>
	  <Card.Header>
	    <Link href="/">
	      <a>{this.props.name}</a>
	    </Link>
	  </Card.Header>
	</Card.Content>
      </Card>
    );
  }
}
export default NFT;

  
